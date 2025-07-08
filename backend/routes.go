package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
)

func GetPackets(w http.ResponseWriter, r *http.Request) {
	packets, err := GetPacketsDB(1)
	if err != nil {
		io.WriteString(w, "Failed to get packets")
		return
	}

	jsonData, err := json.Marshal(packets)
	if err != nil {
		log.Println(err)
		io.WriteString(w, "Failed to encode packets")
		return
	}

	io.WriteString(w, string(jsonData))

}

func SendCommand(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading body", http.StatusInternalServerError)
		log.Printf("Error reading body: %v", err)
		return
	}

	var bodyStruct struct {
		Command string `json:"command"`
	}

	err = json.Unmarshal(body, &bodyStruct)
	if err != nil {
		http.Error(w, "Error parsing body", http.StatusInternalServerError)
		log.Println("Failed to parse body")
		return
	}

	// Will just send to all connections for now
	for _, ch := range Context.ConnectionChannels {
		data, err := json.Marshal(WebsocketPacket{WSSendCommand, WSSendCommandPacket{bodyStruct.Command}})
		if err != nil {
			http.Error(w, "Error making packet", http.StatusInternalServerError)
			log.Println("Failed to make packet")
			return
		}

		ch <- string(data)
	}

}
