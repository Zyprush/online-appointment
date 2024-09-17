import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

interface Appointment {
  id: string;
  date: string;
  time: string;
  type: string;
  status: string;
  details: string;
}

const AppointmentHistory: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsRef = collection(db, 'appointments');
        const snapshot = await getDocs(appointmentsRef);
        const appointmentsList = snapshot.docs.map(doc => ({
          id: doc.id,
          date: doc.data().selectedDate || '',
          time: doc.data().timeRange || '',
          type: doc.data().appointmentType || '',
          status: 'Pending', // You can modify this based on your logic
          details: doc.data().otherReason || 'N/A', // Example for details
        }));
        setAppointments(appointmentsList);
      } catch (err) {
        setError('Error fetching appointments: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Appointment History</h2>
      {appointments.length === 0 ? (
        <p>No past appointments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-b">
                  <td className="px-4 py-2">{appointment.date}</td>
                  <td className="px-4 py-2">{appointment.time}</td>
                  <td className="px-4 py-2">{appointment.type}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded ${
                      appointment.status === 'Completed' ? 'bg-green-200 text-green-800' : 
                      appointment.status === 'Cancelled' ? 'bg-red-200 text-red-800' : 
                      'bg-yellow-200 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{appointment.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentHistory;