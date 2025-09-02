// TODO: At some point just get rid of the name field for the command string
// since it will always be there

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router";

type Arg = {
  required: boolean;
};

type Command = {
  id?: number;
  name: string;
  description: string;
  args: { [key: string]: Arg };
  cmdString: string;
};

type Commands = Command[];

const validateCommandString = (
  command: Command,
): { isValid: boolean; error?: string } => {
  const { name, args, cmdString } = command;

  if (!cmdString.includes(`$(name)`)) {
    return { isValid: false, error: "Command string must include $(name)" };
  }

  const argNames = Object.keys(args);

  const argMatches = [...cmdString.matchAll(/\$\(args\.(\w+)\)/g)];
  const usedArgs = argMatches.map((match) => match[1]);

  // First check if all used args are defined
  for (const argName of usedArgs) {
    if (!argNames.includes(argName)) {
      return {
        isValid: false,
        error: `Argument "${argName}" used in command string but not defined`,
      };
    }
  }

  // Check if ALL defined args are used in the command string
  for (const argName of argNames) {
    if (!usedArgs.includes(argName)) {
      return {
        isValid: false,
        error: `Argument "${argName}" must be used in command string`,
      };
    }
  }

  // Check ordering - if both required and optional args are used in the command string,
  // all required args must appear before any optional args
  const usedRequiredArgs = usedArgs.filter((argName) => args[argName].required);
  const usedOptionalArgs = usedArgs.filter(
    (argName) => !args[argName].required,
  );

  if (usedRequiredArgs.length > 0 && usedOptionalArgs.length > 0) {
    const lastRequiredIndex = Math.max(
      ...usedRequiredArgs.map((argName) =>
        cmdString.indexOf(`$(args.${argName})`),
      ),
    );
    const firstOptionalIndex = Math.min(
      ...usedOptionalArgs.map((argName) =>
        cmdString.indexOf(`$(args.${argName})`),
      ),
    );

    if (lastRequiredIndex > firstOptionalIndex) {
      return {
        isValid: false,
        error:
          "All required arguments must appear before optional arguments in the command string",
      };
    }
  }

  return { isValid: true };
};

export default function CommandSettings() {
  let { mid } = useParams();

  const [commands, setCommands] = useState<Commands>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [index: number]: string;
  }>({});
  const timeoutRefs = useRef<{ [index: number]: NodeJS.Timeout }>({});

  const debouncedValidate = useCallback(
    (idx: number, command: Command, delay: number = 300) => {
      // Clear existing timeout for this command
      if (timeoutRefs.current[idx]) {
        clearTimeout(timeoutRefs.current[idx]);
      }

      // Set new timeout
      timeoutRefs.current[idx] = setTimeout(() => {
        const validation = validateCommandString(command);

        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          if (validation.isValid) {
            delete newErrors[idx];
          } else {
            newErrors[idx] = validation.error!;
          }
          return newErrors;
        });

        // Clean up timeout reference
        delete timeoutRefs.current[idx];
      }, delay);
    },
    [],
  );

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach((timeout) =>
        clearTimeout(timeout),
      );
    };
  }, []);

  const handleNameChange = (idx: number, newName: string) => {
    const newCommands = [...commands];
    newCommands[idx].name = newName;
    setCommands(newCommands);
    debouncedValidate(idx, newCommands[idx]);
  };

  const handleDescriptionChange = (idx: number, newDescription: string) => {
    const newCommands = [...commands];
    newCommands[idx].description = newDescription;
    setCommands(newCommands);
  };

  const handleCmdStringChange = (idx: number, newCmdString: string) => {
    const newCommands = [...commands];
    newCommands[idx].cmdString = newCmdString;
    setCommands(newCommands);
    debouncedValidate(idx, newCommands[idx]);
  };

  const handleAddArg = (idx: number) => {
    const newCommands = [...commands];
    const argName = `arg${Object.keys(newCommands[idx].args).length + 1}`;
    newCommands[idx].args[argName] = { required: true };
    setCommands(newCommands);
  };

  const handleRemoveArg = (idx: number, argName: string) => {
    const newCommands = [...commands];
    delete newCommands[idx].args[argName];
    setCommands(newCommands);
    debouncedValidate(idx, newCommands[idx]);
  };

  const handleArgNameChange = (
    idx: number,
    oldName: string,
    newName: string,
  ) => {
    const newCommands = [...commands];
    const argValue = newCommands[idx].args[oldName];
    delete newCommands[idx].args[oldName];
    newCommands[idx].args[newName] = argValue;
    setCommands(newCommands);
    debouncedValidate(idx, newCommands[idx]);
  };

  const handleArgRequiredChange = (
    idx: number,
    argName: string,
    required: boolean,
  ) => {
    const newCommands = [...commands];
    newCommands[idx].args[argName].required = required;
    setCommands(newCommands);
    debouncedValidate(idx, newCommands[idx]);
  };

  const handleAddCommand = () => {
    const newCommands = [...commands];
    newCommands.push({
      name: "",
      description: "",
      args: {},
      cmdString: "$(name)",
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

    const newErrors = { ...validationErrors };
    delete newErrors[idx];
    setValidationErrors(newErrors);

    // Clear timeout if exists
    if (timeoutRefs.current[idx]) {
      clearTimeout(timeoutRefs.current[idx]);
      delete timeoutRefs.current[idx];
    }
  };

  const { isPending, isError, error } = useQuery({
    queryKey: ["api", "commands", mid],
    queryFn: async () => {
      const response = await fetch(`/api/get/commands?id=${mid}`);
      if (!response.ok) {
        throw new Error("Failed to fetch commands");
      }
      const dbCommands = await response.json();

      const commands: Commands = dbCommands.map((dbCmd: any) => ({
        id: dbCmd.id,
        name: dbCmd.name,
        description: dbCmd.description,
        args: JSON.parse(dbCmd.args),
        cmdString: dbCmd.cmd_string,
      }));

      setCommands(commands);

      // Validate all loaded commands immediately (no debounce for initial load)
      commands.forEach((command, idx) => {
        const validation = validateCommandString(command);
        if (!validation.isValid) {
          setValidationErrors((prev) => ({
            ...prev,
            [idx]: validation.error!,
          }));
        }
      });

      return commands;
    },
    enabled: !!mid,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const commandsMutation = useMutation({
    mutationFn: async (commands: Commands) => {
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
            cmd_string: cmd.cmdString,
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
          cmd_string: command.cmdString,
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
                {Object.entries(command.args).map(([argName, arg]) => (
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
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={arg.required}
                        onChange={(e) =>
                          handleArgRequiredChange(
                            idx,
                            argName,
                            e.target.checked,
                          )
                        }
                      />
                      Required
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveArg(idx, argName)}
                    >
                      <MinusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Command String
              </label>
              <Input
                value={command.cmdString}
                onChange={(e) => handleCmdStringChange(idx, e.target.value)}
                placeholder="$(name) $(args.arg1) $(args.arg2)"
              />
              {validationErrors[idx] && (
                <p className="text-red-400 text-sm mt-1">
                  {validationErrors[idx]}
                </p>
              )}
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
            Object.keys(validationErrors).length > 0 ||
            commandsMutation.isPending ||
            updateCommandMutation.isPending
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
