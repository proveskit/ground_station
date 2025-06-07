import PageHeader from "@/components/PageHeader";

export default function Commands() {
  return (
    <>
      <PageHeader
        title="Commands"
        description="Manage and execute system commands"
      />
      <div className="flex-1 p-4">
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">Commands Interface</h3>
          <p className="text-muted-foreground mt-2">
            Command management functionality will be implemented here.
          </p>
        </div>
      </div>
    </>
  );
}
