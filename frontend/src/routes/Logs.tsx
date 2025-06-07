import PageHeader from "@/components/PageHeader";

export default function Logs() {
  return (
    <>
      <PageHeader title="Logs" description="View system logs and diagnostics" />
      <div className="flex-1 p-4">
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">Log Viewer</h3>
          <p className="text-muted-foreground mt-2">
            System logs and diagnostic information will be displayed here.
          </p>
        </div>
      </div>
    </>
  );
}
