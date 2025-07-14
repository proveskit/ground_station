# Ground Station Satellite Driver

Python script to interface with a PROVES satellite by sending and receiving data.

## Setup

Make sure you have [uv](https://github.com/astral-sh/uv) installed

```bash
cd satellite_driver
uv venv
source .venv/bin/activate
uv pip install -r requirements.txt
uv python run main.py
```

Once running, the script will search for a valid board to connect to through serial. If you have multiple boards connected for testing and only want to connect to a specific board, connect to the other board(s) through serial with screen or another tool. If the script fails to connect to a board, it will be added to a list to not try reconnecting.
