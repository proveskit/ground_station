export default function PageHeader({
  title,
  description,
  items,
}: {
  title: string;
  description?: string;
  items?: React.ReactNode;
}) {
  return (
    <div className="border-b p-4 mb-2 w-full">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex items-center gap-4">{items}</div>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
