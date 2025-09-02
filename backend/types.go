package main

import "time"

type EventType int

const (
	WSNewPacket EventType = iota
	WSSendCommand
)

type DBMission struct {
	Id        int       `json:"id,omitempty"`
	Name      string    `json:"name,omitempty"`
	CreatedAt time.Time `json:"created_at,omitempty"`
}

type DBSchema struct {
	Id        int    `json:"id"`
	MissionId int    `json:"mission_id"`
	Schema    string `json:"schema"`
}

type WebsocketPacket struct {
	EventType EventType   `json:"event_type,omitempty"`
	Data      interface{} `json:"data,omitempty"`
}

type WSSendCommandPacket struct {
	Command string `json:"command,omitempty"`
}

type WSProvesPacket struct {
	Time     string `json:"time,omitempty"`
	Level    string `json:"level,omitempty"`
	Msg      string `json:"msg,omitempty"`
	Response string `json:"response,omitempty"`
}

type DBPacket struct {
	Id         int       `json:"id,omitempty"`
	MissionId  int       `json:"mission_id,omitempty"`
	SchemaId   int       `json:"schema_id,omitempty"`
	ReceivedAt time.Time `json:"received_at,omitempty"`
	PacketData string    `json:"packet_data,omitempty"`
}

type Command struct {
	Name        string                `json:"name,omitempty"`
	Description string                `json:"description,omitempty"`
	CmdString   string                `json:"cmd_string,omitempty"`
	Args        map[string]CommandArg `json:"args,omitempty"`
}

type CommandArg struct {
	Required bool `json:"required,omitempty"`
}

type DBCommand struct {
	Id          int    `json:"id,omitempty"`
	MissionId   int    `json:"mission_id,omitempty"`
	Name        string `json:"name,omitempty"`
	Description string `json:"description,omitempty"`
	Args        string `json:"args,omitempty"`
	CmdString   string `json:"cmd_string,omitempty"`
}
