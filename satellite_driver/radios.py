import threading
import logging
import time
import json

import serial
import serial.tools.list_ports

from websocket import Websocket, WebsocketPacket, EventType

logger = logging.getLogger(__name__)


class BaseRadio:
    def __init__(self, ws):
        self.connected = False
        self.ws: Websocket = ws
        self.monitor_thread = threading.Thread(
            target=self._monitor_connection, daemon=True)
        self.monitor_thread.start()

    # Start monitoring
    def start(self):
        raise NotImplementedError

    # Stop monitoring
    def stop(self):
        raise NotImplementedError

    def on_data(self, data: any):
        raise NotImplementedError

    def on_websocket_data(self, packet: WebsocketPacket):
        raise NotImplementedError

    def _monitor_connection(self):
        while True:
            if not self.connected:
                try:
                    self.start()
                except Exception as e:
                    logger.warning(
                        f"Failed to connect to board, retrying in 3 seconds: {e}")
                    pass
            time.sleep(3)


class ProvesV4(BaseRadio):
    def __init__(self, ws):
        super().__init__(ws)

        self.vid = 0x1209  # PROVES Kit VID
        self.pids = [
            0xE004,  # PROVES Kit v4 PID
            0x0011,  # PROVES Kit Testing PID
        ]
        self.port = None
        self.serial = None
        self.read_thread = None
        self.data_callback = None

        # Busy ports to prevent reconnecting to
        # (most likely due to either an active screen connection or multiple boards being connected)
        self.busy_ports = []

        # Leaderboard parsing
        self.parsing_leaderboard = False
        self.leaderboard = []

        # Strings that on_data shouldn't print out (to lessen spam)
        self.ignore_list = [
            "No message received",
            "Listening for data...",
            "Listen timeout reached",
            "Attempting to receive data with timeout",
        ]

        self.last_processed_name = ""

    def start(self):
        if self.connected:
            return

        logger.debug("Connecting to board...")

        all_ports = serial.tools.list_ports.comports()

        for port in all_ports:
            if port.vid == self.vid and port.pid in self.pids and port.device not in self.busy_ports:
                self.port = port.device
                break

        if not self.port:
            raise Exception(f"No device found with VID={hex(self.vid)} and PIDs={
                            [hex(pid) for pid in self.pids]}")

        try:
            self.serial = serial.Serial(
                port=self.port,
                baudrate=19200,
                timeout=1
            )
            self.connected = True

            # Start the data reading thread
            self.read_thread = threading.Thread(
                target=self.on_data, daemon=True)
            self.read_thread.start()

        except serial.SerialException as e:
            self.connected = False

            if "Resource busy" in str(e):
                self.busy_ports.append(self.port)
                self.port = None

            raise e

    def on_data(self):
        while self.connected:
            try:
                if self.serial and self.serial.is_open:
                    # Read a line from the serial port. This will block until a newline is received,
                    # or until the timeout (set to 1s in the serial.Serial constructor) is reached.
                    line_bytes = self.serial.readline()

                    if line_bytes:
                        line_str = line_bytes.decode('utf-8', errors='ignore')

                        # Process the line after stripping whitespace
                        stripped_line = line_str.strip()
                        if stripped_line:
                            self.handle_data(stripped_line)
                else:
                    # If the serial port is not open, wait a bit before checking again
                    time.sleep(0.1)
            except serial.SerialException as e:
                logger.error(f"Serial port error: {e}")
                self.connected = False
            except Exception as e:
                logger.error(f"An unexpected error occurred in on_data: {e}")
                self.connected = False

    def handle_data(self, data):
        if "Top 10 PROVES Explorers" in data:
            self.parsing_leaderboard = True
            self.leaderboard = []
            logger.info("--- Started parsing leaderboard ---")
            return

        if self.parsing_leaderboard:
            if data.startswith("-----------------------------"):
                if self.leaderboard:
                    logger.info("--- Finished parsing leaderboard ---")
                    self.ws.send_message(json.dumps(
                        {"event_type": 1, "data": self.leaderboard}))
                    print(self.leaderboard)
                    self.parsing_leaderboard = False
                    self.leaderboard = []
                return

            try:
                parts = data.split(' | ')
                if len(parts) == 2:
                    name_part = parts[0]
                    amt_part = parts[1]

                    # "1. this is me   " -> "this is me"
                    name = name_part.split('.', 1)[1].strip()
                    # "2 booths visited" -> 2
                    amt = int(amt_part.split(' ')[0])

                    self.leaderboard.append({"name": name, "amt": amt})
                    logger.info(
                        f"Parsed leaderboard entry: {{'name': '{name}', 'amt': {amt}}}")
                else:
                    logger.warning(
                        f"Could not parse leaderboard line (unexpected format): {data}")
                return
            except Exception as e:
                logger.warning(
                    f"Failed to parse leaderboard line: '{data}'. Error: {e}")
                return

        if data == "":
            return

        if "No progress found for" in data:
            name = " ".join(data[:-1].split()[4:])
            self.ws.send_message(json.dumps(
                {"event_type": 3, "data": {"name": name, "amt": 0}}))

        if "You still have" in data:
            split_string = data.split()
            self.ws.send_message(json.dumps({"event_type": 3, "data": {
                                 "name": self.last_processed_name, "amt": int(split_string[3])}}))
            self.last_processed_name = ""

        if "You have visited all" in data:
            self.ws.send_message(json.dumps(
                {"event_type": 3, "data": {"name": self.last_processed_name, "amt": 5}}))
            self.last_processed_name = ""

        if "start the ground station" in data:
            self.write_to_serial("\x03")
            time.sleep(1)
            self.write_to_serial("\x03")

        if "Received response" in data:
            try:
                parsed_data = json.loads(data)

                if not self.ws.connected:
                    logger.warn("Websocket not connected for some reason")
                else:
                    self.ws.send_message(json.dumps(
                        {"event_type": 0, "data": parsed_data}))

            except Exception as e:
                logger.error(e)

        data = data.replace("\\", "")
        logger.info(f"Data from board: {data}")

        if self.data_callback:
            self.data_callback(data)

    def on_websocket_data(self, packet: WebsocketPacket):
        if packet.event_type == EventType.WS_SEND_COMMAND:
            print(packet.data["command"])
            self.write_to_serial(packet.data["command"])
            self.write_to_serial("\r")
        elif packet.event_type == EventType.WS_RECEIVE_NAME:
            print(packet.data)
            self.write_to_serial(packet.data)
            self.write_to_serial("\r")
            self.last_processed_name = packet.data

    def write_to_serial(self, data: str):
        if self.serial:
            self.serial.write(data.encode("utf-8"))
