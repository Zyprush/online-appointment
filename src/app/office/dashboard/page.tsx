"use client";
import React, { useState } from "react";
import NavLayout from "@/components/NavLayout";
import ApprovedAppointments from "./ApprovedAppointment"; // Import the ApprovedAppointments component
import DeclinedAppointments from "./DeclinedAppointment"; // Import the DeclinedAppointments component
import OfficePendingAppointment from "../dashboard copy/OfficePendingAppointment";

const AdminAppointments: React.FC = () => {
  const [status, setStatus] = useState<string>("pending"); // State to manage selected status

  return (
    <NavLayout>
      <div className="bg-white p-6 rounded-lg pt-5 flex flex-col h-full justify-start">
        <h2 className="text-2xl font-bold mb-4">Appointments</h2>
        <div className="mb-4">
          <button
            className={`mr-2 px-4 py-2 rounded ${status === "pending" ? "bg-primary text-white" : "bg-gray-200"}`}
            onClick={() => setStatus("pending")}
          >
            Pending
          </button>
          <button
            className={`mr-2 px-4 py-2 rounded ${status === "approved" ? "bg-primary text-white" : "bg-gray-200"}`}
            onClick={() => setStatus("approved")}
          >
            Approved
          </button>
          <button
            className={`px-4 py-2 rounded ${status === "declined" ? "bg-primary text-white" : "bg-gray-200"}`}
            onClick={() => setStatus("declined")}
          >
            Declined
          </button>
        </div>

        {status === "pending" && <OfficePendingAppointment />}
        {status === "approved" && <ApprovedAppointments />}
        {status === "declined" && <DeclinedAppointments />}
      </div>
    </NavLayout>
  );
};

export default AdminAppointments;
