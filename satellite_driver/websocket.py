import threading
import logging
import time

from websockets.sync.client import connect

logger = logging.getLogger(__name__)


class Websocket:
    def __init__(self):
        self.ws = None
        self.last_sent = time.monotonic()
        self.monitor_thread = threading.Thread(
            target=self.monitor_connection, daemon=True)
        self.monitor_thread.start()

    def start(self):
        logger.info("Connecting to websocket")
        self.ws = connect("ws://localhost:8080/ws")

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

            time.sleep(60)

    @property
    def connected(self):
        return self.ws is not None

    def send_message(self, msg):
        if not self.ws:
            logger.warn("No ws, not sending")
            return False

        if time.monotonic() - self.last_sent < 1:
            logger.warn("Resending message in 1s")
            time.sleep(1)

        logger.debug(f"Sending msg: {msg}")
        self.ws.send(msg)
        self.last_sent = time.monotonic()
        return True
