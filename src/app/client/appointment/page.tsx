"use client"; // Ensure this component is a client component
import React, { useState } from "react";
import ClientRequestAppointment from "./ClientRequestAppointment";
import NavLayout from "@/components/NavLayout";
import ClientApprovedAppointment from "./ClientApprovedAppointment";
import ClientCompletedAppointment from "./ClientCompletedAppointment";
import ClientDeclinedAppointment from "./ClientDeclinedAppointment";
import ClientPendingAppointment from "./ClientPendingAppointment";

const Page: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>(
    "approvedAppointments"
  );

  return (
    <NavLayout>
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="w-full md:w-80 bg-gray-100 p-4">
          <h2 className="text-lg font-bold mb-4">Appointments</h2>
          <ul>
            <li className="mb-2">
              <button
                className={`w-full flex items-center justify-start py-2 px-4 rounded ${
                  activeComponent === "requestAppointment"
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setActiveComponent("requestAppointment")}
              >
                Request Appointment
              </button>
            </li>

            <li className="mb-2">
              <button
                className={`w-full flex items-center justify-start py-2 px-4 rounded ${
                  activeComponent === "pendingAppointments"
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setActiveComponent("pendingAppointments")}
              >
                Pending Appointment
              </button>
            </li>

            <li className="mb-2">
              <button
                className={`w-full flex items-center justify-start py-2 px-4 rounded ${
                  activeComponent === "approvedAppointments"
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setActiveComponent("approvedAppointments")}
              >
                Approved Appointment
              </button>
            </li>

            <li className="mb-2">
              <button
                className={`w-full flex items-center justify-start py-2 px-4 rounded ${
                  activeComponent === "completedAppointments"
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setActiveComponent("completedAppointments")}
              >
                Completed Appointment
              </button>
            </li>

            <li className="mb-2">
              <button
                className={`w-full flex items-center justify-start py-2 px-4 rounded ${
                  activeComponent === "cancelledAppointments"
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setActiveComponent("cancelledAppointments")}
              >
                Cancelled Appointment
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 p-4 md:p-6">
          {activeComponent === "requestAppointment" && (
            <ClientRequestAppointment />
          )}
          {activeComponent === "pendingAppointments" && (
            <ClientPendingAppointment />
          )}
          {activeComponent === "approvedAppointments" && (
            <ClientApprovedAppointment />
          )}
          {activeComponent === "completedAppointments" && (
            <ClientCompletedAppointment />
          )}
          {activeComponent === "cancelledAppointments" && (
            <ClientDeclinedAppointment />
          )}
        </div>
      </div>
    </NavLayout>
  );
};

export default Page;
