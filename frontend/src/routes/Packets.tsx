import PageHeader from "@/components/PageHeader";

export default function Packets() {
  return (
    <>
      <PageHeader
        title="Packets"
        description="Monitor and analyze data packets"
      />
      <div className="flex-1 p-4">
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">Packet Monitor</h3>
          <p className="text-muted-foreground mt-2">
            Real-time packet analysis and monitoring will be displayed here.
          </p>
        </div>
      </div>
    </>
  );
}
