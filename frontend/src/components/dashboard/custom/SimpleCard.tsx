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
    <DarkCard className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent
        className={cn(
          data.color,
          "w-full h-full flex justify-center items-center text-2xl font-bold"
        )}
      >
        {data.text}
      </CardContent>
    </DarkCard>
  );
}
