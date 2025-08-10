package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

func frontendWsLoop(conn *websocket.Conn, ch chan string) {
	wsReadChan := make(chan wsReadResult)

	go func() {
		for {
			msgType, p, err := conn.ReadMessage()
			wsReadChan <- wsReadResult{msgType, p, err}
			if err != nil {
				return
			}
		}
	}()

	defer func() {
		delete(Context.FrontendConnectionChannels, conn.RemoteAddr().String())
		close(ch)
		conn.Close()
		log.Printf("Closed frontend websocket connection for %s", conn.RemoteAddr().String())
	}()

	for {
		select {
		case readResult := <-wsReadChan:
			if readResult.err != nil {
				log.Printf("Frontend client disconnected: %s. Error: %v", conn.RemoteAddr().String(), readResult.err)
				return
			}

			log.Printf("Received message from frontend client %s: %s", conn.RemoteAddr().String(), string(readResult.data))

			var packet WebsocketPacket
			err := json.Unmarshal(readResult.data, &packet)
			if err != nil {
				log.Println("Failed to parse websocket event")
				continue
			}

			switch packet.EventType {
			case WSReceiveName:
				log.Println("Received name from frontend. Broadcasting to satellite connections.")
				broadcastMessage := string(readResult.data)
				for id, ch := range Context.ConnectionChannels {
					go func(c chan string, connId string) {
						defer func() {
							if r := recover(); r != nil {
								log.Printf("Error sending to satellite client %s: %v. Likely a closed channel.", connId, r)
							}
						}()
						select {
						case c <- broadcastMessage:
							// success
						default:
							log.Printf("Satellite connection %s channel full, dropping message.", connId)
						}
					}(ch, id)
				}
			}

		case value, ok := <-ch:
			if !ok {
				conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			if err := conn.WriteMessage(websocket.TextMessage, []byte(value)); err != nil {
				log.Println(err)
				return
			}
		}
	}
}

func FrontendWsHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("New frontend websocket connection request")

	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	ch := make(chan string)
	Context.FrontendConnectionChannels[conn.RemoteAddr().String()] = ch
	log.Printf("New frontend client connected: %s", conn.RemoteAddr().String())

	go frontendWsLoop(conn, ch)
}
