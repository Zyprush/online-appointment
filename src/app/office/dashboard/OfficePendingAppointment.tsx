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
  const [filteredAppointments, setFilteredAppointments] = useState<AppointmentType[]>([]); // State for filtered appointments
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Extracted fetchAppointments function
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
      const appointmentsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        appointmentType: doc.data().appointmentType || "",
        selectedDate: doc.data().selectedDate || "",
        timeRange: doc.data().timeRange || "",
        selectedService: doc.data().selectedService || "",
        selectedPersonnel: doc.data().selectedPersonnel || "",
        selectedOffice: doc.data().selectedOffice || "",
        otherReason: doc.data().otherReason || "",
        name: doc.data().name || "",
        contact: doc.data().contact || "",
        email: doc.data().email || "",
        role: doc.data().role || "",
        dateCreated: doc.data().dateCreated || "",
        status: doc.data().status || "",
        officeCode: doc.data().officeCode || "",
      }));
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

  // Fetch appointments when the component mounts
  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [officeData]);

  const handleDecline = async (id: string) => {
    if (window.confirm("Are you sure you want to decline this appointment?")) {
      try {
        const appointmentRef = doc(db, "appointments", id);
        await updateDoc(appointmentRef, { status: "declined" }); // Update status to declined
        setAppointments(appointments.filter((appt) => appt.id !== id)); // Remove from state
        setFilteredAppointments(filteredAppointments.filter((appt) => appt.id !== id)); // Remove from filtered list
      } catch (err) {
        setError("Error declining appointment: " + (err as Error).message);
      }
    }
  };

  const handleApprove = async (id: string, appointment: AppointmentType) => {
    if (window.confirm("Do you want to approve this appointment?")) {
      try {
        // Call the API to send SMS using axios
        const response = await axios.post(
          "/pages/api/send-sms", // Use relative path for API call
          {
            appointmentId: appointment.id,
            contact: appointment.contact,
            selectedDate: appointment.selectedDate,
            timeRange: appointment.timeRange,
            selectedOffice: appointment.selectedOffice,
            selectedPersonnel: appointment.selectedPersonnel,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          // Update Firestore status to approved
          const appointmentRef = doc(db, "appointments", id);
          await updateDoc(appointmentRef, { status: "approved" });

          // Refetch appointments after approval to refresh the list
          await fetchAppointments();
        } else {
          setError("Failed to send SMS: " + response.data.error);
        }
      } catch (err) {
        setError("Error approving appointment: " + (err as Error).message);
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
        onChange={handleSearch} // Add the search handler
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
                    className="text-green-500 hover:underline ml-2"
                    onClick={() => handleApprove(appointment.id, appointment)}
                  >
                    Approve
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
