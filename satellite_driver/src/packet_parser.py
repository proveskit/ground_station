import requests
import json

from config.settings import AppConfig


class PacketParser:
    def __init__(self, config: AppConfig):
        self.config: AppConfig = config
        self.schema: dict | None = None

        self._get_schema()

        # Mapping for basic types, enum and vec3 will be handled manually
        self.TYPE_MAPPING = {
            "string": str,
            "int": int,
            "float": float,
        }

    def _get_schema(self):
        res = requests.get(
            f"{self.config.backend_url}/api/get/schema?id={self.config.mission_id}")

        if not res.ok:
            raise Exception("Failed to get schema")

        try:
            self.schema = json.loads(res.json()["schema"])
        except Exception as e:
            raise e

    def process_packet(self, packet: str) -> bool:
        if not self.schema:
            raise Exception("No schema currently available")
            return False

        try:
            packet_dict = json.loads(packet)
        except Exception as e:
            raise e
            return False

        for t in self.schema:
            try:
                expected_type = t["type"]
                expected_name = t["name"]

                val = packet_dict[expected_name]

                if expected_type == "string" or expected_type == "int" or expected_type == "float":
                    if not isinstance(val, self.TYPE_MAPPING[expected_type]):
                        raise Exception("Expected value isn't correct type")

                if expected_type == "enum":
                    enum_values = t["enumValues"]
                    if val not in enum_values:
                        raise Exception(
                            "Enum value not in expected enum values")

                if expected_type == "vec3":
                    if len(val) != 3:
                        raise Exception("Not 3 values in vec3")
                    for v in val:
                        if not isinstance(v, int) and not isinstance(v, float):
                            raise Exception(f"Value in vec3 isn't int or float, {
                                            v}, {expected_type}")
            except Exception as e:
                raise Exception(f"Failed to parse packet: {e}")
                return False

        print("Packet is valid")
        return True
