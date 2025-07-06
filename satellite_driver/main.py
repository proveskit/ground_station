import logging
import time
import sys


from websocket import Websocket
from radios import ProvesV4

logging.basicConfig(level=logging.DEBUG,
                    format="[%(levelname)s] %(asctime)s: %(message)s")
logger = logging.getLogger(__name__)

RADIOS = {
    "proves_v4": ProvesV4
}


def main():
    logger.info("Starting up...")
    if len(sys.argv) > 1:
        board_name = sys.argv[1]
        if board_name not in RADIOS:
            logger.warning("Incorrect radio argument, defaulting to proves_v4")
            board_name = "proves_v4"
    else:
        board_name = "proves_v4"

    ws = Websocket()
    RADIOS[board_name](ws)

    while True:
        try:
            time.sleep(5)
        except KeyboardInterrupt:
            ws.close()
            break


if __name__ == "__main__":
    main()
