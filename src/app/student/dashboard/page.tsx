"use client";
import React, { useState } from "react";
import Reminder from "./Reminder";
import Appointment from "./Appointment";
import RequestAppointment from "./RequestAppointment";
import AppointmentHistory from "./AppointmentHistory";
import NavLayout from "@/components/NavLayout";

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
                className="w-full flex items-center justify-center bg-primary text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={() => setActiveComponent("requestAppointment")}
              >
                + Request Appointment
              </button>
            </li>
            <li className="mb-2">
              <button
                className="w-full flex items-center justify-start text-gray-600 py-2 px-4 rounded hover:bg-gray-200"
                onClick={() => setActiveComponent("appointments")}
              >
                📁 Your Appointments
              </button>
            </li>
            <li className="mb-2">
              <button
                className="w-full flex items-center justify-start text-gray-600 py-2 px-4 rounded hover:bg-gray-200"
                onClick={() => setActiveComponent("appointmentHistory")}
              >
                📄 Appointment History
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 p-4 md:p-6">
          <Reminder />
          {activeComponent === "dashboard" && <Appointment />}
          {activeComponent === "requestAppointment" && <RequestAppointment />}
          {activeComponent === "appointments" && <Appointment />}
          {activeComponent === "appointmentHistory" && <AppointmentHistory />}
        </div>
      </div>
    </NavLayout>
  );
};

export default StudentDashboard;
