package main

import (
	"fmt"
	"log"
	"net/http"
	"strings"
)

type AppContext struct {
	ConnectionChannels map[string]chan string
}

var Context = AppContext{}

type HandlerMethod int

const (
	GET HandlerMethod = iota
	POST
	PATCH
	DELETE
)

func (m HandlerMethod) String() string {
	switch m {
	case GET:
		return "get"
	case POST:
		return "post"
	case PATCH:
		return "patch"
	case DELETE:
		return "delete"
	default:
		return "unknown"
	}
}

func handleFunc(method HandlerMethod, path string, handler func(w http.ResponseWriter, r *http.Request)) {
	http.HandleFunc(fmt.Sprintf("/api/%s/%s", method.String(), path), func(w http.ResponseWriter, r *http.Request) {
		if r.Method != strings.ToUpper(method.String()) {
			w.Header().Set("Allow", strings.ToUpper(method.String()))
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		handler(w, r)

	})

}

func main() {
	log.Println("Starting up backend server.")

	Context.ConnectionChannels = make(map[string]chan string)
	InitializeDB()
	defer Database.Close()

	handleFunc(GET, "ws", WsHandler)
	handleFunc(GET, "packets", GetPackets)
	handleFunc(GET, "missions", GetMissions)
	handleFunc(GET, "mission", GetMission)
	handleFunc(POST, "mission", AddMission)
	handleFunc(GET, "schema", GetSchema)
	handleFunc(PATCH, "schema", PatchSchema)
	handleFunc(GET, "commands", GetCommands)
	handleFunc(PATCH, "commands", PatchCommands)
	handleFunc(PATCH, "command", UpdateCommand)
	handleFunc(DELETE, "command", DeleteCommand)
	handleFunc(POST, "command", HandleCommand)

	log.Fatal(http.ListenAndServe(":8080", nil))
}
