"use client";

import { useViewTeam } from "@/hooks/useTeam";
import { useParams } from "next/navigation";

const ViewTeamMain = () => {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useViewTeam(params.id);
  return <div>ViewTeamMain {params.id}</div>;
};

export default ViewTeamMain;
