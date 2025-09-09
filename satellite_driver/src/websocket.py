import threading
import json
import logging
import time
from enum import Enum

from websockets.sync.client import connect

from config.settings import WebsocketConfig

logger = logging.getLogger(__name__)


class EventType(str, Enum):
    NEW_PACKET = "new_packet"
    SEND_COMMAND = "send_command"


class WebsocketPacket:
    def __init__(self, data: str):
        parsed_msg = json.loads(data)
        evt_type = parsed_msg.get("event_type")
        data = parsed_msg.get("data")

        if evt_type is None:
            logger.warning("No type field in packet")
            return

        self.event_type = evt_type
        self.data = data


class Websocket:
    def __init__(self, ws_config: WebsocketConfig):
        self.ws_config = ws_config

        self.ws = None
        self.last_sent = time.monotonic()

        self.monitor_thread = threading.Thread(
            target=self.monitor_connection, daemon=True)
        self.monitor_thread.start()

        self.receive_thread = threading.Thread(
            target=self.receive_messages, daemon=True
        )
        self.receive_thread.start()
        self.board_cb = None

    def start(self):
        logger.info("Connecting to websocket")
        self.ws = connect(self.ws_config.url)

    def close(self):
        logger.info("Disconnecting")
        self.ws.close()
        self.ws = None

    def monitor_connection(self):
        while True:
            if not self.ws:
                self.start()
                continue

            else:
                res = self.ws.ping().wait(5)
                if not res:
                    logger.info("Didn't get ping, trying to reconnect")
                    self.close()
                    self.start()

            time.sleep(self.ws_config.ping_interval)

    def receive_messages(self):
        while True:
            if self.ws:
                try:
                    message = self.ws.recv()
                    logger.info(f"Received message: {message}")
                    if self.board_cb:
                        packet = WebsocketPacket(message)
                        self.board_cb(packet)
                except Exception as e:
                    logger.error(f"Error receiving message: {e}")
            else:
                logger.debug("No ws connected, waiting")
                time.sleep(1)

    @property
    def connected(self):
        return self.ws is not None

    def send_message(self, data: str, msg_type: EventType):
        if not self.ws:
            logger.warn("No ws, not sending")
            return False

        if time.monotonic() - self.last_sent < 1:
            logger.warn("Resending message in 1s")
            time.sleep(1)

        logger.debug(f"Sending msg: {data}")
        print(json.dumps({"event_type": msg_type.value, "data": data}))
        self.ws.send(json.dumps({"event_type": msg_type.value, "data": data}))
        self.last_sent = time.monotonic()
        return True
