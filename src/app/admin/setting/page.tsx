"use client";
import NavLayout from "@/components/NavLayout";
import React, { useState } from "react";
import Offices from "./Offices";
import Services from "./Services";
import ResetPassword from "@/components/ResetPassword";
import OfficesAccount from "./OfficesAccount";
import ChangeEmail from "./ChangeEmail";

const AdminAccount = () => {
  const [officeAccOpen, setOfficeAccOpen] = useState(false);
  const [officeOpen, setOfficeOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [changeEmailOpen, setChangeEmailOpen] = useState(false);

  return (
    <NavLayout>
      <div className="p-8">
        <h1 className="text-xl font-bold my-4">Admin Settings</h1>
        <div className="flex flex-col justify-center gap-8">

          <div className="mb-6">
            <div
              className="cursor-pointer flex justify-between items-center bg-gray-200 bg-opacity-80 p-4 rounded-lg"
              onClick={() => setOfficeAccOpen(!officeAccOpen)}
            >
              <h2 className="font-semibold">Office Account Settings</h2>
              <span>{officeAccOpen ? "-" : "+"}</span>
            </div>
            {officeAccOpen && (
              <div className="mt-4 space-y-4 p-4 border-gray-200">
                <OfficesAccount />
              </div>
            )}
          </div>

          <div className="mb-6">
            <div
              className="cursor-pointer flex justify-between items-center bg-gray-200 bg-opacity-80 p-4 rounded-lg"
              onClick={() => setOfficeOpen(!officeOpen)}
            >
              <h2 className="font-semibold">Offices</h2>
              <span>{officeOpen ? "-" : "+"}</span>
            </div>
            {officeOpen && (
              <div className="mt-4 space-y-4 p-4 border-gray-200">
                <Offices />
              </div>
            )}
          </div>
          <div className="mb-6">
            <div
              className="cursor-pointer flex justify-between items-center bg-gray-200 bg-opacity-80 p-4 rounded-lg"
              onClick={() => setServiceOpen(!serviceOpen)}
            >
              <h2 className="font-semibold">Services</h2>
              <span>{serviceOpen ? "-" : "+"}</span>
            </div>
            {serviceOpen && (
              <div className="mt-4 space-y-4 p-4 border-gray-200">
                <Services />
              </div>
            )}
          </div>
          <div className="mb-6">
            <div
              className="cursor-pointer flex justify-between items-center bg-gray-200 bg-opacity-80 p-4 rounded-lg"
              onClick={() => setPasswordOpen(!passwordOpen)}
            >
              <h2 className="font-semibold">Reset Password</h2>
              <span>{passwordOpen ? "-" : "+"}</span>
            </div>
            {passwordOpen && (
              <div className="mt-4 space-y-4 p-4 border-gray-200">
                <ResetPassword />
              </div>
            )}
          </div>
          <div className="mb-6">
            <div
              className="cursor-pointer flex justify-between items-center bg-gray-200 bg-opacity-80 p-4 rounded-lg"
              onClick={() => setChangeEmailOpen(!changeEmailOpen)}
            >
              <h2 className="font-semibold">Change Email</h2>
              <span>{changeEmailOpen ? "-" : "+"}</span>
            </div>
            {changeEmailOpen && (
              <div className="mt-4 space-y-4 p-4 border-gray-200">
                <ChangeEmail />
              </div>
            )}
          </div>
        </div>
      </div>
    </NavLayout>
  );
};

export default AdminAccount;
