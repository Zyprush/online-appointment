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
import ViewRequirements from "./ViewRequirements";
import { useSendSMS } from "@/hooks/useSendSMS";

interface Option {
  name: string;
  office?: string;
  phoneNumber?: string;
  officeCode?: string;
  requirements?: string;
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
  const { sendAppointSMS } = useSendSMS();

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

  const checkExistingAppointments = async (
    selectedDate: string,
    timeRange: string
  ): Promise<number> => {
    try {
      const appointmentsRef = query(
        collection(db, "appointments"),
        where("selectedOffice", "==", selectedOffice),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const appointmentCount = await checkExistingAppointments(
      selectedDate,
      selectedTime
    );
    console.log("appointmentCount", appointmentCount);
    if (appointmentCount >= 4) {
      alert("There are already 4 (four) appointments for that time range. Please select different time range or date.");
      setLoading(false);
      return;
    }
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

    const dayOfWeek = selectedDateObj.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      alert(
        "Appointments cannot be scheduled on weekends (Saturday or Sunday)."
      );
      setLoading(false);
      return;
    }

    const existingAppointmentQuery = query(
      collection(db, "appointments"),
      where("submittedUid", "==", userData?.uid),
      where("selectedDate", "==", selectedDate),
      where("timeRange", "==", selectedTime),
      where("status", "==", "approved")
    );

    const existingAppointmentSnapshot = await getDocs(existingAppointmentQuery);

    if (!existingAppointmentSnapshot.empty) {
      alert(
        "You already have an appointment scheduled for this date and time."
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
      status: "approved",
      officeCode,
    };

    // Save the appointment
    try {
      const appointmentDocRef = doc(collection(db, "appointments"));
      await setDoc(appointmentDocRef, appointmentData);
      sendAppointSMS({
        timeRange: selectedTime,
        selectedDate: selectedDate,
        phoneNumber: office?.phoneNumber,
        appointmentId: appointmentDocRef.id,
        name: `${userData?.firstName} ${userData?.lastName}`,
        officeCode: officeCode,
        selectedOffice: selectedOffice,
      });
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

        {appointmentType === "visit" && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              * Select Office
            </label>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedOffice}
              onChange={(e) => setSelectedOffice(e.target.value)}
              required
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
        {appointmentType === "service" && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              * Office
            </label>
            <input
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedOffice}
              disabled
            />
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
              <option value="8:00am-9:00am">8:00 AM - 9:00 AM</option>
              <option value="9:00am-10:00am">9:00 AM - 10:00 AM</option>
              <option value="10:00am-11:00am">10:00 AM - 11:00 AM</option>
              <option value="11:00am-12:00pm">11:00 AM - 12:00 PM</option>
              {/* <option value="12:00pm-1:00pm">12:00 PM - 1:00 PM</option> */}
              <option value="1:00pm-2:00pm">1:00 PM - 2:00 PM</option>
              <option value="2:00pm-3:00pm">2:00 PM - 3:00 PM</option>
              <option value="3:00pm-4:00pm">3:00 PM - 4:00 PM</option>
              <option value="4:00pm-5:00pm">4:00 PM - 5:00 PM</option>
            </select>
          </div>
        </div>
        <ViewRequirements
          selectedService={selectedService}
          services={services}
        />
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
