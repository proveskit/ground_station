import PageHeader from "@/components/PageHeader";
import { useMakeQuery } from "@/lib/utils";
import type { Packet } from "@/types/ApiTypes";
import type { PacketSchema } from "@/types/SchemaTypes";
import { formatDateTime } from "@/utils/formatDate";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router";

export default function Packets() {
  let { mid } = useParams();
  const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null);

  const packetQuery = useMakeQuery<{
    schema: PacketSchema;
    packets: Packet[];
  }>("api/get/packets", async () => {
    const response = await fetch(`/api/get/packets?id=${mid}`);
    if (!response.ok) {
      throw new Error("Failed to get packets");
    }
    return response.json();
  });

  const schemaQuery = useQuery({
    queryKey: ["api", "schema"],
    queryFn: async () => {
      const res = await fetch(`/api/get/schema?id=${mid}`);
      if (!res.ok) {
        throw new Error("Failed to fetch schema");
      }

      const body = await res.json();

      if (body["schema"] === "") {
        return [];
      } else {
        try {
          return JSON.parse(body["schema"]);
        } catch (e) {
          console.error(e);
          return [];
        }
      }
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <div className="flex flex-col h-screen">
      <PageHeader
        title="Packets"
        description="Monitor and analyze data packets"
      />
      {packetQuery.isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="w-full flex-1 flex flex-row-reverse">
          <div className="border-l border-neutral-800 h-full w-[400px] bg-neutral-900">
            {selectedPacket ? (
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">Packet Details</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(selectedPacket.received_at)}
                  </p>
                </div>

                <h4 className="font-semibold mt-4">Raw Packet</h4>
                <pre className="text-xs bg-neutral-800 p-2 my-2 rounded-md whitespace-pre-wrap break-all">
                  {JSON.stringify(
                    JSON.parse(selectedPacket.packet_data),
                    null,
                    2,
                  )}
                </pre>

                <h4 className="font-semibold mt-4">Parsed Data</h4>
                <div className="my-2 space-y-1">
                  {Object.entries(JSON.parse(selectedPacket.packet_data)).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-start text-sm border-b border-neutral-700 py-1 gap-4"
                      >
                        <p className="font-mono text-neutral-400">{key}</p>
                        <p className="font-mono break-all text-right flex-1">
                          {String(value)}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p>Select a packet to analyze it</p>
              </div>
            )}
          </div>
          <div className="flex-1 h-full flex flex-col gap-2 items-center p-3 overflow-y-auto">
            {packetQuery.data?.packets.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPacket(p)}
                className={`w-full flex gap-2 border border-neutral-800 rounded-md p-2 cursor-pointer hover:bg-neutral-800 ${selectedPacket?.id === p.id ? "bg-neutral-800" : ""}`}
              >
                <p>{formatDateTime(p.received_at)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

