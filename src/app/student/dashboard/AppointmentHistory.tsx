import React from 'react';

interface Appointment {
  id: string;
  date: string;
  time: string;
  type: string;
  status: string;
  details: string;
}

const AppointmentHistory: React.FC = () => {
  // Dummy data for appointments
  const appointments: Appointment[] = [
    {
      id: '1',
      date: '2023-06-01',
      time: '10:00 AM',
      type: 'Pay Fees',
      status: 'Completed',
      details: 'Tuition fee payment'
    },
    {
      id: '2',
      date: '2023-06-15',
      time: '2:00 PM',
      type: 'Submit Requirements',
      status: 'Cancelled',
      details: 'Submission of medical certificate'
    },
    {
      id: '3',
      date: '2023-07-01',
      time: '11:30 AM',
      type: 'Meet with Dean',
      status: 'Completed',
      details: 'Discussion about academic performance'
    },
    {
      id: '4',
      date: '2023-07-10',
      time: '3:00 PM',
      type: 'Claim Documents',
      status: 'Completed',
      details: 'Claiming of transcript of records'
    },
  ];

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