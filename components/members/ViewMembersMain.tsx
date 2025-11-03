"use client";

import { useParams } from "next/navigation";

const ViewMembersMain = () => {
  const params = useParams<{ id: string }>();

  return <div>Member {params.id}</div>;
};

export default ViewMembersMain;
