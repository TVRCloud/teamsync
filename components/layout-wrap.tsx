import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const LayoutWrap = ({ children, className }: Props) => {
  return <div className={(cn(className), "p-4")}>{children}</div>;
};

export default LayoutWrap;
