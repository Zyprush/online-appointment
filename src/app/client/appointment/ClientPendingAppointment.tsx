import React, { useEffect, useState } from "react";
import { db } from "@/firebase"; // Import Firestore
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore"; // Import deleteDoc
import { useUserData } from "@/hooks/useUserData";
import ViewAppointment from "@/components/ViewAppointment";

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

const ClientPendingAppointment: React.FC = () => {
  const { userData } = useUserData(); // Get current user data
  const [appointments, setAppointments] = useState<Appointment[]>([]); // State to hold appointments
  const [loading, setLoading] = useState(true); // Loading state
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Deleting state to track which appointment is being deleted
  const [error, setError] = useState<string | null>(null); // Error state
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null); // State for selected appointment in modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility
  const [filterDate, setFilterDate] = useState(""); // State for filtering by date

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true); // Set loading to true
      try {
        const appointmentsRef = collection(db, "appointments");
        const q = query(
          appointmentsRef,
          where("submittedUid", "==", userData?.uid),
          where("status", "==", "pending") // Only fetch pending appointments
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
          officeCode: doc.data().officeCode || ""
        }));

        // Filter appointments by date if filterDate is set
        const filteredAppointments = filterDate
          ? appointmentList.filter((appointment) =>
              appointment.selectedDate.includes(filterDate)
            )
          : appointmentList;

        setAppointments(filteredAppointments as Appointment[]);
      } catch (error) {
        setError("Error fetching appointments: " + (error as Error).message);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    if (userData?.uid) { // Ensure user UID is available before fetching
      fetchAppointments();
    }
  }, [userData, filterDate]); // Also re-run the effect when the filterDate changes

  // Handler to delete an appointment
  const handleDelete = async (appointmentId: string) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      setIsDeleting(appointmentId); // Set the appointment ID being deleted
      try {
        const appointmentDocRef = doc(db, "appointments", appointmentId);
        await deleteDoc(appointmentDocRef); // Delete the appointment from Firestore
        // Update the state by filtering out the deleted appointment
        setAppointments((prevAppointments) =>
          prevAppointments.filter((appointment) => appointment.id !== appointmentId)
        );
      } catch (error) {
        alert("Error deleting appointment: " + (error as Error).message);
      } finally {
        setIsDeleting(null); // Reset the deleting state
      }
    }
  };

  // Handler to open the ViewAppointment modal
  const handleView = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true); // Open modal
  };

  // Handler to close the ViewAppointment modal
  const closeModal = () => {
    setIsModalOpen(false); // Close modal
    setSelectedAppointment(null); // Reset selected appointment
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading message
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Pending Appointments</h2>

      {/* Date Filter */}
      <div className="mb-4">
        <label className="block mb-1 font-bold text-sm">Filter by Date:</label>
        <input
          type="date"
          className="border border-gray-300 px-4 py-2 rounded"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)} // Update filter date state
        />
      </div>

      {/* Appointments Table */}
      <table className="min-w-full bg-white text-sm">
        <thead>
          <tr className="border-b text-primary">
            <th className="px-4 py-2 text-left">Appointment Code</th>
            <th className="px-4 py-2 text-left">Purpose</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Time</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-2 text-center">No pending appointments found.</td>
            </tr>
          ) : (
            appointments.map((appointment) => (
              <tr key={appointment.id} className="border-b">
                <td className="px-4 py-2">{`${appointment.officeCode}${appointment.id}`}</td>
                <td className="px-4 py-2">{appointment.appointmentType}</td>
                <td className="px-4 py-2">{appointment.selectedDate}</td>
                <td className="px-4 py-2">{appointment.timeRange}</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 rounded bg-yellow-200 text-zinc-800">
                    {appointment.status}
                  </span>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="btn btn-xs rounded-sm btn-primary text-white"
                    onClick={() => handleView(appointment)}
                  >
                    View
                  </button>
                  
                  <button
                    className={`text-red-500 hover:underline ${isDeleting === appointment.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handleDelete(appointment.id)}
                    disabled={isDeleting === appointment.id}
                  >
                    {isDeleting === appointment.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal for viewing appointment details */}
      {isModalOpen && selectedAppointment && (
        <ViewAppointment appointment={selectedAppointment} onClose={closeModal} />
      )}
    </div>
  );
};

export default ClientPendingAppointment;
