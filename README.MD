# PROVES Kit Ground Station

Monorepo for the ground station software stack for the PROVES Kit satellite

## Stack

This is the current stack for fully running the ground station setup, currently:

- Backend

  - Go
  - PSQL

  Manages a websocket connection between satellite_driver to transmit data to and from a ground station board, and has a PSQL database to store board packets and other relevant information

- Frontend

  - TypeScript
  - React
  - TailwindCSS & Shadcn UI

  UI for being able to view and analyze satellite information from packets received, and being able to interface with the board, such as sending commands and updating board software.

- Satellite Driver (this needs a better name)

## Setup

Instructions are in the `README.md` of each folder

## Planned Main Features

> [!NOTE]
> These are just main features that need to get done, more will be added in the future

- [ ] Sending commands to satellite through frontend
- [ ] Viewing packet data on dashboard
- [ ] Better dashboard customization
- [ ] File transfer to & from a PROVES Kit board
- [ ] Authentication for destructive actions (such as transferring files or changing config values)
