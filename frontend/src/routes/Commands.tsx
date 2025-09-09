import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { type Command } from "@/types/ApiTypes";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { formatDateTime } from "@/utils/formatDate";
import { useParams } from "react-router";
import { underScoreToTitleCase, useMakeQuery } from "@/lib/utils";

type SentCommand = {
  id: number;
  name: string;
  args: Record<string, string>;
  timestamp: Date;
  status: "success" | "pending" | "error";
};

const commandsFetchFn = async (mid: number) => {
  const res = await fetch(`/api/get/commands?id=${mid}`);
  if (!res.ok) {
    throw new Error("Failed to fetch commands");
  }
  return await res.json();
};

export default function Commands() {
  const { mid } = useParams();

  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null);
  const [args, setArgs] = useState<{ [key: string]: string }>({});
  const [commandHistory, setCommandHistory] = useState<SentCommand[]>([]);
  const [expandedHistoryId, setExpandedHistoryId] = useState<number | null>(
    null,
  );

  const commandsQuery = useMakeQuery<Command[]>("api/get/commands", () =>
    commandsFetchFn(Number(mid)),
  );

  console.log(commandsQuery.data);

  const cmdMutation = useMutation({
    mutationFn: async (cmd: {
      command: string;
      args: Record<string, string>;
    }) => {
      const response = await fetch("/api/post/command", {
        method: "POST",
        body: JSON.stringify(cmd),
      });
      if (!response.ok) {
        throw new Error("Command failed to post");
      }
      return response.json();
    },
    onSuccess: (data, variables) => {
      const newCommand = {
        id: Date.now(),
        name: variables.command,
        args: variables.args,
        timestamp: new Date(),
        status: "pending",
      } as SentCommand;
      setCommandHistory((prev) => [newCommand, ...prev]);
    },
  });

  const handleCommandClick = (command: Command) => {
    setSelectedCommand(command);
    // add args to state
  };

  const handleArgChange = (name: string, value: string) => {
    setArgs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendCommand = () => {
    if (selectedCommand) {
      const commandToSend = {
        command: selectedCommand.name,
        args: args,
      };
      console.log(commandToSend);
      cmdMutation.mutate(commandToSend);
    }
  };

  const areAllArgsFilled = () => {
    if (!selectedCommand || !selectedCommand.args) {
      return true;
    }
    return Object.values(args).every((str) => str !== "");
  };

  return (
    <div className="flex flex-col h-screen">
      <PageHeader
        title="Commands"
        description="Manage and execute system commands"
      />
      <div className="w-full flex-1 flex flex-row-reverse">
        <div className="border-l border-neutral-800 h-full w-[400px] bg-neutral-900 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">Command History</h3>
            {commandHistory.map((cmd) => (
              <div key={cmd.id} className="border-b border-neutral-700 py-2">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setExpandedHistoryId(
                      expandedHistoryId === cmd.id ? null : cmd.id,
                    )
                  }
                >
                  <p className="font-semibold">{cmd.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(cmd.timestamp.toString())}
                    </p>
                    <span
                      className={`w-3 h-3 rounded-full ${
                        cmd.status === "success"
                          ? "bg-green-500"
                          : cmd.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    ></span>
                  </div>
                </div>
                {expandedHistoryId === cmd.id && (
                  <div className="mt-2">
                    <h4 className="font-semibold">Arguments</h4>
                    {Object.keys(cmd.args).length > 0 ? (
                      <pre className="text-xs bg-neutral-800 p-2 my-2 rounded-md whitespace-pre-wrap break-all">
                        {JSON.stringify(cmd.args, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No arguments
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 content-start">
          {commandsQuery.isPending && <p>Loading commands...</p>}
          {commandsQuery.isError && <p>Error loading commands</p>}
          {commandsQuery.data?.map((command) => (
            <Card
              key={command.id}
              onClick={() => handleCommandClick(command)}
              className={`cursor-pointer ${
                selectedCommand?.id === command.id ? "border-primary" : ""
              }`}
            >
              <CardHeader>
                <CardTitle>{underScoreToTitleCase(command.name)}</CardTitle>
                <CardDescription>{command.description}</CardDescription>
              </CardHeader>
              {selectedCommand && selectedCommand.id === command.id && (
                <CardContent>
                  {selectedCommand.args.map((arg) => (
                    <div key={arg} className="grid gap-2">
                      <label htmlFor={arg}>{arg}</label>
                      <Input
                        id={arg}
                        onChange={(e) => handleArgChange(arg, e.target.value)}
                      />
                    </div>
                  ))}
                </CardContent>
              )}
              {selectedCommand && selectedCommand.id === command.id && (
                <CardFooter>
                  <Button
                    onClick={handleSendCommand}
                    disabled={!areAllArgsFilled()}
                  >
                    Send Command
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
