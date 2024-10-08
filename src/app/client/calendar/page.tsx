"use client";
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { EventClickArg } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { useUserData } from "@/hooks/useUserData";
import NavLayout from "@/components/NavLayout";
import ViewAppointment from "@/components/ViewAppointment";

interface Appointment {
  id: string;
  title: string;
  start: string;
  end: string;
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
}

const ClientCalendar: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null); // State for selected appointment
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
          alert("No approved appointments found for this user.");
        } else {
          const fetchedAppointments: Appointment[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            const timeRangeParts = data.timeRange.split(" - ");
            const startTime = convertTo24HourFormat(timeRangeParts[0]);
            const endTime = convertTo24HourFormat(timeRangeParts[1]);

            return {
              id: doc.id,
              title: data.purpose || "Appointment",
              start: `${data.selectedDate}T${startTime}`,
              end: `${data.selectedDate}T${endTime}`,
              appointmentType: data.appointmentType,
              selectedDate: data.selectedDate,
              timeRange: data.timeRange,
              selectedService: data.selectedService,
              selectedPersonnel: data.selectedPersonnel,
              selectedOffice: data.selectedOffice,
              otherReason: data.otherReason,
              name: data.name,
              contact: data.contact,
              email: data.email,
              role: data.role,
              dateCreated: data.dateCreated,
            };
          });

          setAppointments(fetchedAppointments);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchApprovedAppointments();
  }, [uid]);

  // Helper function to convert 12-hour time format to 24-hour
  const convertTo24HourFormat = (time: string) => {
    const [timePart, modifier] = time.split(" ");
    // eslint-disable-next-line prefer-const
    let [hours, minutes] = timePart.split(":");

    if (hours === "12") {
      hours = "00";
    }
    if (modifier === "PM") {
      hours = (parseInt(hours, 10) + 12).toString();
    }

    return `${hours}:${minutes}`;
  };

  // Function to handle event click and open the modal
  const handleEventClick = (info: EventClickArg) => {
    const clickedAppointment = appointments.find(
      (appointment) => appointment.id === info.event.id
    );
    if (clickedAppointment) {
      setSelectedAppointment(clickedAppointment); // Set the selected appointment data
    }
  };

  // Close the modal
  const handleCloseModal = () => {
    setSelectedAppointment(null); // Close the modal by resetting the selected appointment
  };

  return (
    <NavLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 -z-20">My Approved Appointments</h2>
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
          eventClick={handleEventClick} // Handle event click
        />
      </div>

      {/* Modal */}
      {selectedAppointment && (
        <ViewAppointment
          appointment={selectedAppointment}
          onClose={handleCloseModal}
        />
      )}
    </NavLayout>
  );
};

export default ClientCalendar;
