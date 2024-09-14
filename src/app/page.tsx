"use client";
import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import AppointmentCalendar from '@/components/Calendar';
import Navbar from '@/components/topNavbar';
import BookingModal from '@/components/Booking';

interface Appointment {
  id: string;
  start: string;
  end: string;
  title: string;
  status: 'available' | 'booked';
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const appointmentsCol = collection(db, 'appointments');
    const appointmentSnapshot = await getDocs(appointmentsCol);
    const appointmentList = appointmentSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Appointment[];
    setAppointments(appointmentList);
  };

  const handleVacantDateClick = (date: string) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleBookedAppointmentClick = (appointmentId: string) => {
    setSelectedAppointment(appointmentId);
    console.log('Booked appointment clicked:', appointmentId);
  };

  const handleBookAppointment = async (data: { date: string; time: string; natureOfRequest: string; fullName: string }) => {
    try {
      const newAppointment = {
        start: `${data.date}T${data.time}:00`,
        end: `${data.date}T${data.time.split(':')[0]}:59:59`,
        title: `${data.natureOfRequest} - ${data.fullName}`,
        status: 'booked' as const
      };
      const docRef = await addDoc(collection(db, 'appointments'), newAppointment);
      setAppointments([...appointments, { ...newAppointment, id: docRef.id }]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
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