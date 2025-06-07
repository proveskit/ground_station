import PageHeader from "@/components/PageHeader";

export default function SoftwareUpdate() {
  return (
    <>
      <PageHeader
        title="Software Update"
        description="Manage system software updates"
      />
      <div className="flex-1 p-4">
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">Software Update Manager</h3>
          <p className="text-muted-foreground mt-2">
            Check for updates and manage software versions here.
          </p>
        </div>
      </div>
    </>
  );
}
