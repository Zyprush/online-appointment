"use client";
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { useUserData } from "@/hooks/useUserData";
import NavLayout from "@/components/NavLayout";

interface Appointment {
  id: string;
  title: string;
  start: string;
  end: string;
}

const ClientCalendar: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { uid } = useUserData(); // Get the user data including submittedUid

  useEffect(() => {
    const fetchApprovedAppointments = async () => {
      if (!uid) {
        console.error("User UID not found!");
        return;
      }

      try {
        const appointmentsRef = collection(db, "appointments");
        const q = query(
          appointmentsRef,
          where("submittedUid", "==", uid),
          where("status", "==", "approved")
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("No approved appointments found for this user.");
        } else {
          const fetchedAppointments: Appointment[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            console.log("Fetched appointment data:", data); // Log each document

            // Ensure selectedDate and timeRange are in the expected format
            const { selectedDate, timeRange } = data;

            if (!selectedDate || !timeRange) {
              console.error("Invalid date or time range in document:", doc.id);
              return null;
            }

            const timeRangeParts = timeRange.split(" - ");
            if (timeRangeParts.length !== 2) {
              console.error("Invalid time range format:", timeRange);
              return null;
            }

            return {
              id: doc.id,
              title: data.purpose || "Appointment",
              start: `${selectedDate}T${timeRangeParts[0]}`, // Start time
              end: `${selectedDate}T${timeRangeParts[1]}`,   // End time
            };
          }).filter(Boolean) as Appointment[]; // Filter out invalid entries

          setAppointments(fetchedAppointments);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchApprovedAppointments();
  }, [uid]);

  // Debug the fetched appointments before rendering them in FullCalendar
  useEffect(() => {
    console.log("Appointments to be rendered:", appointments);
  }, [appointments]);

  return (
    <NavLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">My Approved Appointments</h2>
        <FullCalendar
          plugins={[timeGridPlugin]}
          initialView="timeGridWeek" // Week view format based on time
          events={appointments}
          allDaySlot={false} // Remove the "All-day" slot
          slotMinTime="07:00:00" // Customize calendar start time
          slotMaxTime="20:00:00" // Customize calendar end time
          height="auto"
          eventColor="#3182ce" // Customize event color
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridDay,timeGridWeek",
          }}
        />
      </div>
    </NavLayout>
  );
};

export default ClientCalendar;
