import React from "react";
import SideNavigation from "@/app/_components/SideNavigation";

export default function Layout({ children }: { children: React.ReactElement }) {
  return (
    <div className="grid grid-cols-[16rem_1fr] h-full gap-12">
      <SideNavigation />
      <div className="pt-1">{children}</div>
    </div>
  );
}
