"use client";
import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { DateSelectArg } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import NavLayout from "@/components/NavLayout";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";

const AdminCalendar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [holidayName, setHolidayName] = useState("");

  // Function to handle date click and open the modal
  const handleDateClick = (arg: DateClickArg) => {
    setSelectedDate(arg.start); // Changed from arg.date to arg.start
    setIsModalOpen(true);
  };

  // Function to save holiday to Firestore
  const saveHoliday = async () => {
    if (selectedDate && holidayName) {
      try {
        await addDoc(collection(db, "holidays"), {
          date: selectedDate,
          name: holidayName,
        });
        console.log("Holiday saved successfully");
        setIsModalOpen(false);
        setHolidayName("");
      } catch (error) {
        console.error("Error saving holiday: ", error);
      }
    }
  };

  return (
    <NavLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 -z-20">Admin Calendar</h2>
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          allDaySlot={false}
          slotMinTime="07:00:00"
          slotMaxTime="20:00:00"
          height="auto"
          eventColor="#3182ce"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridDay,timeGridWeek",
          }}
          dateClick={handleDateClick}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Add Holiday</h3>
            <p>Date: {selectedDate?.toDateString()}</p>
            <input
              type="text"
              value={holidayName}
              onChange={(e) => setHolidayName(e.target.value)}
              placeholder="Holiday Name"
              className="border p-2 mt-2 w-full"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mr-2 px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveHoliday}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </NavLayout>
  );
};

export default AdminCalendar;