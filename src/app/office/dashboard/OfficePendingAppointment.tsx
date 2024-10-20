"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  collection,
  getDocs,
  doc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { useOffice } from "@/hooks/useOffice"; // Import the custom hook
import ViewAppointment from "@/components/ViewAppointment";
import { db } from "@/firebase";

type AppointmentType = {
  id: string;
  appointmentType: string;
  selectedDate: string;
  timeRange: string;
  selectedService: string;
  selectedPersonnel: string;
  selectedOffice: string;
  otherReason: string;
  name: string;
  contact: string;
  email: string;
  role: string;
  dateCreated: string;
  status: string;
  officeCode: string;
};

const OfficePendingAppointment = () => {
  const officeData = useOffice(); // Use the custom hook to get office data
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    AppointmentType[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [approving, setApproving] = useState<boolean>(false); // Loading state for approval

  // Fetch Appointments
  const fetchAppointments = async () => {
    if (!officeData) {
      setLoading(false);
      return;
    }

    try {
      const appointmentsRef = query(
        collection(db, "appointments"),
        where("selectedOffice", "==", officeData.office),
        where("status", "==", "pending")
      );
      const snapshot = await getDocs(appointmentsRef);
      const appointmentsList = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as AppointmentType)
      );
      setAppointments(appointmentsList);
      setFilteredAppointments(appointmentsList); // Initialize filtered list
    } catch (err) {
      setError("Error fetching appointments: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Filter appointments by search query
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = appointments.filter((appointment) =>
      appointment.name.toLowerCase().includes(query)
    );
    setFilteredAppointments(filtered);
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [officeData]);

  const handleDecline = async (id: string) => {
    if (window.confirm("Are you sure you want to decline this appointment?")) {
      try {
        const appointmentRef = doc(db, "appointments", id);
        await updateDoc(appointmentRef, { status: "declined" });
        setAppointments(appointments.filter((appt) => appt.id !== id)); // Remove from state
        setFilteredAppointments(
          filteredAppointments.filter((appt) => appt.id !== id)
        ); // Remove from filtered list
      } catch (err) {
        setError("Error declining appointment: " + (err as Error).message);
      }
    }
  };

  const checkExistingAppointments = async (
    selectedDate: string,
    timeRange: string
  ): Promise<number> => {
    try {
      if (!officeData) return 0;
      const appointmentsRef = query(
        collection(db, "appointments"),
        where("selectedOffice", "==", officeData.office),
        where("selectedDate", "==", selectedDate),
        where("timeRange", "==", timeRange),
        where("status", "==", "approved")
      );
      const snapshot = await getDocs(appointmentsRef);
      return snapshot.size;
    } catch (err) {
      console.error("Error checking existing appointments:", err);
      throw err;
    }
  };

  const handleApprove = async (id: string, appointment: AppointmentType) => {
    if (window.confirm("Do you want to approve this appointment?")) {
      setApproving(true); // Set approving state to true
      try {
        const appointmentCount = await checkExistingAppointments(
          appointment.selectedDate,
          appointment.timeRange
        );
        console.log("appointmentCount", appointmentCount);
        if (appointmentCount >= 4) {
          alert("There are already 4 (four) appointments for that time range.");
          setApproving(false); // Set approving state to false
          return;
        }

        const response = await axios.post(
          "/pages/api/send-sms",
          {
            appointmentId: appointment.id,
            contact: appointment.contact,
            selectedDate: appointment.selectedDate,
            timeRange: appointment.timeRange,
            selectedOffice: appointment.selectedOffice,
            selectedPersonnel: appointment.selectedPersonnel,
          },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data.success) {
          const appointmentRef = doc(db, "appointments", id);
          await updateDoc(appointmentRef, { status: "approved" });

          window.location.reload(); // Reload the page after successful approval
        } else {
          setError("Failed to send SMS: " + response.data.error);
        }
      } catch (err) {
        setError("Error approving appointment: " + (err as Error).message);
      } finally {
        setApproving(false); // Reset approving state after the operation
      }
    }
  };

  const handleView = (appointment: AppointmentType) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!officeData) {
    return <div>No office data available. Please log in.</div>;
  }

  return (
    <div className="bg-white p-4 rounded shadow overflow-x-auto">
      <input
        type="text"
        placeholder="Search by Name"
        value={searchQuery}
        onChange={handleSearch}
        className="border rounded w-80 px-2 py-1 mb-4"
      />
      <table className="table-auto w-full text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Code</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Appointment Type</th>
            <th className="px-4 py-2">Schedule</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="border px-4 py-2">{`${appointment.officeCode}${appointment.id}`}</td>
                <td className="border px-4 py-2">{appointment.name}</td>
                <td className="border px-4 py-2">
                  {appointment.appointmentType}
                </td>
                <td className="border px-4 py-2">{`${appointment.selectedDate} ${appointment.timeRange}`}</td>
                <td className="border px-4 py-2">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleView(appointment)}
                  >
                    View
                  </button>
                  <button
                    className={`text-green-500 hover:underline ml-2 ${
                      approving ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => handleApprove(appointment.id, appointment)}
                    disabled={approving}
                  >
                    {approving ? "Approving..." : "Approve"}
                  </button>
                  <button
                    className="text-red-500 hover:underline ml-2"
                    onClick={() => handleDecline(appointment.id)}
                  >
                    Decline
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border px-4 py-2" colSpan={5}>
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && selectedAppointment && (
        <ViewAppointment
          appointment={selectedAppointment}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default OfficePendingAppointment;
