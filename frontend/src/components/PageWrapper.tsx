import type { ReactNode } from "react";

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full w-full max-w-[1600px] flex-col mx-auto">
      {children}
    </div>
  );
}
