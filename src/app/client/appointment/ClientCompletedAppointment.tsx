import React, { useEffect, useState } from "react";
import { db } from "@/firebase"; // Import Firestore
import { collection, getDocs, query, where } from "firebase/firestore"; // Import query and where
import { useUserData } from "@/hooks/useUserData";
import ViewAppointment from "@/components/ViewAppointment";
import Link from "next/link";

interface Appointment {
  id: string;
  selectedDate: string;
  timeRange: string;
  appointmentType: string;
  status: string;
  otherReason: string;
  selectedService: string;
  selectedPersonnel: string;
  selectedOffice: string;
  name: string;
  contact: string;
  email: string;
  role: string;
  dateCreated: string;
  officeCode: string;
}

const ClientCompletedAppointment: React.FC = () => {
  const { userData } = useUserData(); // Get current user data
  const [appointments, setAppointments] = useState<Appointment[]>([]); // State to hold appointments
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null); // State for selected appointment

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true); // Set loading to true
      try {
        const appointmentsRef = collection(db, "appointments");
        const q = query(
          appointmentsRef,
          where("submittedUid", "==", userData?.uid),
          where("status", "==", "completed")
        );
        const snapshot = await getDocs(q);
        const appointmentList = snapshot.docs.map((doc) => ({
          id: doc.id,
          selectedDate: doc.data().selectedDate || "",
          timeRange: doc.data().timeRange || "",
          appointmentType: doc.data().appointmentType || "",
          status: doc.data().status || "",
          otherReason: doc.data().otherReason || "N/A",
          selectedService: doc.data().selectedService || "",
          selectedPersonnel: doc.data().selectedPersonnel || "",
          selectedOffice: doc.data().selectedOffice || "",
          name: doc.data().name || "",
          contact: doc.data().contact || "",
          email: doc.data().email || "",
          role: doc.data().role || "",
          dateCreated: doc.data().dateCreated || "",
          officeCode: doc.data().officeCode || "",
        }));
        setAppointments(appointmentList);
      } catch (error) {
        setError("Error fetching appointments: " + (error as Error).message);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    if (userData?.uid) {
      // Ensure user UID is available before fetching
      fetchAppointments();
    }
  }, [userData]);

  // Handler to open the modal
  const handleView = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  // Handler to close the modal
  const closeModal = () => {
    setSelectedAppointment(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading message
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  return (
    <div className="">
      <h2 className="text-xl font-bold mb-4">Appointment History</h2>

      {/* Appointments Table */}
      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr className="text-primary">
            <th className="px-4 py-2 text-left">Appointment Code</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Time</th>
            <th className="px-4 py-2 text-left">Printable Slip</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-2 text-center">
                No appointment history found.
              </td>
            </tr>
          ) : (
            appointments.map((appointment) => (
              <tr key={appointment.id} className="border-b">
                <td className="px-4 py-2 uppercase">
                  {`${appointment.officeCode}${appointment.id}` ||
                    appointment.id}
                </td>
                <td className="px-4 py-2">{appointment.selectedDate}</td>
                <td className="px-4 py-2">{appointment.timeRange}</td>
                <td className="px-4 py-2"><Link className="text-blue-500 font-semibold underline" href={`/slip/${appointment.id}`}>Link</Link></td>
                <td className="px-4 py-2">
                  <button
                    className="btn btn-xs rounded-sm btn-outline text-primary"
                    onClick={() => handleView(appointment)}
                  >
                    details
                  </button>
                </td>
              </tr>
            ))
          )}
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

export default ClientCompletedAppointment;

