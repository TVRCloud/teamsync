"use client";

import { useViewUser } from "@/hooks/useUser";
import { useParams } from "next/navigation";

const ViewMembersMain = () => {
  const params = useParams<{ id: string }>();

  const { data } = useViewUser(params.id);

  return <div>Member {params.id}</div>;
};

export default ViewMembersMain;
