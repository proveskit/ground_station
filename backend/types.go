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

type DBProvesPacket struct {
	Id     int       `json:"id,omitempty"`
	Time   time.Time `json:"time,omitempty"`
	Packet string    `json:"packet,omitempty"`
}
