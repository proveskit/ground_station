package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type wsReadResult struct {
	messageType int
	data        []byte
	err         error
}

func wsLoop(conn *websocket.Conn, ch chan string) {
	wsReadChan := make(chan wsReadResult)

	go func() {
		for {
			msgType, p, err := conn.ReadMessage()
			wsReadChan <- wsReadResult{msgType, p, err}
			if err != nil {
				log.Println(err)
				return
			}
		}
	}()

	for {
		select {
		case readResult := <-wsReadChan:
			if readResult.err != nil {
				log.Println(readResult.err)
				close(ch)
				return
			}

			log.Println(string(readResult.data))

			var packet WebsocketPacket
			err := json.Unmarshal(readResult.data, &packet)
			if err != nil {
				log.Println("Failed to parse websocket event")
				continue
			}

			switch packet.EventType {
			case WSNewPacket:
				if data, ok := packet.Data.(WSProvesPacket); ok {
					AddPacket(data)
				} else {
					log.Println("Failed to parse proves packet")
				}
			case WSLeaderboardRefresh:
				log.Println("Broadcasting leaderboard refresh to frontend clients")
				broadcastMessage := string(readResult.data)
				for id, ch := range Context.FrontendConnectionChannels {
					go func(c chan string, connId string) {
						defer func() {
							if r := recover(); r != nil {
								log.Printf("Error sending to frontend client %s: %v. Likely a closed channel.", connId, r)
							}
						}()
						select {
						case c <- broadcastMessage:
							// success
						default:
							log.Printf("Frontend connection %s channel full, dropping leaderboard refresh.", connId)
						}
					}(ch, id)
				}
			case WSSendBooths:
				log.Println("Broadcasting send booths event to frontend clients")
				broadcastMessage := string(readResult.data)
				for id, ch := range Context.FrontendConnectionChannels {
					go func(c chan string, connId string) {
						defer func() {
							if r := recover(); r != nil {
								log.Printf("Error sending to frontend client %s: %v. Likely a closed channel.", connId, r)
							}
						}()
						select {
						case c <- broadcastMessage:
							// success
						default:
							log.Printf("Frontend connection %s channel full, dropping send booths event.", connId)
						}
					}(ch, id)
				}
			}

		case value := <-ch:
			if err := conn.WriteMessage(websocket.TextMessage, []byte(value)); err != nil {
				log.Println(err)
				close(ch)
				return
			}
		}
	}
}

func WsHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("New websocket connection")

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	ch := make(chan string)
	// Should be changed to some type of identifier, like maybe the name of the mission
	Context.ConnectionChannels[conn.LocalAddr().String()] = ch

	go wsLoop(conn, ch)
}
