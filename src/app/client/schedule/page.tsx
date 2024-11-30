"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import useOfficeList from "@/hooks/useOfficeList";
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
      console.log("appointmentsList", appointmentsList);
    } catch (err) {
      setError("Error fetching appointments: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <NavLayout>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow p-6">
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <p></p>Check Office Availability
            <div className="flex flex-col md:flex-row gap-5 items-center mb-6">
              <select
                className="w-full md:w-80 px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-bold"
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
              <span className="flex gap-1 justify-center items-center ">
                <div className="bg-primary h-7 w-7 rounded-sm"></div>
                <div className="bg-primary h-7 w-7 rounded-sm"></div>
                <div className="bg-primary h-7 w-7 rounded-sm"></div>
                <div className="bg-primary h-7 w-7 rounded-sm"></div>
                <span className="text-gray-500">
                  Four Box indicate the schdule is full for this timeslot
                </span>
              </span>
            </div>

            <div className="calendar-contain">
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
        <style jsx>{``}</style>
      </div>
    </NavLayout>
  );
};

export default OfficeCalendarAppointment;
