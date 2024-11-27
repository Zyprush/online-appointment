"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useOffice } from "@/hooks/useOffice";
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

const OfficeCompletedAppointment = () => {
  const officeData = useOffice();
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    AppointmentType[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
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
        where("status", "==", "completed")
      );
      const snapshot = await getDocs(appointmentsRef);
      const appointmentsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AppointmentType[];

      setAppointments(appointmentsList);
      setFilteredAppointments(appointmentsList);
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

  const handlePrintTable = () => {
    window.print();
  };
  return (
    <div className="bg-white p-4 rounded shadow overflow-x-auto print:text-xs">
      <div className="flex items-center mb-4 gap-5 print:hidden">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchQuery}
          onChange={handleSearch}
          className="border rounded w-80 px-2 py-1 "
        />
        <span className="flex gap-2 items-center">
          <p>Filter by Date</p>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="border rounded w-40 px-2 py-1"
          />
        </span>
        <button
          className="btn rounded-sm text-white btn-primary"
          onClick={handlePrintTable}
        >
          Print Appointements
        </button>
      </div>

      <table className="table-auto w-full text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Code</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Schedule</th>
            <th className="px-4 py-2 print:hidden">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="border px-4 py-2">{`${appointment.officeCode}${appointment.id}`}</td>
                <td className="border px-4 py-2">{appointment.name}</td>
                <td className="border px-4 py-2">{appointment.email}</td>
                <td className="border px-4 py-2">{`${appointment.selectedDate} ${appointment.timeRange}`}</td>
                <td className="border px-4 py-2 space-x-3 print:hidden">
                  <button
                    className="btn btn-xs rounded-sm text-primary btn-outline"
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

export default OfficeCompletedAppointment;
