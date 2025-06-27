package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type AppContext struct {
	ConnectionChannels map[string]chan string
}

var Context = AppContext{}

type wsReadResult struct {
	messageType int
	data        any
	err         error
}

func wsLoop(conn *websocket.Conn, ch chan string) {
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

	for {
		select {
		case readResult := <-wsReadChan:
			if readResult.err != nil {
				log.Println(readResult.err)
				close(ch)
				return
			}
			log.Println(readResult.data)
		case value := <-ch:
			if err := conn.WriteMessage(websocket.TextMessage, []byte(value)); err != nil {
				log.Println(err)
				close(ch)
				return
			}
		}
	}
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("New websocket connection")

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	ch := make(chan string)
	Context.ConnectionChannels[conn.LocalAddr().String()] = ch

	go wsLoop(conn, ch)
}

func communicate(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()
	value := params.Get("value")

	log.Println(value)

	for _, ch := range Context.ConnectionChannels {
		ch <- value
	}

}

func main() {
	log.Println("Starting up backend server.")

	Context.ConnectionChannels = make(map[string]chan string)

	http.HandleFunc("/ws", wsHandler)
	http.HandleFunc("/communicate", communicate)

	log.Fatal(http.ListenAndServe(":8080", nil))
}
