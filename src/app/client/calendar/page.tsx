"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import ViewAppointment from "@/components/ViewAppointment";
import { db } from "@/firebase";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import NavLayout from "@/components/NavLayout";
import { useUserData } from "@/hooks/useUserData";

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
  officeCode: string;
};

const OfficeCalendarAppointment = () => {
  const {uid } = useUserData()
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Extracted fetchAppointments function
  const fetchAppointments = async () => {


    try {
      const appointmentsRef = query(
        collection(db, "appointments"),
        where("submittedUid", "==", uid),
        where("status", "in", ["approved", "completed"])
      );
      const snapshot = await getDocs(appointmentsRef);
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
        officeCode: doc.data().officeCode || "",
      }));
      setAppointments(appointmentsList);
    } catch (err) {
      setError("Error fetching appointments: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch appointments when the component mounts
  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const handleEventClick = (eventId: string) => {
    const appointment = appointments.find((appt) => appt.id === eventId);
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsModalOpen(true);
    }
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

  if (!uid) {
    return <div>No Appointment data available. Please log in.</div>;
  }

  // Prepare calendar events

  // Helper function to parse time strings into hours
  const parseTime = (timeString: string) => {
    // Changed type from any to string
    const [time, modifier] = timeString.split(/(am|pm)/);
    let [hours] = time.split(":");
    if (modifier === "pm" && hours !== "12") {
      hours = (parseInt(hours) + 12).toString();
    }
    if (modifier === "am" && hours === "12") {
      hours = "0"; // Ensure hours is a string
    }
    return parseInt(hours); // Return hours in 24-hour format
  };
  const calendarEvents = appointments.map((appointment) => {
    // Split the timeRange value into start and end times
    const [startTime, endTime] = appointment.timeRange
      .split("-")
      .map((time) => time.trim());

    // Create a start and end date string in ISO format for FullCalendar
    const startDate = new Date(appointment.selectedDate);
    const endDate = new Date(appointment.selectedDate);

    // Parse the start and end times into the correct format
    startDate.setHours(parseTime(startTime));
    endDate.setHours(parseTime(endTime));

    return {
      id: appointment.id,
      title: `${appointment.selectedService} - ${appointment.selectedOffice}`,
      start: startDate.toISOString(), // FullCalendar requires ISO string
      end: endDate.toISOString(), // FullCalendar requires ISO string
    };
  });

  return (
    <NavLayout>
      <div className="bg-white p-10 h-auto rounded shadow overflow-x-auto">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          eventClick={(info) => handleEventClick(info.event.id)} // Handle event click without interactionPlugin
        />

        {isModalOpen && selectedAppointment && (
          <ViewAppointment
            appointment={selectedAppointment}
            onClose={closeModal}
          />
        )}
      </div>
    </NavLayout>
  );
};

export default OfficeCalendarAppointment;
