"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useOffice } from "@/hooks/useOffice";
import ViewAppointment from "@/components/ViewAppointment";
import { db } from "@/firebase";
import { useFeedback } from "@/hooks/useFeedback";
import { currentTime } from "@/helper/time";
import { useSendSMS } from "@/hooks/useSendSMS";
import { useLogs } from "@/hooks/useLogs";

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
  submittedUid: string;
};

const OfficeApproveAppointment = () => {
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
  const { addFeedback } = useFeedback();
  const { sendDeclineSMS } = useSendSMS();
  const {addLog} = useLogs();


  const fetchAppointments = async () => {
    if (!officeData) {
      setLoading(false);
      return;
    }

    try {
      const appointmentsRef = query(
        collection(db, "appointments"),
        where("selectedOffice", "==", officeData.office),
        where("status", "==", "approved")
      );
      const snapshot = await getDocs(appointmentsRef);
      const appointmentsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AppointmentType[];

      // Sort appointments, moving today's appointments to the top
      const today = new Date().toISOString().split("T")[0];
      appointmentsList.sort((a, b) => {
        if (a.selectedDate === today && b.selectedDate !== today) return -1;
        if (a.selectedDate !== today && b.selectedDate === today) return 1;
        return (
          new Date(a.selectedDate).getTime() -
          new Date(b.selectedDate).getTime()
        );
      });

      setAppointments(appointmentsList);
      setFilteredAppointments(appointmentsList);
    } catch (err) {
      setError("Error fetching appointments: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintTable = () => {
    window.print();
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    filterAppointments(query, selectedDate);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value;
    setSelectedDate(date);
    filterAppointments(searchQuery, date);
  };

  const filterAppointments = (query: string, date: string) => {
    const filtered = appointments.filter((appointment) => {
      const matchesName = appointment.name.toLowerCase().includes(query);
      const matchesDate = date ? appointment.selectedDate === date : true;
      return matchesName && matchesDate;
    });
    setFilteredAppointments(filtered);
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [officeData]);

  const handleView = (appointment: AppointmentType) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCancel = async (id: string) => {
    const appointment = appointments.find((appt) => appt.id === id);

    if (!appointment) return; // If no appointment is found, exit function
    const declineReason = window.prompt(
      "Reason for cancelling the appointment?"
    );
    if (declineReason) {
      try {
        const appointmentRef = doc(db, "appointments", id);
        await updateDoc(appointmentRef, {
          status: "declined",
          declineReason: declineReason,
        });

        // Send SMS notification
        const smsResponse = await sendDeclineSMS({
          appointmentId: appointment.id,
          contact: appointment.contact,
          selectedDate: appointment.selectedDate,
          timeRange: appointment.timeRange,
          selectedOffice: appointment.selectedOffice,
          selectedPersonnel: appointment.selectedPersonnel,
          declineReason: declineReason,
          officeCode: appointment.officeCode,
        });

        if (!smsResponse.success) {
          setError("Failed to send SMS: " + smsResponse.error);
        }
        // Update state after SMS
        setAppointments(appointments.filter((appt) => appt.id !== id));
        setFilteredAppointments(
          filteredAppointments.filter((appt) => appt.id !== id)
        );
      } catch (err) {
        setError("Error declining appointment: " + (err as Error).message);
      }
    } else {
      alert("You didn't enter a Reason.");
    }
  };

  const handleCompleted = async (id: string) => {
    const appointment = appointments.find((app) => app.id === id);
    if (window.confirm("Do you want to mark this appointment as completed?")) {
      setLoading(true);
      try {
        const appointmentRef = doc(db, "appointments", id);
        await updateDoc(appointmentRef, { status: "completed" });
        setAppointments((prev) =>
          prev.filter((appointment) => appointment.id !== id)
        );
        setFilteredAppointments((prev) =>
          prev.filter((appointment) => appointment.id !== id)
        );
        addFeedback({
          clientId: appointment?.submittedUid || "defaultClientId",
          office: officeData?.office || "",
          date: currentTime,
          completed: false,
        });
        addLog({
          name: `Completed ${appointment?.name} appointment`,
          appointmentDate: appointment?.selectedDate || "",
          office: officeData?.office || "",
          date: currentTime,
        })
      } catch (err) {
        setError("Error completing appointment: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    }
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

      <table className="table-auto w-full text-left print:text-xs">
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
                    Details
                  </button>
                  <button
                    className="btn btn-xs rounded-sm text-white btn-primary"
                    onClick={() => handleCompleted(appointment.id)}
                  >
                    Completed
                  </button>
                  <button
                    className="btn btn-error text-white btn-xs rounded-sm"
                    onClick={() => handleCancel(appointment.id)}
                    disabled={loading}
                  >
                    Cancel
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

export default OfficeApproveAppointment;
