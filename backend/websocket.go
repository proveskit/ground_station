// Package main provides WebSocket functionality for real-time communication
// between the ground station backend and connected clients.
package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

// upgrader configures the WebSocket connection upgrade parameters
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// wsReadResult encapsulates the result of a WebSocket read operation
type wsReadResult struct {
	messageType int
	data        []byte
	err         error
}

// Data represents packet data received via WebSocket from satellite connections
type Data struct {
	MissionId int    `json:"mission_id"`
	Packet    string `json:"packet,omitempty"`
}

// wsLoop handles the main WebSocket communication loop for a single connection.
// It processes incoming messages and sends outgoing messages through the provided channel.
func wsLoop(conn *websocket.Conn, ch chan string) {
	wsReadChan := make(chan wsReadResult)

	// Start a goroutine to continuously read messages from the WebSocket connection
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

	// Main event loop: handle incoming WebSocket messages and outgoing channel messages
	for {
		select {
		// Handle incoming WebSocket messages
		case readResult := <-wsReadChan:
			if readResult.err != nil {
				log.Println(readResult.err)
				close(ch)
				return
			}

			log.Println(string(readResult.data))

			// Parse the incoming WebSocket packet
			var packet WebsocketPacket
			err := json.Unmarshal(readResult.data, &packet)
			if err != nil {
				log.Println("Failed to parse websocket event")
				continue
			}

			// Handle different types of WebSocket events
			switch packet.EventType {
			case WSNewPacket:
				// Process incoming satellite packet data
				var data Data
				log.Println(packet.Data)

				dataBytes := []byte(packet.Data.(string))

				err = json.Unmarshal(dataBytes, &data)
				if err != nil {
					log.Println("Failed to parse WSNewPacket", err)
					return
				}

				// Get the packet schema for this mission
				schema, err := DBGetSchema(data.MissionId)
				if err != nil {
					log.Println("Failed to get schema", err)
					return
				}

				// Parse the schema definition
				var parsedSchema []SchemaField
				err = json.Unmarshal([]byte(schema.Schema), &parsedSchema)
				if err != nil {
					log.Println("Failed to parse schema", err)
					return
				}

				// Validate and process the packet against the schema
				valid, err := ProcessPacket(data.Packet, parsedSchema)
				if err != nil {
					log.Println(err)
					return
				}
				if !valid {
					log.Println("Packet not valid", err)
					return
				}

				// Store the validated packet in the database
				DBAddPacket(data.MissionId, schema.Id, data.Packet)
			}

		// Handle outgoing messages to be sent to the WebSocket client
		case value := <-ch:
			if err := conn.WriteMessage(websocket.TextMessage, []byte(value)); err != nil {
				log.Println(err)
				close(ch)
				return
			}
		}
	}
}

// WsHandler handles HTTP requests to upgrade to WebSocket connections.
// It establishes a new WebSocket connection and starts the message processing loop.
func WsHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("New websocket connection")

	// Upgrade the HTTP connection to a WebSocket connection
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	// Create a channel for sending messages to this specific connection
	ch := make(chan string)
	// TODO: Change to use the mission id instead
	Context.ConnectionChannels[conn.LocalAddr().String()] = ch

	// Start the WebSocket message processing loop in a goroutine
	go wsLoop(conn, ch)
}
