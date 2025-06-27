package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
)

func GetPackets(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		return
	}

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
