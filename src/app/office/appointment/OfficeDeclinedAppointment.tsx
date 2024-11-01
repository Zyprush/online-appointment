"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
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

const OfficeDeclinedAppointment = () => {
  const officeData = useOffice(); // Use the custom hook to get office data
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    AppointmentType[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const [selectedDate, setSelectedDate] = useState<string>(""); // State for selected date
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
        where("status", "==", "declined")
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

  // Filter appointments by search query and selected date
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    filterAppointments(query, selectedDate);
  };

  // Handle date change
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value;
    setSelectedDate(date);
    filterAppointments(searchQuery, date);
  };

  // Filter appointments based on search query and selected date
  const filterAppointments = (query: string, date: string) => {
    const filtered = appointments.filter((appointment) => {
      const matchesName = appointment.name.toLowerCase().includes(query);
      const matchesDate = date ? appointment.selectedDate === date : true;
      return matchesName && matchesDate;
    });
    setFilteredAppointments(filtered);
  };

  // Fetch appointments when the component mounts
  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [officeData]);

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
      <div className="flex items-center mb-4 gap-5">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchQuery}
          onChange={handleSearch} // Add the search handler
          className="border rounded w-80 px-2 py-1 "
        />
        <span className="flex gap-2 items-center">
          <p>Filter by Date</p>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange} // Add date change handler
            className="border rounded w-40 px-2 py-1"
          />
        </span>
      </div>

      <table className="table-auto w-full text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Code</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
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
                  {appointment.email}
                </td>
                <td className="border px-4 py-2">{`${appointment.selectedDate} ${appointment.timeRange}`}</td>
                <td className="border px-4 py-2">
                  <button
                    className="btn-xs btn-outline text-primary rounded-sm btn"
                    onClick={() => handleView(appointment)}
                  >
                    details
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

export default OfficeDeclinedAppointment;
