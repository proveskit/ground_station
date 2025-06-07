import PageHeader from "@/components/PageHeader";

export default function Settings() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Configure application preferences"
      />
      <div className="flex-1 p-4">
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">Settings Panel</h3>
          <p className="text-muted-foreground mt-2">
            Application settings and preferences will be configured here.
          </p>
        </div>
      </div>
    </>
  );
}
