package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"

	"github.com/jackc/pgx/v5"
)

func AddMission(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading body", http.StatusInternalServerError)
		log.Printf("Error reading body: %v", err)
		return
	}

	var bodyStruct struct {
		Name string `json:"name"`
	}

	err = json.Unmarshal(body, &bodyStruct)
	if err != nil {
		http.Error(w, "Error parsing body", http.StatusInternalServerError)
		log.Println("Failed to parse body")
		return
	}

	err = DBAddMission(bodyStruct.Name)
	if err != nil {
		http.Error(w, "Error processing request", http.StatusInternalServerError)
		log.Println("Failed to write mission to database")
		return
	}
}

func GetMissions(w http.ResponseWriter, r *http.Request) {
	missions, err := DBGetMissions()
	if err != nil {
		http.Error(w, "Failed to get missions", http.StatusInternalServerError)
		return
	}

	jsonData, err := json.Marshal(missions)
	if err != nil {
		log.Println(err)
		http.Error(w, "Failed to process missions", http.StatusInternalServerError)
		return
	}

	io.WriteString(w, string(jsonData))

}

func GetMission(w http.ResponseWriter, r *http.Request) {
	missionIdStr := r.URL.Query().Get("id")
	if missionIdStr == "" {
		http.Error(w, "Missing 'id' query parameter", http.StatusBadRequest)
		return
	}

	missionId, err := strconv.Atoi(missionIdStr)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid input for mission id: %v", missionIdStr), http.StatusBadRequest)
		return
	}

	mission, err := DBGetMission(missionId)
	if err != nil {
		log.Printf("Failed to get mission: %v", err)
		http.Error(w, "Failed to get mission", http.StatusInternalServerError)
		return
	}

	jsonData, err := json.Marshal(mission)
	if err != nil {
		log.Println(err)
		http.Error(w, "Failed to process mission", http.StatusInternalServerError)
		return
	}

	io.WriteString(w, string(jsonData))
}

func GetSchema(w http.ResponseWriter, r *http.Request) {
	missionIdStr := r.URL.Query().Get("id")
	if missionIdStr == "" {
		http.Error(w, "Missing 'id' query parameter", http.StatusBadRequest)
		return
	}

	missionId, err := strconv.Atoi(missionIdStr)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid input for mission id: %v", missionIdStr), http.StatusBadRequest)
		return
	}

	schema, err := DBGetSchema(missionId)
	if err != nil {
		if err == pgx.ErrNoRows {
			schema = DBSchema{
				MissionId: missionId,
				Schema:    "",
			}
		} else {
			http.Error(w, "Failed to get schema", http.StatusInternalServerError)
			fmt.Printf("Error getting schema: %v", err)
			return
		}
	}

	jsonData, err := json.Marshal(schema)
	if err != nil {
		log.Println(err)
		http.Error(w, "Failed to process schema", http.StatusInternalServerError)
		return
	}

	io.WriteString(w, string(jsonData))
}

func PatchSchema(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read body", http.StatusInternalServerError)
		return
	}

	var parsedBody struct {
		MissionId int    `json:"missionId"`
		Schema    string `json:"schema"`
	}

	err = json.Unmarshal(body, &parsedBody)
	if err != nil {
		http.Error(w, "Failed to parse body", http.StatusInternalServerError)
		log.Println(err)
		return
	}

	err = DBAddSchema(parsedBody.MissionId, parsedBody.Schema)
	if err != nil {
		http.Error(w, "Failed to add schema to db", http.StatusInternalServerError)
		log.Println(err)
		return
	}

	io.WriteString(w, "Successfully added packet schema")
}

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
