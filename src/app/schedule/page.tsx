"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import NavLayout from "@/components/NavLayout";

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
  approvedCount: number; // Added to track the approved count
};

const OfficeCalendarAppointment = () => {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch appointments and calculate approved counts
  const fetchAppointments = async () => {
    try {
      const appointmentsRef = query(
        collection(db, "appointments"),
        where("status", "==", "approved")
      );
      const snapshot = await getDocs(appointmentsRef);
      const appointmentsList = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          const approvedCount = await checkExistingAppointments(
            data.selectedDate,
            data.timeRange
          );
          return {
            id: doc.id,
            appointmentType: data.appointmentType || "",
            selectedDate: data.selectedDate || "",
            timeRange: data.timeRange || "",
            selectedService: data.selectedService || "",
            selectedPersonnel: data.selectedPersonnel || "",
            selectedOffice: data.selectedOffice || "",
            otherReason: data.otherReason || "",
            name: data.name || "",
            contact: data.contact || "",
            email: data.email || "",
            role: data.role || "",
            dateCreated: data.dateCreated || "",
            status: data.status || "",
            officeCode: data.officeCode || "",
            approvedCount: approvedCount, // Track approved appointment count
          };
        })
      );
      setAppointments(appointmentsList);
    } catch (err) {
      setError("Error fetching appointments: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Helper to convert time string to 24-hour format
  const parseTime = (timeString: string) => {
    const [time, modifier] = timeString.split(/(am|pm)/);
    let [hours] = time.split(":");
    if (modifier === "pm" && hours !== "12") {
      hours = (parseInt(hours) + 12).toString();
    }
    if (modifier === "am" && hours === "12") {
      hours = "0";
    }
    return parseInt(hours);
  };

  // Logic for assigning background color based on approved count
  const calendarEvents = appointments.map((appointment) => {
    const [startTime, endTime] = appointment.timeRange
      .split("-")
      .map((time) => time.trim());

    const startDate = new Date(appointment.selectedDate);
    const endDate = new Date(appointment.selectedDate);

    startDate.setHours(parseTime(startTime));
    endDate.setHours(parseTime(endTime));

    // Determine event color based on approved appointment count
    const eventColor =
      appointment.approvedCount >= 4 ? "red" : "lightgreen";

    return {
      id: appointment.id,
      title: `${appointment.selectedService} - ${appointment.selectedOffice}`,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      backgroundColor: eventColor, // Dynamic background color
      borderColor: eventColor,
      display: "none", // Hide the events
    };
  });

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <NavLayout>
      <div className="bg-white p-10 h-auto rounded shadow overflow-x-auto">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents} // Use events even though hidden
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
        />
      </div>
    </NavLayout>
  );
};

export default OfficeCalendarAppointment;

// Helper function to get the approved appointment count
const checkExistingAppointments = async (
  selectedDate: string,
  timeRange: string
): Promise<number> => {
  try {
    const appointmentsRef = query(
      collection(db, "appointments"),
      where("selectedDate", "==", selectedDate),
      where("timeRange", "==", timeRange),
      where("status", "==", "approved")
    );
    const snapshot = await getDocs(appointmentsRef);
    return snapshot.size;
  } catch (err) {
    console.error("Error checking existing appointments:", err);
    throw err;
  }
};
