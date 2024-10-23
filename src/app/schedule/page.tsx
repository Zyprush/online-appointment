"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import useOfficeList from "@/hooks/useOfficeList";
import Navbar from "@/components/topNavbar";

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
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const officeList = useOfficeList("offices", "offices");

  const fetchAppointments = async () => {
    if (!selectedOffice) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    try {
      const appointmentsRef = query(
        collection(db, "appointments"),
        where("status", "==", "approved"),
        where("selectedOffice", "==", selectedOffice)
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

  useEffect(() => {
    fetchAppointments();
  }, [selectedOffice]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        Loading appointments...
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const parseTime = (timeString: string) => {
    const [time, modifier] = timeString.split(/(am|pm)/);
    let [hours] = time.split(":");
    if (modifier.toLowerCase() === "pm" && hours !== "12") {
      hours = (parseInt(hours) + 12).toString();
    }
    if (modifier.toLowerCase() === "am" && hours === "12") {
      hours = "0";
    }
    return parseInt(hours);
  };

  const calendarEvents = appointments.map((appointment) => {
    const [startTime, endTime] = appointment.timeRange
      .split("-")
      .map((time) => time.trim());

    const startDate = new Date(appointment.selectedDate);
    const endDate = new Date(appointment.selectedDate);

    startDate.setHours(parseTime(startTime));
    endDate.setHours(parseTime(endTime));

    return {
      id: appointment.id,
      title: `${appointment.selectedService || "Visit"} - ${appointment.name}`,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      extendedProps: {
        appointmentType: appointment.appointmentType,
        contact: appointment.contact,
        email: appointment.email,
        role: appointment.role,
      },
    };
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow p-6">
        <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
          <select
            className="mb-6 w-full md:w-80 px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={selectedOffice}
            onChange={(e) => setSelectedOffice(e.target.value)}
            required
          >
            <option value="">Select an office</option>
            {officeList.map((office) => (
              <option key={office.name} value={office.name}>
                {office.name}
              </option>
            ))}
          </select>

          <div className="calendar-container">
          <style jsx global>{`
              .fc {
                height: calc(100vh - 200px) !important;
              }

              .fc-timegrid-slot {
                height: 55px !important;
                border: 1px solid #e2e8f0 !important;
              }

              .fc-timegrid-slot-lane {
                border: 1px solid #e2e8f0 !important;
                background-color: #ffffff;
              }

              .fc-timegrid-col {
                border: 2px solid #e2e8f0 !important;
              }

              .fc-timegrid-col-frame {
                background-color: #ffffff;
              }

              .fc-timegrid-event-harness {
                margin-right: auto !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: start !important;
              }

              .fc-event {
                border: 1px solid #244e8a !important;
                background-color: #244e8a !important;
                width: 55px !important;
                height: 55px !important;
                color: #2b6cb0 !important;
                padding: 2px 4px !important;
              }

              .fc-event-main {
                padding: 0 !important;
              }

              .fc-event-title {
                padding: 0 !important;
              }

              .fc-event:hover {
                background-color: #1a365d !important;
              }

              .fc-timegrid-axis {
                border: 1px solid #e2e8f0 !important;
                background-color: #f7fafc !important;
              }

              .fc-col-header-cell {
                background-color: #f7fafc !important;
                border: 1px solid #e2e8f0 !important;
                padding: 8px !important;
              }

              .fc-toolbar-title {
                font-size: 1.25rem !important;
                font-weight: 600 !important;
              }

              .fc-button {
                background-color: #4299e1 !important;
                border-color: #4299e1 !important;
                text-transform: capitalize !important;
                padding: 0.5rem 1rem !important;
              }

              .fc-button:hover {
                background-color: #3182ce !important;
                border-color: #3182ce !important;
              }

              .fc-button-active {
                background-color: #2b6cb0 !important;
                border-color: #2b6cb0 !important;
              }

              .fc .fc-toolbar {
                flex-wrap: wrap;
                gap: 1rem;
              }

              @media (max-width: 640px) {
                .fc .fc-toolbar {
                  flex-direction: column;
                  align-items: stretch;
                }
              }
            `}</style>

            <FullCalendar
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              events={calendarEvents}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "timeGridWeek,timeGridDay",
              }}
              slotMinTime="08:00:00"
              slotMaxTime="17:00:00"
              allDaySlot={false}
              slotDuration="01:00:00"
              weekends={false}
              slotLabelFormat={{
                hour: "numeric",
                minute: "2-digit",
                meridiem: "short",
              }}
              eventContent={() => (
                <div className="text-xs text-primary">
                  {/* <div className="font-semibold truncate">
                    {eventInfo.event.title}
                  </div>
                  <div className="text-xs">{eventInfo.timeText}</div> */}
                </div>
              )}
              // eventDidMount={(info) => {
              //   // Add tooltip with more information
              //   info.el.title = `
              //     ${info.event.title}
              //     Type: ${info.event.extendedProps.appointmentType}
              //     Contact: ${info.event.extendedProps.contact}
              //     Email: ${info.event.extendedProps.email}
              //     Role: ${info.event.extendedProps.role}
              //   `;
              // }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeCalendarAppointment;
