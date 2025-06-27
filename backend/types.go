package main

import "time"

type EventType int

const (
	NewPacket EventType = iota
)

type WebsocketEvent struct {
	EventType EventType    `json:"event_type,omitempty"`
	Data      ProvesPacket `json:"data,omitempty"`
}

type ProvesPacket struct {
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
