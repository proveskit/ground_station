import PageHeader from "@/components/PageHeader";
import PageWrapper from "@/components/PageWrapper";
import { Link } from "react-router";

export default function MissionsPage() {
  return (
    <PageWrapper>
      <PageHeader title="Missions" />
      <div className="p-4">
        <Link to={{ pathname: "/1" }}>
          <p>go to thinkg</p>
        </Link>
      </div>
    </PageWrapper>
  );
}
