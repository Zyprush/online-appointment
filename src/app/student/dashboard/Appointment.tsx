import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import ViewAppointment from './ViewAppointment'; // Import the modal component
import {useUserData} from "@/hooks/useUserData"; // Import useUserData

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

const Appointment = () => {
  const { userData } = useUserData(); // Get current user data
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentType | null>(null); // State for selected appointment
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State for modal visibility

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsRef = query(collection(db, 'appointments'), where("submittedUid", "==", userData?.uid), where("status", "==", "pending")); // Filter by submittedUid and status
        const snapshot = await getDocs(appointmentsRef);
        const appointmentsList = snapshot.docs.map(doc => ({
          id: doc.id,
          appointmentType: doc.data().appointmentType || '',
          selectedDate: doc.data().selectedDate || '',
          timeRange: doc.data().timeRange || '',
          selectedService: doc.data().selectedService || '',
          selectedPersonnel: doc.data().selectedPersonnel || '',
          selectedOffice: doc.data().selectedOffice || '',
          otherReason: doc.data().otherReason || '',
          name: doc.data().name || '',
          contact: doc.data().contact || '',
          email: doc.data().email || '',
          role: doc.data().role || '',
          dateCreated: doc.data().dateCreated || '',
          status: doc.data().status || '',
        }));
        setAppointments(appointmentsList);
      } catch (err) {
        setError('Error fetching appointments: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (userData?.uid) { // Ensure user UID is available before fetching
      fetchAppointments();
    }
  }, [userData]); // Dependency on userData

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await deleteDoc(doc(db, 'appointments', id));
        setAppointments(appointments.filter(appointment => appointment.id !== id));
      } catch (err) {
        setError('Error deleting appointment: ' + (err as Error).message);
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

  return (
    <div className="bg-white p-4 rounded shadow overflow-x-auto">
      <h3 className="font-bold text-lg mb-4">Your Appointments</h3>
      <input
        type="text"
        placeholder="Search"
        className="border rounded px-2 py-1 mb-4 w-full"
      />
      <table className="table-auto w-full text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Appointment Code</th>
            <th className="px-4 py-2">Appointment Type</th>
            <th className="px-4 py-2">Schedule</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="border px-4 py-2">{appointment.id}</td>
                <td className="border px-4 py-2">{appointment.appointmentType}</td>
                <td className="border px-4 py-2">{`${appointment.selectedDate} ${appointment.timeRange}`}</td>
                <td className="border px-4 py-2">Pending</td>
                <td className="border px-4 py-2">
                  <button className="text-blue-500 hover:underline" onClick={() => handleView(appointment)}>View</button>
                  <button
                    className="text-red-500 hover:underline ml-2"
                    onClick={() => handleDelete(appointment.id)}
                  >
                    Delete
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

      {/* Modal for viewing appointment details */}
      {isModalOpen && selectedAppointment && (
        <ViewAppointment appointment={selectedAppointment} onClose={closeModal} />
      )}
    </div>
  );
};

export default Appointment;