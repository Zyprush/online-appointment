"use client";
import React, { useState } from "react";
import Appointment from "./Appointment";
import RequestAppointment from "./RequestAppointment";
import AppointmentHistory from "./AppointmentHistory";
import NavLayout from "@/components/NavLayout";
import { PlusCircle, Folder, FileText } from "lucide-react"; // Import Lucide icons

const StudentDashboard: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>("dashboard");

  return (
    <NavLayout>
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <div className="w-full md:w-80 bg-gray-100 p-4">
          <h2 className="text-lg font-bold mb-4">Folders</h2>
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
                <PlusCircle className="mr-2" /> Request Appointment
              </button>
            </li>
            <li className="mb-2">
              <button
                className={`w-full flex items-center justify-start py-2 px-4 rounded ${
                  activeComponent === "appointments"
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setActiveComponent("appointments")}
              >
                <Folder className="mr-2" /> Your Appointments
              </button>
            </li>
            <li className="mb-2">
              <button
                className={`w-full flex items-center justify-start py-2 px-4 rounded ${
                  activeComponent === "appointmentHistory"
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setActiveComponent("appointmentHistory")}
              >
                <FileText className="mr-2" /> Appointment History
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 p-4 md:p-6">
          {activeComponent === "requestAppointment" && <RequestAppointment />}
          {/* <Reminder /> */}
          {activeComponent === "dashboard" && <Appointment />}
          {activeComponent === "appointments" && <Appointment />}
          {activeComponent === "appointmentHistory" && <AppointmentHistory />}
        </div>
      </div>
    </NavLayout>
  );
};

export default StudentDashboard;
