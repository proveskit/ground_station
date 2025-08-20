import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import Dropdown from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import type { PacketSchema } from "@/types/SchemaTypes";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MinusIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { useParams } from "react-router";

export default function Settings() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Configure application preferences"
      />
      <div className="w-full h-full p-2">
        <p className="text-4xl font-bold">Packets</p>
        <p>Modify your current packet structure</p>
        <PacketSettings />
      </div>
    </>
  );
}

const TYPES = [
  {
    name: "String",
    value: "string",
  },
  {
    name: "Integer",
    value: "int",
  },
  {
    name: "Float",
    value: "float",
  },
  {
    name: "Enum",
    value: "enum",
  },
  {
    name: "Vector3",
    value: "vec3",
  },
];

const generateExamplePacket = (schema: PacketSchema): Record<string, any> => {
  const packet: Record<string, any> = {};
  for (const field of schema) {
    if (!field.name) continue;

    switch (field.type) {
      case "string":
        packet[field.name] = "example";
        break;
      case "int":
        packet[field.name] = 123;
        break;
      case "float":
        packet[field.name] = 123.45;
        break;
      case "enum":
        if (field.enumValues && field.enumValues.length > 0) {
          packet[field.name] = field.enumValues[0];
        } else {
          packet[field.name] = null;
        }
        break;
      case "vec3":
        packet[field.name] = [1.0, 2.0, 3.0];
        break;
      default:
        packet[field.name] = null;
        break;
    }
  }
  return packet;
};

function PacketSettings() {
  let { mid } = useParams();

  const [schema, setSchema] = useState<PacketSchema>([]);
  const [examplePacket, setExamplePacket] = useState<Record<
    string,
    any
  > | null>(null);

  const handleNameChange = (idx: number, newName: string) => {
    const newSchema = [...schema];
    newSchema[idx].name = newName;
    setSchema(newSchema);
  };

  const handleTypeChange = (idx: number, newType: string) => {
    const newSchema = [...schema];
    newSchema[idx].type = newType as PacketSchema[number]["type"];
    if (newType === "enum") {
      newSchema[idx].enumValues = [];
    } else {
      delete newSchema[idx].enumValues;
    }
    setSchema(newSchema);
  };

  const handleAddField = () => {
    const newSchema = [...schema];
    newSchema.push({ name: "", type: "string" });
    setSchema(newSchema);
  };

  const handleRemoveField = (idx: number) => {
    const newSchema = [...schema];
    newSchema.splice(idx, 1);
    setSchema(newSchema);
  };

  const handleAddEnumValue = (idx: number) => {
    const newSchema = [...schema];
    newSchema[idx].enumValues?.push("");
    setSchema(newSchema);
  };

  const handleRemoveEnumValue = (idx: number, eIdx: number) => {
    const newSchema = [...schema];
    newSchema[idx].enumValues?.splice(eIdx, 1);
    setSchema(newSchema);
  };

  const handleEnumChange = (idx: number, eIdx: number, value: string) => {
    const newSchema = [...schema];
    newSchema[idx].enumValues![eIdx] = value;
    setSchema(newSchema);
  };

  const handleGenerateExample = () => {
    setExamplePacket(generateExamplePacket(schema));
  };

  const { isPending, isError, error } = useQuery({
    queryKey: ["api", "schema"],
    queryFn: async () => {
      const res = await fetch(`/api/get/schema?id=${mid}`);
      if (!res.ok) {
        throw new Error("Failed to fetch schema");
      }

      const body = await res.json();

      if (body["schema"] === "") {
        setSchema([]);
      } else {
        try {
          setSchema(JSON.parse(body["schema"]));
        } catch (e) {
          console.error(e);
          setSchema([]);
        }
      }
      return body;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const schemaMutation = useMutation({
    mutationFn: async (schema: PacketSchema) => {
      return await fetch("/api/patch/schema", {
        method: "PATCH",
        body: JSON.stringify({
          missionId: Number(mid),
          schema: JSON.stringify(schema),
        }),
      });
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
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full p-2 bg-neutral-900 rounded-md border">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-3">
          {schema.map((s, idx) => (
            <Fragment key={idx}>
              <div className="flex gap-3 w-76">
                <Input
                  value={s.name}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                  className="text-sm"
                />
                <Dropdown
                  items={TYPES}
                  selected={s.type}
                  onSelect={(value) => handleTypeChange(idx, value)}
                />
                <Button variant="ghost" onClick={() => handleRemoveField(idx)}>
                  <MinusIcon />
                </Button>
              </div>
              {s.enumValues && (
                <div className="flex flex-col gap-2 w-42 bg-neutral-800 rounded-md p-2">
                  {s.enumValues.map((e, eIdx) => (
                    <div className="flex" key={eIdx}>
                      <Input
                        value={e}
                        className="text-sm"
                        onChange={(evt) =>
                          handleEnumChange(idx, eIdx, evt.target.value)
                        }
                      />
                      <Button
                        variant="ghost"
                        onClick={() => handleRemoveEnumValue(idx, eIdx)}
                      >
                        <MinusIcon />
                      </Button>
                    </div>
                  ))}
                  <Button onClick={() => handleAddEnumValue(idx)}>
                    Add Enum Value
                  </Button>
                </div>
              )}
            </Fragment>
          ))}
          <Button className="w-64" onClick={handleAddField}>
            Add Field
          </Button>
          <Button className="w-64" onClick={handleGenerateExample}>
            Generate Example Packet
          </Button>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-semibold">Schema</h3>
            <pre className="text-sm leading-snug">
              <code>{JSON.stringify(schema, null, 2)}</code>
            </pre>
          </div>
          {examplePacket && (
            <div>
              <h3 className="text-lg font-semibold">Example Packet</h3>
              <pre className="text-sm leading-snug">
                <code>{JSON.stringify(examplePacket, null, 2)}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
      <Button onClick={() => schemaMutation.mutate(schema)} className="mt-4">
        Save Changes
      </Button>
    </div>
  );
}
