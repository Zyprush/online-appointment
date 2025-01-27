"use client";
import NavLayout from "@/components/NavLayout";
import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useOffice } from "@/hooks/useOffice";
import Link from "next/link";

interface InfoProps {
  params: {
    id: string;
  };
}

interface AppointmentData {
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
  declineReason?: string;
}

const ReschedAppointment: React.FC<InfoProps> = ({ params }) => {
  const { id } = params;
  const [appointmentData, setAppointmentData] =
    useState<AppointmentData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [timeRange, setTimeRange] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false); // New state for edit mode
  const officeData = useOffice();

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const docRef = doc(db, "appointments", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as AppointmentData;
          setAppointmentData(data);
          setSelectedDate(data.selectedDate);
          setTimeRange(data.timeRange);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    if (id) {
      fetchAppointment();
    }
  }, [id]);

  const checkExistingAppointments = async (
    selectedDate: string,
    timeRange: string
  ): Promise<number> => {
    try {
      if (!officeData) return 0;
      const appointmentsRef = query(
        collection(db, "appointments"),
        where("selectedOffice", "==", officeData.office),
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

  const handleSave = async () => {
    if (!appointmentData) return;
    setIsSaving(true);

    const appointmentCount = await checkExistingAppointments(
      selectedDate,
      timeRange
    );

    if (appointmentCount >= 4) {
      alert("There are already 4 (four) appointments for that time range.");
      setIsSaving(false);
      return;
    }
    // Validate the selected date
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const selectedDateObj = new Date(selectedDate);

    if (selectedDateObj < tomorrow) {
      alert(
        "Invalid date. Please select a date starting from tomorrow onwards."
      );
      setIsSaving(false);
      return;
    }

    // Check if the selected date is a holiday
    const holidaysRef = collection(db, "holidays");
    const holidayQuery = query(holidaysRef, where("date", "==", selectedDate));
    const holidaySnapshot = await getDocs(holidayQuery);

    if (!holidaySnapshot.empty) {
      const holidayData = holidaySnapshot.docs[0].data();
      alert(
        `The selected date is not available because of the holiday: ${holidayData.name}`
      );
      setIsSaving(false);
      return;
    }

    try {
      const docRef = doc(db, "appointments", id);
      await updateDoc(docRef, {
        selectedDate,
        timeRange,
      });
      alert("Appointment updated successfully!");
      setIsEditing(false); // Exit edit mode after saving
    } catch (error) {
      console.error("Error updating document:", error);
      alert("Failed to update appointment.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <NavLayout>
      <div className="mx-auto max-w-md mt-5">
        {appointmentData ? (
          <div className="p-4 flex flex-col">
            <h1 className="text-2xl font-bold text-primary mb-4">
              Appointment Details
            </h1>

            <label className="flex flex-col mb-4">
              <strong>Date:</strong>
              {isEditing ? (
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border p-2 rounded-md mr-auto"
                />
              ) : (
                <span>{selectedDate}</span>
              )}
            </label>

            <label className="flex flex-col mb-4">
              <strong>Time Range:</strong>
              {isEditing ? (
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="border p-2 rounded-md mr-auto"
                >
                  <option value="">Select a time</option>
                  <option value="8:00am-9:00am">8:00 AM - 9:00 AM</option>
                  <option value="9:00am-10:00am">9:00 AM - 10:00 AM</option>
                  <option value="10:00am-11:00am">10:00 AM - 11:00 AM</option>
                  <option value="11:00am-12:00pm">11:00 AM - 12:00 PM</option>
                  <option value="1:00pm-2:00pm">1:00 PM - 2:00 PM</option>
                  <option value="2:00pm-3:00pm">2:00 PM - 3:00 PM</option>
                  <option value="3:00pm-4:00pm">3:00 PM - 4:00 PM</option>
                  <option value="4:00pm-5:00pm">4:00 PM - 5:00 PM</option>
                </select>
              ) : (
                <span>{timeRange}</span>
              )}
            </label>

            <p>
              <strong>Selected Service:</strong>{" "}
              {appointmentData.selectedService}
            </p>
            <p>
              <strong>Selected Personnel:</strong>{" "}
              {appointmentData.selectedPersonnel}
            </p>
            <p>
              <strong>Selected Office:</strong> {appointmentData.selectedOffice}
            </p>
            <p>
              <strong>Other Reason:</strong> {appointmentData.otherReason}
            </p>
            <p>
              <strong>Name:</strong> {appointmentData.name}
            </p>
            <p>
              <strong>Contact:</strong> {appointmentData.contact}
            </p>
            <p>
              <strong>Email:</strong> {appointmentData.email}
            </p>
            <p>
              <strong>Role:</strong> {appointmentData.role}
            </p>
            <p>
              <strong>Date Created:</strong>{" "}
              {new Date(appointmentData.dateCreated).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong> {appointmentData.status}
            </p>
            <p>
              <strong>Office Code:</strong> {appointmentData.officeCode}
            </p>
            {appointmentData.declineReason && (
              <p>
                <strong>Decline Reason:</strong> {appointmentData.declineReason}
              </p>
            )}

            {isEditing && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn btn-sm btn-secondary text-white mt-4 w-20 rounded-sm"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            )}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-sm btn-outline text-primarymt-4 w-20 mt-4 rounded-sm"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>

            <Link
              href={"/office/appointment"}
              className="btn btn-sm btn-outline text-primarymt-4 w-20 mt-4 rounded-sm"
            >
              Back
            </Link>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </NavLayout>
  );
};

ReschedAppointment.displayName = "DocumentComponent";

export default ReschedAppointment;
