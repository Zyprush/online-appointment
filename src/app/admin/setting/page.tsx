"use client";
import NavLayout from "@/components/NavLayout";
import React from "react";
import Offices from "./Offices";
import Services from "./Services";
import Personnel from "./Personnel";
import ResetPassword from "@/components/ResetPassword";
import ReminderSetting from "./ReminderSetting";

const AdminAccount = () => {
  return (
    <NavLayout>
      <div className="p-8">
        <h1 className="text-xl font-bold my-4">Admin Settings</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <Offices />
          <Services />
          <Personnel />
          <ReminderSetting />
          <ResetPassword />
        </div>
      </div>
    </NavLayout>
  );
};

export default AdminAccount;
