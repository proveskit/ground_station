import PageHeader from "@/components/PageHeader";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function Commands() {
  const [cmd, setCmd] = useState<string>("");

  const cmdMutation = useMutation({
    mutationFn: async (cmd: string) => {
      return fetch("/api/post/command", {
        method: "POST",
        body: JSON.stringify({ command: cmd }),
      });
    },
  });

  return (
    <>
      <PageHeader
        title="Commands"
        description="Manage and execute system commands"
      />
      <div className="flex-1 p-4">
        <p>Send command</p>
        <p>Command: {cmd}</p>
        <input
          type="text"
          onChange={(e) => setCmd(e.target.value)}
          className="border-2"
        />
        <button
          onClick={() => {
            cmdMutation.mutate(cmd);
          }}
        >
          Send Command
        </button>
      </div>
    </>
  );
}
