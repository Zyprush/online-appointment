import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import ViewAppointment from "@/components/ViewAppointment";
// import axios from 'axios'; // Import axios

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
};

const PendingAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentType | null>(null); // State for selected appointment
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State for modal visibility

  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search input

  useEffect(() => {
    const fetchPendingAppointments = async () => {
      try {
        const appointmentsRef = collection(db, "appointments");
        const q = query(appointmentsRef, where("status", "==", "pending")); // Query for pending appointments
        const snapshot = await getDocs(q);
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
        }));
        setAppointments(appointmentsList);
      } catch (err) {
        setError("Error fetching appointments: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingAppointments();
  }, []);

  const handleDecline = async (id: string) => {
    if (window.confirm("Are you sure you want to decline this appointment?")) {
      try {
        const appointmentRef = doc(db, "appointments", id);
        await updateDoc(appointmentRef, { status: "declined" }); // Update status to declined
        window.location.reload(); // Refresh page
      } catch (err) {
        setError("Error declining appointment: " + (err as Error).message);
      }
    }
  };

  const handleApprove = async (id: string, appointment: AppointmentType) => {
    if (window.confirm("Do you want to approve this appointment?")) {
      try {
        console.log('appointment.contact', appointment.contact)
        // Call the API to send SMS using axios
        // const response = await axios.post(
        //   /pages/api/send-sms, // Use relative path for API call
        //   {
        //     appointmentId: appointment.id,
        //     contact: appointment.contact,
        //     selectedDate: appointment.selectedDate,
        //     timeRange: appointment.timeRange,
        //     selectedOffice: appointment.selectedOffice,
        //     selectedPersonnel: appointment.selectedPersonnel,
        //   },
        //   {
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //   }
        // );

        const appointmentRef = doc(db, "appointments", id);

        // Update status to approved in Firestore
        await updateDoc(appointmentRef, { status: "approved" });

        // Update local state
        setAppointments(
          appointments.map((appt) =>
            appt.id === id ? { ...appt, status: "approved" } : appt
          )
        );

        // if (response.data.success) {
        //   console.log("SMS sent successfully!");
        // } else {
        //   console.error("Failed to send SMS:", response.data.error);
        // }
        window.location.reload(); // Refresh page
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

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter((appointment) =>
    appointment.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
        />
      </div>

      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Appointment Code</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Time</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((appointment) => (
            <tr key={appointment.id} className="border-b">
              <td className="px-4 py-2">{appointment.id}</td>
              <td className="px-4 py-2 capitalize">{appointment.name}</td>
              <td className="px-4 py-2">{appointment.appointmentType}</td>
              <td className="px-4 py-2">{appointment.selectedDate}</td>
              <td className="px-4 py-2">{appointment.timeRange}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded ${
                    appointment.status === "Completed"
                      ? "bg-green-200 text-green-800"
                      : appointment.status === "Cancelled"
                      ? "bg-red-200 text-red-800"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {appointment.status}
                </span>
              </td>
              <td className="px-4 py-2">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => handleView(appointment)}
                >
                  View
                </button>
                <button
                  className="text-green-500 hover:underline ml-2"
                  onClick={() => handleApprove(appointment.id, appointment)} // Pass the appointment object
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
          ))}
        </tbody>
      </table>

      {/* Modal for viewing appointment details */}
      {isModalOpen && selectedAppointment && (
        <ViewAppointment
          appointment={selectedAppointment}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default PendingAppointments;