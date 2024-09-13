import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg, EventInput } from '@fullcalendar/core';

interface Appointment {
  id: string;
  start: string;
  end: string;
  title: string;
  status: 'available' | 'booked';
}

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onVacantDateClick: (date: string, jsEvent: MouseEvent) => void;
  onBookedAppointmentClick: (appointmentId: string) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ 
  appointments, 
  onVacantDateClick,
  onBookedAppointmentClick
}) => {
  const handleDateClick = (arg: DateClickArg) => {
    const clickedDate = arg.dateStr;
    const isBooked = appointments.some(apt => 
      apt.status === 'booked' && apt.start.startsWith(clickedDate)
    );

    if (!isBooked) {
      onVacantDateClick(clickedDate, arg.jsEvent);
    }
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (clickInfo.event.extendedProps.status === 'booked') {
      onBookedAppointmentClick(clickInfo.event.id);
    }
  };

  const events: EventInput[] = appointments.map(appointment => ({
    id: appointment.id,
    title: appointment.title,
    start: appointment.start,
    end: appointment.end,
    color: appointment.status === 'available' ? '#4CAF50' : '#F44336',
    textColor: 'white',
    extendedProps: {
      status: appointment.status
    }
  }));

  return (
    <div className="bg-blue-900 rounded-lg shadow-md p-4 h-[calc(100%-5rem)]">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="100%"
        allDaySlot={false}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
      />
    </div>
  );
};

export default AppointmentCalendar;