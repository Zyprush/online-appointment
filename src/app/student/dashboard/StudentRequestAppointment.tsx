import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { db } from "@/firebase";
import { useUserData } from "@/hooks/useUserData";

interface Option {
  name: string;
  office?: string;
  phoneNumber?: string
  designatedPersonnel?: string
}

interface Service {
  name: string;
  office: string;
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

const StudentRequestAppointment: React.FC = () => {
  const [appointmentType, setAppointmentType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedOffice, setSelectedOffice] = useState("");
  const [selectedPersonnel, setSelectedPersonnel] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [loading, setLoading] = useState(false);
  const { userData } = useUserData();

  // Fetch data from Firestore
  const services = useFirestoreData("services", "services") as Service[];
  const offices = useFirestoreData("offices", "offices") as Option[];

  useEffect(() => {
    if (appointmentType === "service" && selectedService) {
      const service = services.find(s => s.name === selectedService);
      if (service) {
        setSelectedOffice(service.office);
      }
    }
  }, [appointmentType, selectedService, services]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!appointmentType || !selectedDate || !selectedTime || !selectedOffice) {
      alert("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const appointmentData = {
      submittedUid: userData?.uid,
      appointmentType,
      purpose: appointmentType === "visit" ? "Visit OMSC Office" : "Avail OMSC services",
      selectedDate,
      timeRange: selectedTime,
      selectedService,
      selectedPersonnel,
      selectedOffice,
      otherReason,
      name: userData?.fullName,
      contact: userData?.contact,
      email: userData?.email,
      role: userData?.role,
      dateCreated: new Date().toISOString(),
      status: "pending",
    };

    try {
      const appointmentsRef = collection(db, "appointments");
      await setDoc(doc(appointmentsRef), appointmentData);

      setAppointmentType(null);
      setSelectedDate("");
      setSelectedTime("");
      setSelectedService("");
      setSelectedOffice("");
      setSelectedPersonnel("");
      setOtherReason("");
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
            value={userData?.fullName}
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
            * Appointment Type
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

        {(appointmentType === "visit" || (appointmentType === "service" && selectedService)) && (
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
              <option value="">Select a time slot</option>
              <option value="7:00 AM - 8:00 AM">7:00 AM - 8:00 AM</option>
              <option value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</option>
              <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
              <option value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</option>
              <option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>
              <option value="5:00 PM - 6:00 PM">5:00 PM - 6:00 PM</option>
              <option value="7:00 PM - 8:00 PM">7:00 PM - 8:00 PM</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={!appointmentType || loading}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
};

export default StudentRequestAppointment;