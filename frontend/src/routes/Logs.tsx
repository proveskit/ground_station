export default function Logs() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h1 className="text-2xl font-bold">Logs</h1>
        <p className="text-muted-foreground">
          View system logs and diagnostics
        </p>
      </div>
      <div className="flex-1 p-4">
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">Log Viewer</h3>
          <p className="text-muted-foreground mt-2">
            System logs and diagnostic information will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
}
