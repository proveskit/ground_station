import PageHeader from "@/components/PageHeader";
import { useQuery } from "@tanstack/react-query";

type ProvesPacket = {
  id: number;
  time: string;
  packet: string;
};

export default function Packets() {
  const query = useQuery<ProvesPacket[]>({
    queryKey: ["packets"],
    queryFn: async () => {
      const response = await fetch("/api/get/packets");
      if (!response.ok) {
        throw new Error("Failed to get packets");
      }
      return response.json();
    },
  });

  console.log(query.data);

  return (
    <>
      <PageHeader
        title="Packets"
        description="Monitor and analyze data packets"
      />
      <div className="flex-1 p-4 gap-2 flex flex-col">
        {query.isLoading ? (
          <p>Fetching...</p>
        ) : (
          query.data?.map((p, idx) => (
            <div
              key={idx}
              className="flex flex-col bg-neutral-800/75 w-full p-2 rounded-sm"
            >
              {p.packet}
            </div>
          ))
        )}
      </div>
    </>
  );
}
