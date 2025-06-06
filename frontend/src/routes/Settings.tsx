export default function Settings() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure application preferences
        </p>
      </div>
      <div className="flex-1 p-4">
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">Settings Panel</h3>
          <p className="text-muted-foreground mt-2">
            Application settings and preferences will be configured here.
          </p>
        </div>
      </div>
    </div>
  );
}
