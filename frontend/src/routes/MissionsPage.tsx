import PageHeader from "@/components/PageHeader";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { type MissionTypeApi, type MissionType } from "@/types/ApiTypes";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/react-router";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";

export default function MissionsPage() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (name: string) => {
      return await fetch("/api/post/mission", {
        method: "POST",
        body: JSON.stringify({ name: name }),
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
    },
  });

  const { data, isPending, isError } = useQuery<
    MissionTypeApi[],
    Error,
    MissionType[]
  >({
    queryKey: ["api", "missions"],
    queryFn: async () => {
      const res = await fetch("/api/get/missions");
      if (!res.ok) {
        throw new Error("Failed to fetch missions");
      }
      return res.json();
    },
    select: (apiData): MissionType[] => {
      return apiData.map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt),
      }));
    },
  });

  return (
    <PageWrapper>
      <PageHeader
        title="Missions"
        items={
          <>
            <NewMissionButton mutation={mutation} />
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </>
        }
      />
      <div className="p-4">
        {isPending ? (
          <p>Loading...</p>
        ) : isError ? (
          <p>Failed to fetch missions</p>
        ) : (
          data.map((d, idx) => (
            <Link to={`/${d.id}`}>
              <div
                key={idx}
                className="w-24 h-20 bg-neutral-800 flex items-center justify-center rounded-md"
              >
                <p>{d.name}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </PageWrapper>
  );
}

function NewMissionButton({
  mutation,
}: {
  mutation: UseMutationResult<Response, Error, string, unknown>;
}) {
  const [name, setName] = useState<string>("");

  return (
    <Dialog>
      <DialogTrigger>
        <Button>New Mission</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Mission</DialogTitle>
          <DialogDescription>
            Enter the information for your PROVES Kit mission.
          </DialogDescription>
        </DialogHeader>
        <div className="flex">
          <div className="w-1/2 flex flex-col">
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="w-30 h-30 rounded-full bg-neutral-700" />
              <Button className="w-full">Upload Icon</Button>
            </div>
          </div>
          <div className="w-1/2 flex flex-col">
            <p>Name</p>
            <Input
              placeholder="Enter name here..."
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={() => mutation.mutate(name)}>Create Mission</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
