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

func parseRequestBody(r *http.Request, v interface{}) error {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		return err
	}

	err = json.Unmarshal(body, v)
	if err != nil {
		return err
	}

	return nil
}

func AddMission(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	var bodyStruct struct {
		Name string `json:"name"`
	}

	err := parseRequestBody(r, &bodyStruct)
	if err != nil {
		http.Error(w, "Error parsing body", http.StatusInternalServerError)
		log.Printf("Error parsing body: %v", err)
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

	var parsedBody struct {
		MissionId int    `json:"missionId"`
		Schema    string `json:"schema"`
	}

	err := parseRequestBody(r, &parsedBody)
	if err != nil {
		http.Error(w, "Failed to parse body", http.StatusInternalServerError)
		log.Printf("Error parsing body: %v", err)
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

	packets, err := DBGetPackets(missionId, 1)
	if err != nil {
		io.WriteString(w, "Failed to get packets")
		return
	}

	dbSchema, err := DBGetSchema(missionId)
	if err != nil {
		io.WriteString(w, "Failed to get schema")
		return
	}

	// Doing it like this so that in the response the schema is returned
	// as proper json and not just a string, could also just JSON.parse on
	// the frontend instead
	var schema any
	_ = json.Unmarshal([]byte(dbSchema.Schema), &schema)

	var response struct {
		Schema  any        `json:"schema"`
		Packets []DBPacket `json:"packets"`
	}

	response.Schema = schema
	response.Packets = packets

	jsonData, err := json.Marshal(response)
	if err != nil {
		log.Println(err)
		io.WriteString(w, "Failed to encode packets")
		return
	}

	io.WriteString(w, string(jsonData))

}

func SendCommand(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	var bodyStruct struct {
		Command string `json:"command"`
	}

	err := parseRequestBody(r, &bodyStruct)
	if err != nil {
		http.Error(w, "Error parsing body", http.StatusInternalServerError)
		log.Printf("Error parsing body: %v", err)
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

func PatchCommands(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	var bodyStruct struct {
		MissionId int       `json:"missionId"`
		Commands  []Command `json:"commands"`
	}

	err := parseRequestBody(r, &bodyStruct)
	if err != nil {
		http.Error(w, "Error parsing body", http.StatusInternalServerError)
		log.Printf("Error parsing body: %v", err)
		return
	}

	for _, cmd := range bodyStruct.Commands {
		argsJson, err := json.Marshal(cmd.Args)
		if err != nil {
			http.Error(w, "Error marshaling command args", http.StatusInternalServerError)
			log.Printf("Error marshaling args: %v", err)
			return
		}

		err = DBAddCommand(bodyStruct.MissionId, cmd.Name, cmd.Description, string(argsJson), cmd.CmdString)
		if err != nil {
			http.Error(w, "Error adding command to database", http.StatusInternalServerError)
			log.Printf("Error adding command: %v", err)
			return
		}
	}

	io.WriteString(w, "Successfully added commands")
}

func GetCommands(w http.ResponseWriter, r *http.Request) {
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

	dbCommands, err := DBGetCommands(missionId)
	if err != nil {
		http.Error(w, "Failed to get commands", http.StatusInternalServerError)
		log.Printf("Error getting commands: %v", err)
		return
	}

	// Convert DBCommand to Command to properly unmarshal Args
	var commands []Command
	for _, dbCmd := range dbCommands {
		var args map[string]CommandArg
		_ = json.Unmarshal([]byte(dbCmd.Args), &args)
		
		commands = append(commands, Command{
			Name:        dbCmd.Name,
			Description: dbCmd.Description,
			Args:        args,
			CmdString:   dbCmd.CmdString,
		})
	}

	jsonData, err := json.Marshal(commands)
	if err != nil {
		log.Println(err)
		http.Error(w, "Failed to process commands", http.StatusInternalServerError)
		return
	}

	io.WriteString(w, string(jsonData))
}

func UpdateCommand(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	var bodyStruct struct {
		Id          int                   `json:"id"`
		Name        string                `json:"name"`
		Description string                `json:"description"`
		Args        map[string]CommandArg `json:"args"`
		CmdString   string                `json:"cmd_string"`
	}

	err := parseRequestBody(r, &bodyStruct)
	if err != nil {
		http.Error(w, "Error parsing body", http.StatusInternalServerError)
		log.Printf("Error parsing body: %v", err)
		return
	}

	argsJson, err := json.Marshal(bodyStruct.Args)
	if err != nil {
		http.Error(w, "Error marshaling command args", http.StatusInternalServerError)
		log.Printf("Error marshaling args: %v", err)
		return
	}

	err = DBUpdateCommand(bodyStruct.Id, bodyStruct.Name, bodyStruct.Description, string(argsJson), bodyStruct.CmdString)
	if err != nil {
		http.Error(w, "Error updating command", http.StatusInternalServerError)
		log.Printf("Error updating command: %v", err)
		return
	}

	io.WriteString(w, "Successfully updated command")
}

func DeleteCommand(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, "Missing 'id' query parameter", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid input for command id: %v", idStr), http.StatusBadRequest)
		return
	}

	err = DBDeleteCommand(id)
	if err != nil {
		http.Error(w, "Error deleting command", http.StatusInternalServerError)
		log.Printf("Error deleting command: %v", err)
		return
	}

	io.WriteString(w, "Successfully deleted command")
}
