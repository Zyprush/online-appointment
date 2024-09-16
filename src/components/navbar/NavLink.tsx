import Link from "next/link";
import React from "react";
import { LucideIcon } from "lucide-react"; // Import the type for Lucide icons

interface NavLinkProps {
  href: string;
  icon: LucideIcon; // Use LucideIcon type for lucide-react icons
  label: string;
  isMinimized: boolean;
  isActive: boolean;
}

export const NavLink: React.FC<NavLinkProps> = ({
  href,
  icon: Icon,
  label,
  isMinimized,
  isActive,
}) => (
  <Link
    href={href}
    className={`w-full items-center justify-start flex gap-3 text-sm font-[500] p-3 hover:bg-secondary rounded-md hover:text-white transition-all duration-300 hover:dark:text-white hover:shadow-inner ${
      isActive ? "dark:bg-secondary bg-primary text-white" : "text-primary dark:text-zinc-300"
    }`}
  >
    <span className={`w-auto ${isMinimized ? "mx-auto" : ""}`}>
      <Icon className="text-xl" /> {/* Icon rendered properly */}
    </span>
    {!isMinimized && label}
  </Link>
);
