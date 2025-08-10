import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ConfettiExplosion from "react-confetti-explosion";
import { toast } from "sonner";

interface LeaderboardEntry {
  name: string;
  amt: number;
}

export default function SmallSatDemo() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:8080/api/get/smallsat_ws`);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(event.data);
      if (data.event_type === 1) {
        setLeaderboard(data.data);
        setLastRefreshed(new Date());
      } else if (data.event_type === 3) {
        if (data.data.amt === 0) {
          toast(`${data.data.name} has not visited any booths yet.`);
        } else if (data.data.amt === 5) {
          toast(`${data.data.name} has visited all the booths!`);
          setShowConfetti(true);
        } else {
          toast(`${data.data.name} has visited ${5 - data.data.amt} booths!`);
        }
      }
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const handleSubmit = () => {
    if (ws.current) {
      console.log("yes");
      ws.current.send(JSON.stringify({ event_type: 2, data: inputValue }));
    }
  };

  return (
    <div className="container mx-auto p-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4 text-white">SmallSat Demo</h1>
      {showConfetti && (
        <div className="w-full flex items-center justify-center">
          <ConfettiExplosion
            className="w-full"
            onComplete={() => setShowConfetti(false)}
          />
        </div>
      )}
      <div className="flex justify-center">
        <div className="bg-card shadow-md rounded-lg p-4 w-152">
          <h2 className="text-xl font-semibold mb-2 text-card-foreground">
            Leaderboard
          </h2>
          <ol className="list-decimal list-inside">
            {leaderboard.slice(0, 10).map((entry, index) => (
              <li
                key={index}
                className={`flex justify-between p-2 text-card-foreground ${
                  entry.amt === 5 ? "glowing-row" : ""
                }`}
              >
                <span>{entry.name}</span>
                <span>{entry.amt} booths visited</span>
              </li>
            ))}
          </ol>
          {lastRefreshed && (
            <p className="text-sm text-muted-foreground mt-2">
              Last refreshed: {lastRefreshed.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <div className="bg-card shadow-md rounded-lg p-4 w-152">
          <h2 className="text-xl font-semibold mb-2 text-card-foreground">
            Check Visited Booths
          </h2>
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter name..."
            />
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
