// Where functionality that specifically interacts with the boards should go

package main

import (
	"encoding/json"
	"time"
)

func SendBoardCommand(command CommandPost) {
	jsonB, _ := json.Marshal(command)
	jsonData := string(jsonB)
	boardMessage := WSMessage{WSSendCommand, jsonData, time.Now().Unix()}
	msgB, _ := json.Marshal(boardMessage)

	for _, ch := range Context.ConnectionChannels {
		ch <- string(msgB)
	}
}
