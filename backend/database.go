package main

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"

	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/joho/godotenv/autoload"
)

var Database *pgxpool.Pool

func InitializeDB() {
	m, err := migrate.New("file://./migrations/", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalf("Migrator failed to connect to database: %v", err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("Failed to apply migrations: %v", err)
	}

	log.Println("Successfully applied migrations.")

	m.Close()

	pool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalf("Unable to create connection pool: %v", err)
	}

	Database = pool
}

func DBAddMission(name string) error {
	_, err := Database.Exec(context.Background(), "INSERT INTO missions (name) VALUES ($1)", name)
	if err != nil {
		log.Println(err)
		return err
	}

	return nil
}

func DBGetMissions() ([]DBMission, error) {
	missions := []DBMission{}

	rows, err := Database.Query(context.Background(), "SELECT * FROM missions ORDER BY id")
	if err != nil {
		log.Println(err)
		return missions, err
	}
	defer rows.Close()

	for rows.Next() {
		var m DBMission
		err := rows.Scan(&m.Id, &m.Name, &m.CreatedAt)
		if err != nil {
			log.Printf("Failed to scan row: %v", err)
			return missions, err
		}

		missions = append(missions, m)

	}
	if err := rows.Err(); err != nil {
		log.Printf("Error during rows iteration: %v", err)
		return missions, err
	}

	return missions, nil

}

func DBGetMission(id int) (DBMission, error) {
	var mission DBMission
	err := Database.QueryRow(context.Background(), "SELECT * FROM missions WHERE id = $1", id).Scan(&mission.Id, &mission.Name, &mission.CreatedAt)
	if err != nil {
		return mission, err
	}

	return mission, nil
}

func DBAddSchema(id int, schema string) error {
	_, err := Database.Exec(context.Background(), "INSERT INTO telemetry_packet_schema (mission_id, json_schema) VALUES ($1, $2)", id, schema)
	if err != nil {
		return err
	}
	return nil
}

func DBGetSchema(id int) (DBSchema, error) {
	var schema DBSchema

	err := Database.QueryRow(context.Background(), "SELECT id, mission_id, json_schema FROM telemetry_packet_schema WHERE mission_id = $1", id).Scan(&schema.Id, &schema.MissionId, &schema.Schema)
	if err != nil {
		return schema, err
	}
	return schema, nil
}

func DBAddPacket(missionId int, schemaId int, packet string) error {
	layout := "2006-01-02 15:04:05"

	_, err := Database.Exec(context.Background(), "INSERT INTO telemetry_packet (mission_id, schema_id, received_at, packet_data) VALUES ($1, $2, $3, $4)", missionId, schemaId, time.Now().Format(layout), packet)
	if err != nil {
		log.Println(err)
		return err
	}

	log.Println("Successfully added packet to database")
	return nil
}

func DBGetPackets(missionId int, page int) ([]DBPacket, error) {
	packets := []DBPacket{}

	if page < 1 {
		page = 1
	}
	offset := (page - 1) * 20

	rows, err := Database.Query(context.Background(), "SELECT * FROM telemetry_packet WHERE mission_id = $1 ORDER BY id LIMIT 20 OFFSET $2", missionId, offset)
	if err != nil {
		log.Println(err)
		return packets, err
	}
	defer rows.Close()

	for rows.Next() {
		var p DBPacket
		err := rows.Scan(&p.Id, &p.MissionId, &p.SchemaId, &p.ReceivedAt, &p.PacketData)
		if err != nil {
			log.Printf("Error scanning packet row: %v", err)
			return packets, err
		}
		packets = append(packets, p)
	}

	if err := rows.Err(); err != nil {
		log.Printf("Error during rows iteration: %v", err)
		return packets, err
	}

	return packets, nil

}

func DBAddCommand(missionId int, name string, description string, args string) error {
	_, err := Database.Exec(context.Background(),
		"INSERT INTO commands (mission_id, name, description, args) VALUES ($1, $2, $3, $4)",
		missionId, name, description, args)
	if err != nil {
		log.Printf("Error adding command: %v", err)
		return err
	}
	return nil
}

func DBUpdateCommand(id int, name string, description string, args string) error {
	_, err := Database.Exec(context.Background(),
		"UPDATE commands SET name = $2, description = $3, args = $4 WHERE id = $1",
		id, name, description, args)
	if err != nil {
		log.Printf("Error updating command: %v", err)
		return err
	}
	return nil
}

func DBDeleteCommand(id int) error {
	_, err := Database.Exec(context.Background(), "DELETE FROM commands WHERE id = $1", id)
	if err != nil {
		log.Printf("Error deleting command: %v", err)
		return err
	}
	return nil
}

func DBGetCommands(missionId int) ([]DBCommand, error) {
	commands := []DBCommand{}

	rows, err := Database.Query(context.Background(),
		"SELECT id, mission_id, name, description, args FROM commands WHERE mission_id = $1 ORDER BY id",
		missionId)
	if err != nil {
		log.Printf("Error querying commands: %v", err)
		return commands, err
	}
	defer rows.Close()

	for rows.Next() {
		var cmd DBCommand
		var argString string

		err := rows.Scan(&cmd.Id, &cmd.MissionId, &cmd.Name, &cmd.Description, &argString)
		if err != nil {
			log.Printf("Error scanning command row: %v", err)
			return commands, err
		}

		log.Println(argString)

		err = json.Unmarshal([]byte(argString), &cmd.Args)
		if err != nil {
			log.Printf("it didnt do the thing, %v", err)
		}

		log.Printf("%v", cmd.Args)

		commands = append(commands, cmd)
	}

	if err := rows.Err(); err != nil {
		log.Printf("Error during command rows iteration: %v", err)
		return commands, err
	}

	return commands, nil
}

func DBGetCommandByName(cmdName string) (DBCommand, error) {
	var command DBCommand
	err := Database.QueryRow(context.Background(), "SELECT * FROM commands WHERE name = $1", cmdName).Scan(&command.Id, &command.MissionId, &command.Name, &command.Description, &command.Args)
	if err != nil {
		return command, err
	}
	return command, nil
}
