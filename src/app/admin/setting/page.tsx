"use client";
import NavLayout from "@/components/NavLayout";
import React from "react";
import Offices from "./Offices"; // Updated import statement
import Services from "./Services";

const AdminAccount = () => {
  return (
    <NavLayout>
      <h1 className="text-xl font-bold my-4">Admin Settings</h1>
      <div className="grid grid-cols-2 gap-5">
        <Services/>
        <Offices />
      </div>
    </NavLayout>
  );
};

export default AdminAccount;
