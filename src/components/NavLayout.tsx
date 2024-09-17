"use client";
import React, { ReactNode } from "react";
import Header from "./navbar/Header";

interface NavbarProps {
  children: ReactNode;
}

const NavLayout: React.FC<NavbarProps> = ({ children }) => {
  return (
    <div className="flex gap-0">
      <div className="flex flex-col w-full">
        <Header />
        <main className="md:pt-14 pt-20 p-5 bg-[rgb(243,245,248)] h-full min-h-screen">{children}</main>
      </div>
    </div>
  );
};

export default NavLayout;
