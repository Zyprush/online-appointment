"use client";
import React, { useEffect, useState } from "react";
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
import { useSendSMS } from "@/hooks/useSendSMS";
import Link from "next/link";

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
  declineReason?: string;
};

const OfficePendingAppointment = () => {
  const officeData = useOffice();
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
  const { sendApproveSMS, sendDeclineSMS } = useSendSMS();

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
    const appointment = appointments.find((appt) => appt.id === id);

    if (!appointment) return; // If no appointment is found, exit function
    const declineReason = window.prompt(
      "Reason for declining the appointment?"
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

        if (appointmentCount >= 4) {
          alert("There are already 4 (four) appointments for that time range.");
          setApproving(false);
          return;
        }

        const response = await sendApproveSMS({
          appointmentId: appointment.id,
          contact: appointment.contact,
          selectedDate: appointment.selectedDate,
          timeRange: appointment.timeRange,
          selectedOffice: appointment.selectedOffice,
          selectedPersonnel: appointment.selectedPersonnel,
          declineReason: "",
        });

        if (response.success) {
          const appointmentRef = doc(db, "appointments", id);
          await updateDoc(appointmentRef, { status: "approved" });
          window.location.reload(); // Reload after successful approval
        } else {
          setError("Failed to send SMS: " + response.error);
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
    <div className="bg-white h-full p-4 rounded shadow overflow-x-auto">
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
                  <div className="dropdown dropdown-end">
                    <summary
                      tabIndex={0}
                      className="btn btn-primary rounded-sm text-white btn-sm"
                    >
                      Actions
                    </summary>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu flex gap-5 flex-row bg-base-100 z-[1] w-72 p-4 shadow-lg border rounded-sm"
                    >
                      <li>
                        <button
                          className="btn btn-primary rounded-sm text-white btn-sm"
                          onClick={() => handleView(appointment)}
                        >
                          View
                        </button>
                      </li>
                      <li>
                        <button
                          className={`btn-success btn text-white btn-sm rounded-sm ${
                            approving ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          onClick={() =>
                            handleApprove(appointment.id, appointment)
                          }
                          disabled={approving}
                        >
                          {approving ? "Approving..." : "Approve"}
                        </button>
                      </li>
                      <li>
                        <button
                          className="btn btn-error text-white btn-sm rounded-sm"
                          onClick={() => handleDecline(appointment.id)}
                        >
                          Decline
                        </button>
                      </li>
                      <li>
                        <Link
                          className="btn btn-secondary text-white btn-sm rounded-sm"
                          href={`/office/appointment/${appointment.id}/`}
                        >
                          Reschedule
                        </Link>
                      </li>
                    </ul>
                  </div>
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
