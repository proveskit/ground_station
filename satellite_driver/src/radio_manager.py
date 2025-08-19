import threading
import logging
import time
import json

import serial
import serial.tools.list_ports

from websocket import Websocket, WebsocketPacket, EventType
from config.settings import AppConfig
from packet_parser import PacketParser

logger = logging.getLogger(__name__)


class RadioManager():
    def __init__(self, config: AppConfig, ws: Websocket):
        self.connected = False
        self.config = config
        self.ws: Websocket = ws
        self.monitor_thread = threading.Thread(
            target=self._monitor_connection, daemon=True)
        self.monitor_thread.start()

        self.serial = None
        self.read_thread = None
        self.data_callback = None

        # Busy ports to prevent reconnecting to
        # (most likely due to either an active screen connection or multiple boards being connected)
        self.busy_ports = []

        # Strings that on_data shouldn't print out (to lessen spam)
        self.ignore_list = [
            "No message received",
            "Listening for data...",
            "Listen timeout reached",
            "Attempting to receive data with timeout",
        ]

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

    def start(self):
        if self.connected:
            return

        logger.debug("Connecting to board...")

        all_ports = serial.tools.list_ports.comports()

        board_port = None
        print(self.config.radio.vid)
        for port in all_ports:
            if port.vid == self.config.radio.vid and port.pid in self.config.radio.pids and port.device not in self.busy_ports:
                board_port = port.device
                break

        if not board_port:
            raise Exception(f"No device found with VID={hex(self.config.radio.vid)} and PIDs={
                            [hex(pid) for pid in self.config.radio.pids]}")

        try:
            self.serial = serial.Serial(
                port=board_port,
                baudrate=self.config.radio.baudrate,
                timeout=self.config.radio.timeout
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

            raise e

        # (Attempt) to go to ground station mode
        # Super long sleep in between each ctrl c for now to prevent accidentally
        # interrupting repl initialization. Maybe can just catch KeyboardInterrupt
        # in repl.py during initialization in the future.
        self.write_to_serial("\x03")
        time.sleep(1)
        self.write_to_serial("\x03")
        time.sleep(1)
        self.write_to_serial("\x03")
        time.sleep(1)
        self.write_to_serial("\x03")
        time.sleep(1)
        self.write_to_serial("\x03")
        time.sleep(0.2)
        self.write_to_serial("ground_station._log.colorized = False\r")
        time.sleep(0.2)
        self.write_to_serial("ground_station.run()\r")
        time.sleep(0.2)
        self.write_to_serial("A\r")

    def on_data(self):
        partial_string = ""

        while self.connected:
            try:
                if self.serial and self.serial.is_open:
                    if self.serial.in_waiting:
                        recv = self.serial.read(
                            self.serial.in_waiting).decode("utf-8")

                        if "\n" in recv:
                            final_strings = []
                            split = recv.split("\n")

                            while len(split) > 1:
                                if partial_string:
                                    final_strings.append(
                                        partial_string + split.pop(0))
                                    partial_string = ""
                                final_strings.append(split.pop(0))

                            if len(split) == 1 and "\n" in split[0]:
                                final_strings.append(split[0])
                            else:
                                partial_string = ""

                            for s in final_strings:
                                if s != "":
                                    self.handle_data(s)

                        else:
                            partial_string += recv

            except Exception as e:
                self.connected = False
                raise e

    def handle_data(self, data):
        if not any(ignore in data for ignore in self.ignore_list):
            if "Received response" in data:
                try:
                    parsed_data = json.loads(data)
                    valid = PacketParser(self.config).process_packet(
                        parsed_data["response"])
                    print(parsed_data["response"])

                    if not valid:
                        logger.warn("Received packet not valid to schema")
                        return

                    if not self.ws.connected:
                        logger.warn("Websocket not connected for some reason")
                    else:
                        self.ws.send_message(
                            json.dumps({"mission_id": self.config.mission_id, "packet": parsed_data["response"]}), EventType.WS_NEW_PACKET)

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

    def write_to_serial(self, data: str):
        if self.serial:
            self.serial.write(data.encode("utf-8"))
