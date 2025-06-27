package main

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5"
	_ "github.com/joho/godotenv/autoload"
)

var Database *pgx.Conn

func ConnectDB() {
	conn, err := pgx.Connect(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Printf("Unable to connect to database")
	}

	Database = conn
}

func AddPacket(packet ProvesPacket) {
	layout := "2006-01-02 15:04:05"
	parsedTime, err := time.Parse(layout, packet.Time)
	if err != nil {
		log.Println("Failed to parse time")
		return
	}

	_, err = Database.Exec(context.Background(), "INSERT INTO packets (time, packet) VALUES ($1, $2)", parsedTime, packet.Response)
	if err != nil {
		log.Println(err)
		return
	}

	log.Println("Successfully added packet to database")
}

func GetPacketsDB(page int) ([]DBProvesPacket, error) {
	packets := []DBProvesPacket{}

	if page < 1 {
		page = 1
	}
	offset := (page - 1) * 20

	rows, err := Database.Query(context.Background(), "SELECT id, time, packet FROM packets ORDER BY id LIMIT 20 OFFSET $1", offset)
	if err != nil {
		log.Println(err)
		return packets, err
	}
	defer rows.Close()

	for rows.Next() {
		var p DBProvesPacket
		err := rows.Scan(&p.Id, &p.Time, &p.Packet)
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
