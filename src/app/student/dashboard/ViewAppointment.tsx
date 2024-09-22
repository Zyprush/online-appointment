import React from 'react';

interface AppointmentProps {
  appointment: {
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
  };
  onClose: () => void; // Function to close the modal
}

const ViewAppointment: React.FC<AppointmentProps> = ({ appointment, onClose }) => {
  console.log('appointment', appointment)
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"  style={{ zIndex: 1000 }}>
      <div className="bg-white p-6 rounded shadow-lg z-50">
        <h2 className="text-2xl font-bold mb-4">Appointment Details</h2>
        <p><strong>Appointment Code:</strong> {appointment.id}</p>
        <p><strong>Type:</strong> {appointment.appointmentType}</p>
        <p><strong>Date:</strong> {appointment.selectedDate}</p>
        <p><strong>Time:</strong> {appointment.timeRange}</p>
        <p><strong>Service:</strong> {appointment.selectedService}</p>
        {appointment.selectedPersonnel && (
          <p><strong>Personnel:</strong> {appointment.selectedPersonnel}</p>
        )}
        <p><strong>Office:</strong> {appointment.selectedOffice}</p>
        <p><strong>Name:</strong> {appointment.name}</p>
        <p><strong>Contact:</strong> {appointment.contact}</p>
        <p><strong>Email:</strong> {appointment.email}</p>
        <p><strong>Role:</strong> {appointment.role}</p>
        <p><strong>Date Created:</strong> {appointment.dateCreated}</p>
        <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewAppointment;