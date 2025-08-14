import logging
import time


from websocket import Websocket
from radio_manager import RadioManager
from config.settings import AppConfig, WebsocketConfig, RadioConfig
from packet_parser import PacketParser

logging.basicConfig(level=logging.DEBUG,
                    format="[%(levelname)s] %(asctime)s: %(message)s")
logger = logging.getLogger(__name__)


def main():
    logger.info("Starting up...")

    ws_config = WebsocketConfig()
    radio_config = RadioConfig(vid=0x1209, pids=[0xE004, 0x0011])
    config = AppConfig(radio_config, ws_config, 1)

    ws = Websocket(ws_config)

    radio = RadioManager(config, ws)
    ws.board_cb = radio.on_websocket_data

    while True:
        try:
            time.sleep(5)
        except KeyboardInterrupt:
            ws.close()
            break


if __name__ == "__main__":
    main()
