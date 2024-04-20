"use client";

import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "../theme-switch";

export default function ButtonsNavBar() {
  return (
    <div className="flex items-center space-x-4">
      <ModeToggle />
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
