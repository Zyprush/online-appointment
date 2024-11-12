"use client";
import React, { useState, useEffect } from "react";
import NavLayout from "@/components/NavLayout";
import ApprovedAppointments from "./OfficeApprovedAppointment";
import DeclinedAppointments from "./OfficeDeclinedAppointment";
import OfficePendingAppointment from "./OfficePendingAppointment";
import { useOffice } from "@/hooks/useOffice";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import OfficeCompletedAppointment from "./OfficeCompletedAppointment";

const AdminAppointments: React.FC = () => {
  const [status, setStatus] = useState<string>("pending");
  const officeData = useOffice();
  const [pendingCount, setPendingCount] = useState<number>(0);

  const countPendingAppointments = async () => {
    try {
      if (!officeData) return;

      const appointmentsRef = query(
        collection(db, "appointments"),
        where("selectedOffice", "==", officeData.office),
        where("status", "==", "pending")
      );

      const snapshot = await getDocs(appointmentsRef);
      setPendingCount(snapshot.size);
    } catch (err) {
      console.error("Error counting pending appointments:", err);
    }
  };

  useEffect(() => {
    if (officeData) {
      countPendingAppointments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [officeData]);

  return (
    <NavLayout>
      <div className="bg-white p-6 rounded-lg pt-5 flex flex-col h-full justify-start">
        <h2 className="text-2xl font-bold mb-4">
          {officeData?.office} Appointments
        </h2>
        <div className="mb-4 flex gap-5">
          <button
            className={`mr-2 px-4 py-2 rounded ${
              status === "pending" ? "bg-primary text-white" : "bg-gray-200"
            } relative`}
            onClick={() => setStatus("pending")}
          >
            Pending
            {pendingCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-semibold font-mono p-2 border border-white">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            className={`mr-2 px-4 py-2 rounded ${
              status === "approved" ? "bg-primary text-white" : "bg-gray-200"
            }`}
            onClick={() => setStatus("approved")}
          >
            Approved
          </button>
          <button
            className={`px-4 py-2 rounded ${
              status === "declined" ? "bg-primary text-white" : "bg-gray-200"
            }`}
            onClick={() => setStatus("declined")}
          >
            Declined
          </button>
          <button
            className={`px-4 py-2 rounded ${
              status === "completed" ? "bg-primary text-white" : "bg-gray-200"
            }`}
            onClick={() => setStatus("completed")}
          >
            Completed
          </button>
        </div>
        {status === "pending" && <OfficePendingAppointment />}
        {status === "approved" && <ApprovedAppointments />}
        {status === "declined" && <DeclinedAppointments />}
        {status === "completed" && <OfficeCompletedAppointment />}
      </div>
    </NavLayout>
  );
};

export default AdminAppointments;