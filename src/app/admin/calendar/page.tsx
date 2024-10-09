"use client";
import React, { useState, useEffect } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { db } from "@/firebase"; // Firestore reference
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import NavLayout from "@/components/NavLayout";
import { EventClickArg, EventInput } from "@fullcalendar/core/index.js";
import FullCalendar from "@fullcalendar/react";
import { format } from "date-fns";

const AdminCalendar = () => {
  const [events, setEvents] = useState<EventInput[]>([]); // Holds holiday events
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [currentHoliday, setCurrentHoliday] = useState<{
    id: string;
    title: string;
    start: string;
  } | null>(null); // Holds the clicked holiday info

  useEffect(() => {
    // Fetch existing holidays from Firestore when the component loads
    const fetchHolidays = async () => {
      const holidaysRef = collection(db, "holidays");
      const snapshot = await getDocs(holidaysRef);
      const fetchedEvents = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().name,
        start: doc.data().date,
      }));
      setEvents(fetchedEvents);
    };

    fetchHolidays();
  }, []);

  // Handle date selection and prompt for holiday name
  const handleDateClick = (arg: DateClickArg) => {
    const holidayName = prompt("Enter holiday name:");
    if (holidayName) {
      saveHoliday(holidayName, arg.dateStr);
    }
  };

  // Handle clicking on an event (open modal to show holiday details)
  const handleEventClick = (clickInfo: EventClickArg) => {
    setCurrentHoliday({
      id: clickInfo.event.id || "",
      title: clickInfo.event.title || "",
      start: clickInfo.event.startStr || "",
    });
    setIsModalOpen(true); // Open the modal
  };

  // Function to save the holiday to Firestore
  const saveHoliday = async (holidayName: string, date: string) => {
    try {
      const holidaysRef = collection(db, "holidays");
      const newHolidayRef = await addDoc(holidaysRef, {
        name: holidayName,
        date,
      });

      setEvents((prevEvents) => [
        ...prevEvents,
        { id: newHolidayRef.id, title: holidayName, start: date },
      ]);

      alert("Holiday saved successfully!");
    } catch (error) {
      alert("Failed to save the holiday.");
    }
  };

  // Function to delete the holiday from Firestore
  const deleteHoliday = async (id: string) => {
    try {
      await deleteDoc(doc(db, "holidays", id));

      // Remove the event from the calendar
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
      setIsModalOpen(false); // Close the modal
      alert("Holiday deleted successfully!");
    } catch (error) {
      alert("Failed to delete the holiday.");
    }
  };

  // Confirm delete action
  const handleDelete = () => {
    const confirmDelete = confirm(
      `Are you sure you want to delete the holiday: ${currentHoliday?.title}?`
    );
    if (confirmDelete && currentHoliday?.id) {
      deleteHoliday(currentHoliday.id);
    }
  };

  return (
    <NavLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Admin Calendar</h1>

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]} // Use interaction plugin for date click
          initialView="dayGridMonth"
          events={events} // Display saved holidays
          dateClick={handleDateClick} // Handle date click
          eventClick={handleEventClick} // Open modal on event click
        />

        {/* Modal for viewing holiday details */}
        {isModalOpen && currentHoliday && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <h2 className="text-xl font-bold mb-4">Holiday Details</h2>
              <p className="mb-4">
                <strong>Date:</strong> {format(new Date(currentHoliday.start), "MMM dd, yyyy")}
              </p>
              <p className="mb-4">
                <strong>Name:</strong> {currentHoliday.title}
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={handleDelete}
                >
                  Delete Holiday
                </button>
                <button
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </NavLayout>
  );
};

export default AdminCalendar;
