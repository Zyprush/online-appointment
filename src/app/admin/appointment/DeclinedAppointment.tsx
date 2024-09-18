import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import ViewAppointment from "@/app/student/dashboard/ViewAppointment"; // Import the ViewAppointment modal

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

const DeclinedAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentType | null>(null); // State for selected appointment
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State for modal visibility

  useEffect(() => {
    const fetchDeclinedAppointments = async () => {
      try {
        const appointmentsRef = collection(db, "appointments");
        const q = query(appointmentsRef, where("status", "==", "declined")); // Query for declined appointments
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

    fetchDeclinedAppointments();
  }, []);

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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Appointment Code</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Time</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th> {/* New Actions Column */}
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id} className="border-b">
              <td className="px-4 py-2">{appointment.id}</td>
              <td className="px-4 py-2">{appointment.appointmentType}</td>
              <td className="px-4 py-2">{appointment.selectedDate}</td>
              <td className="px-4 py-2">{appointment.timeRange}</td>
              <td className="px-4 py-2">
                <span className="px-2 py-1 rounded bg-red-200 text-red-800">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for viewing appointment details */}
      {isModalOpen && selectedAppointment && (
        <ViewAppointment appointment={selectedAppointment} onClose={closeModal} />
      )}
    </div>
  );
};

export default DeclinedAppointments;