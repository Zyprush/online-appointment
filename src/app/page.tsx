"use client";
import { useState } from 'react';
import AppointmentCalendar from '@/components/Calendar';
import Navbar from '@/components/topNavbar';
import BookingModal from '@/components/Booking';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample data for appointments
  const [appointments, setAppointments] = useState([
    { id: '1', start: '2024-09-15T10:00:00', end: '2024-09-15T11:00:00', title: 'Available', status: 'available' as const },
    { id: '2', start: '2024-09-15T14:00:00', end: '2024-09-15T15:00:00', title: 'Booked', status: 'booked' as const },
    { id: '3', start: '2024-09-16T11:00:00', end: '2024-09-16T12:00:00', title: 'Available', status: 'available' as const },
    { id: '4', start: '2024-09-17T13:00:00', end: '2024-09-17T14:00:00', title: 'Booked', status: 'booked' as const },
    { id: '5', start: '2024-09-13T15:00:00', end: '2024-09-13T16:00:00', title: 'Booked', status: 'booked' as const },
  ]);

  const handleVacantDateClick = (date: string) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleBookedAppointmentClick = (appointmentId: string) => {
    setSelectedAppointment(appointmentId);
    // You can add more logic here, like showing appointment details
    console.log('Booked appointment clicked:', appointmentId);
  };

  const handleBookAppointment = (data: { date: string; time: string; natureOfRequest: string; fullName: string }) => {
    // Here you would typically send this data to your backend/Firebase
    console.log('Booking appointment:', data);

    // For now, let's just add it to our local state
    const newAppointment = {
      id: String(appointments.length + 1),
      start: `${data.date}T${data.time}:00`,
      end: `${data.date}T${data.time.split(':')[0]}:59:59`,
      title: `${data.natureOfRequest} - ${data.fullName}`,
      status: 'booked' as const
    };

    setAppointments([...appointments, newAppointment]);
  };

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">
          Appointment Calendar
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">Appointment Information</h2>
            {selectedAppointment && (
              <p className="mb-4 text-white">
                Selected appointment: {appointments.find(a => a.id === selectedAppointment)?.title}
              </p>
            )}
            {!selectedAppointment && (
              <p className="text-white">Click on an appointment to view details</p>
            )}
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">Calendar Guide</h2>
            <ul className="list-disc list-inside space-y-2 text-white">
              <li>Green slots are available for booking</li>
              <li>Red slots are already booked</li>
              <li>Click on a vacant date to book an appointment</li>
              <li>Click on a booked appointment to view details</li>
            </ul>
          </div>
          <div className="h-[600px]">
            <AppointmentCalendar
              appointments={appointments}
              onVacantDateClick={handleVacantDateClick}
              onBookedAppointmentClick={handleBookedAppointmentClick}
            />
          </div>
        </div>
      </main>
      {selectedDate && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onBook={handleBookAppointment}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
}