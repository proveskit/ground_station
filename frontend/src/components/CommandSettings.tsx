// TODO: At some point just get rid of the name field for the command string
// since it will always be there

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Command } from "@/types/ApiTypes";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";

export default function CommandSettings() {
  let { mid } = useParams();

  const [commands, setCommands] = useState<Command[]>([]);

  const handleNameChange = (idx: number, newName: string) => {
    const newCommands = [...commands];
    newCommands[idx].name = newName;
    setCommands(newCommands);
  };

  const handleDescriptionChange = (idx: number, newDescription: string) => {
    const newCommands = [...commands];
    newCommands[idx].description = newDescription;
    setCommands(newCommands);
  };

  const handleAddArg = (idx: number) => {
    const newCommands = [...commands];
    const argName = `arg${Object.keys(newCommands[idx].args).length + 1}`;
    newCommands[idx].args.push(argName);
    setCommands(newCommands);
  };

  const handleRemoveArg = (idx: number, argName: string) => {
    const newCommands = [...commands];
    newCommands[idx].args = newCommands[idx].args.filter(
      (arg) => arg !== argName,
    );
    setCommands(newCommands);
  };

  const handleArgNameChange = (
    idx: number,
    oldName: string,
    newName: string,
  ) => {
    const newCommands = [...commands];

    const oldIdx = newCommands[idx].args.indexOf(oldName);
    if (oldIdx !== -1) {
      newCommands[idx].args[oldIdx] = newName;
    }
    setCommands(newCommands);
  };

  const handleAddCommand = () => {
    const newCommands = [...commands];
    newCommands.push({
      id: undefined,
      mission_id: Number(mid),
      name: "",
      description: "",
      args: [],
    });
    setCommands(newCommands);
  };

  const handleRemoveCommand = async (idx: number) => {
    const command = commands[idx];

    if (command.id) {
      // Delete existing command from backend
      try {
        await deleteCommandMutation.mutateAsync(command.id);
      } catch (error) {
        console.error("Failed to delete command:", error);
        return;
      }
    }

    const newCommands = [...commands];
    newCommands.splice(idx, 1);
    setCommands(newCommands);
  };

  const { isPending, isError, error } = useQuery({
    queryKey: ["api", "commands", mid],
    queryFn: async () => {
      const response = await fetch(`/api/get/commands?id=${mid}`);
      if (!response.ok) {
        throw new Error("Failed to fetch commands");
      }
      const dbCommands = await response.json();
      console.log(dbCommands);

      setCommands(dbCommands);
      return commands;
    },
    enabled: !!mid,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const commandsMutation = useMutation({
    mutationFn: async (commands: Command[]) => {
      const response = await fetch("/api/patch/commands", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          missionId: parseInt(mid!),
          commands: commands.map((cmd) => ({
            name: cmd.name,
            description: cmd.description,
            args: cmd.args,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save commands");
      }

      return response.text();
    },
  });

  const updateCommandMutation = useMutation({
    mutationFn: async (command: Command) => {
      if (!command.id) {
        throw new Error("Command ID is required for updates");
      }

      const response = await fetch("/api/patch/command", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: command.id,
          name: command.name,
          description: command.description,
          args: command.args,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update command");
      }

      return response.text();
    },
  });

  const deleteCommandMutation = useMutation({
    mutationFn: async (commandId: number) => {
      const response = await fetch(`/api/delete/command?id=${commandId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete command");
      }

      return response.text();
    },
  });

  if (isPending) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <p>{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="w-full p-2 bg-neutral-900 rounded-md border">
      <div className="flex flex-col gap-6">
        {commands.map((command, idx) => (
          <div key={idx} className="bg-neutral-800 rounded-md p-4 border">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Command {idx + 1}</h3>
              <Button variant="ghost" onClick={() => handleRemoveCommand(idx)}>
                <MinusIcon />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={command.name}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                  placeholder="command_name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Input
                  value={command.description}
                  onChange={(e) => handleDescriptionChange(idx, e.target.value)}
                  placeholder="Command description"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Arguments</label>
                <Button size="sm" onClick={() => handleAddArg(idx)}>
                  <PlusIcon className="w-4 h-4" />
                  Add Argument
                </Button>
              </div>

              <div className="space-y-2">
                {command.args.length === 0 ? (
                  <p>No args</p>
                ) : (
                  command.args.map((argName) => (
                    <div
                      key={argName}
                      className="flex gap-2 items-center bg-neutral-700 p-2 rounded"
                    >
                      <Input
                        value={argName}
                        onChange={(e) =>
                          handleArgNameChange(idx, argName, e.target.value)
                        }
                        placeholder="arg_name"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveArg(idx, argName)}
                      >
                        <MinusIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ))}

        <Button onClick={handleAddCommand} className="w-full">
          Add Command
        </Button>

        <Button
          onClick={() => {
            // For new commands (without id), use bulk save
            // For existing commands, update individually
            const newCommands = commands.filter((cmd) => !cmd.id);
            const existingCommands = commands.filter((cmd) => cmd.id);

            if (newCommands.length > 0) {
              commandsMutation.mutate(newCommands);
            }

            existingCommands.forEach((cmd) => {
              updateCommandMutation.mutate(cmd);
            });
          }}
          className="mt-4"
          disabled={
            commandsMutation.isPending || updateCommandMutation.isPending
          }
        >
          {commandsMutation.isPending || updateCommandMutation.isPending
            ? "Saving..."
            : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
