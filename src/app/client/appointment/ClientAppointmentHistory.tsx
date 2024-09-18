import React, { useEffect, useState } from "react";
import { db } from "@/firebase"; // Import Firestore
import { collection, getDocs, query, where } from "firebase/firestore"; // Import query and where
import { useUserData } from "@/hooks/useUserData";

interface Appointment {
  id: string;
  selectedDate: string;
  timeRange: string;
  appointmentType: string;
  status: string;
  otherReason: string; // Assuming this is used for additional details
}

const ClientAppointmentHistory: React.FC = () => {
  const { userData } = useUserData(); // Get current user data
  const [appointments, setAppointments] = useState<Appointment[]>([]); // State to hold appointments
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsRef = collection(db, "appointments");
        const q = query(appointmentsRef, where("submittedUid", "==", userData?.uid)); // Query to filter by submittedUid
        const snapshot = await getDocs(q);
        const appointmentList = snapshot.docs.map(doc => ({
          id: doc.id,
          selectedDate: doc.data().selectedDate || '',
          timeRange: doc.data().timeRange || '',
          appointmentType: doc.data().appointmentType || '',
          status: doc.data().status || '',
          otherReason: doc.data().otherReason || 'N/A', // Example for details
        }));
        setAppointments(appointmentList);
      } catch (error) {
        setError("Error fetching appointments: " + (error as Error).message);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    if (userData?.uid) { // Ensure user UID is available before fetching
      fetchAppointments();
    }
  }, [userData]); // Dependency on user

  if (loading) {
    return <div>Loading...</div>; // Display loading message
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Appointment History</h2>
      {appointments.length === 0 ? (
        <p>No appointment history found.</p> // Message when no appointments are found
      ) : (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment.id} className="mb-2">
              <div>
                <strong>Date:</strong> {appointment.selectedDate} <strong>Time:</strong> {appointment.timeRange} <strong>Status:</strong> {appointment.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientAppointmentHistory;