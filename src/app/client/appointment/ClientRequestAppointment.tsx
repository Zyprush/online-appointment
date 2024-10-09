import React, { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useUserData } from "@/hooks/useUserData";

interface Option {
  name: string;
  office?: string;
  officeCode?: string;
}

const useFirestoreData = (docId: string, field: string) => {
  const [data, setData] = useState<Option[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "settings", docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData(docSnap.data()[field] || []);
      }
    };

    fetchData();
  }, [docId, field]);

  return data;
};

const ClientRequestAppointment: React.FC = () => {
  const [appointmentType, setAppointmentType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedOffice, setSelectedOffice] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [loading, setLoading] = useState(false);
  const { userData } = useUserData();

  // Fetch data from Firestore
  const services = useFirestoreData("services", "services");
  const offices = useFirestoreData("offices", "offices");

  useEffect(() => {
    if (appointmentType === "service" && selectedService) {
      const service = services.find((s) => s.name === selectedService);
      if (service && service.office) {
        setSelectedOffice(service.office);
      }
    }
  }, [appointmentType, selectedService, services]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check if the user is restricted
    if (userData?.verified === false) {
      alert(
        "Your account is restricted. Please contact the system admin if you have any questions: mambuappoint@gmail.com."
      );
      setLoading(false);
      return;
    }

    // Check for required fields
    if (!appointmentType || !selectedDate || !selectedTime || !selectedOffice) {
      alert("Please fill in all required fields.");
      setLoading(false);
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
      setLoading(false);
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
      setLoading(false);
      return;
    }

    // Prepare appointment data for submission
    const office = offices.find((o) => o.name === selectedOffice);
    const officeCode = office?.officeCode || "";

    const appointmentData = {
      submittedUid: userData?.uid,
      appointmentType,
      purpose:
        appointmentType === "visit"
          ? "Visit OMSC Office"
          : "Avail OMSC services",
      selectedDate,
      timeRange: selectedTime,
      selectedService,
      selectedOffice,
      otherReason,
      name:
        `${userData?.firstName} ${userData?.lastName}` || userData?.fullName,
      contact: userData?.contact,
      email: userData?.email,
      role: userData?.role,
      dateCreated: new Date().toISOString(),
      status: "pending",
      officeCode,
    };

    // Save the appointment
    try {
      const appointmentsRef = collection(db, "appointments");
      await setDoc(doc(appointmentsRef), appointmentData);
      setAppointmentType(null);
      setSelectedDate("");
      setSelectedTime("");
      setSelectedService("");
      setSelectedOffice("");
      setOtherReason("");
      alert("Appointment request submitted successfully.");
    } catch (error) {
      console.error("Error saving appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Request Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-5">
          <input
            type="text"
            className="input input-disabled input-sm"
            value={`${userData?.firstName} ${userData?.lastName}`}
            disabled
          />
          <input
            type="text"
            className="input input-disabled input-sm capitalize"
            value={userData?.role}
            disabled
          />
          <input
            type="text"
            className="input input-disabled input-sm"
            value={userData?.email}
            disabled
          />
          <input
            type="text"
            className="input input-disabled input-sm"
            value={userData?.contact}
            disabled
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            * Purpose of Appointment
          </label>
          <div className="flex flex-col md:flex-row md:space-x-2">
            <button
              type="button"
              className={`mb-2 px-4 py-2 rounded ${
                appointmentType === "service"
                  ? "bg-primary text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setAppointmentType("service")}
            >
              Avail OMSC services
            </button>
            <button
              type="button"
              className={`mb-2 px-4 py-2 rounded ${
                appointmentType === "visit"
                  ? "bg-primary text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setAppointmentType("visit")}
            >
              Visit OMSC Office
            </button>
          </div>
        </div>

        {appointmentType === "service" && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              * Select Service
            </label>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              required
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service.name} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {appointmentType && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              * Select Office
            </label>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedOffice}
              onChange={(e) => setSelectedOffice(e.target.value)}
              required
              disabled={appointmentType === "service"}
            >
              <option value="">Select an office</option>
              {offices.map((office) => (
                <option key={office.name} value={office.name}>
                  {office.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {appointmentType === "visit" && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Other Reason (Optional)
            </label>
            <textarea
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              placeholder="Please specify any other reason for your visit"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              * Date
            </label>
            <input
              type="date"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              * Time
            </label>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
            >
              <option value="">Select a time</option>
              <option value="8am-10am">8:00 AM - 10:00 AM</option>
              <option value="10am-12pm">10:00 AM - 12:00 PM</option>
              <option value="1pm-3pm">1:00 PM - 3:00 PM</option>
              <option value="3pm-5pm">3:00 PM - 5:00 PM</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading ? "opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientRequestAppointment;
