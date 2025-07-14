# Ground Station Backend

Backend for the ground station stack, storing & providing data for the frontend and interfacing between the frontend and the satellite_driver script.

## Setup

First you will need to set up a PostgreSQL database, either hosted locally or on a provider on your choosing. Then create a `.env` file in `/backend` and paste in the connection url:

```env
DATABASE_URL=postgres://username:password@host:port/database_name
```

Then install [go](https://go.dev/), and run:

```bash
cd backend
go run .
```
