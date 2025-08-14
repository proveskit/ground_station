from dataclasses import dataclass
from typing import List


@dataclass
class RadioConfig:
    vid: int
    pids: List[int]
    baudrate: int = 9600
    timeout: int = 1


@dataclass
class WebsocketConfig:
    url: str = "ws://localhost:8080/api/get/ws"
    ping_interval: int = 60
    reconnect_delay: int = 5


@dataclass
class AppConfig:
    radio: RadioConfig
    websocket: WebsocketConfig
    mission_id: int
    backend_url: str = "http://localhost:8080"
    log_level: str = "INFO"
