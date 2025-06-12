import {
  CardContent,
  CardHeader,
  CardTitle,
  DarkCard,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function SimpleTextCard({
  title,
  data,
}: {
  title: string;
  data: {
    color: string;
    text: string;
  };
}) {
  return (
    <DarkCard className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent
        className={cn(
          data.color,
          "w-full flex flex-1 justify-center items-center text-2xl font-bold"
        )}
      >
        {data.text}
      </CardContent>
    </DarkCard>
  );
}
