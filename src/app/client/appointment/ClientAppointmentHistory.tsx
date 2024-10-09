import React, { useEffect, useState } from "react";
import { db } from "@/firebase"; // Import Firestore
import { collection, getDocs, query, where } from "firebase/firestore"; // Import query and where
import { useUserData } from "@/hooks/useUserData";
import ViewAppointment from "@/components/ViewAppointment";

interface Appointment {
  id: string;
  selectedDate: string;
  timeRange: string;
  appointmentType: string;
  status: string;
  otherReason: string;
  selectedService: string;
  selectedPersonnel: string;
  selectedOffice: string;
  name: string;
  contact: string;
  email: string;
  role: string;
  dateCreated: string;
  officeCode: string;
}

const ClientAppointmentHistory: React.FC = () => {
  const { userData } = useUserData(); // Get current user data
  const [appointments, setAppointments] = useState<Appointment[]>([]); // State to hold appointments
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]); // State to hold filtered appointments
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null); // State for selected appointment

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>(""); // State for status filter
  const [dateFilter, setDateFilter] = useState<string>(""); // State for date filter

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true); // Set loading to true
      try {
        const appointmentsRef = collection(db, "appointments");
        const q = query(appointmentsRef, 
          where("submittedUid", "==", userData?.uid),
          where("status", "in", ["declined", "approved"])
        ); 
        const snapshot = await getDocs(q);
        const appointmentList = snapshot.docs.map((doc) => ({
          id: doc.id,
          selectedDate: doc.data().selectedDate || "",
          timeRange: doc.data().timeRange || "",
          appointmentType: doc.data().appointmentType || "",
          status: doc.data().status || "",
          otherReason: doc.data().otherReason || "N/A",
          selectedService: doc.data().selectedService || "",
          selectedPersonnel: doc.data().selectedPersonnel || "",
          selectedOffice: doc.data().selectedOffice || "",
          name: doc.data().name || "",
          contact: doc.data().contact || "",
          email: doc.data().email || "",
          role: doc.data().role || "",
          dateCreated: doc.data().dateCreated || "",
          officeCode: doc.data().officeCode || "",
        }));
        setAppointments(appointmentList);
        setFilteredAppointments(appointmentList); // Initially, show all appointments
      } catch (error) {
        setError("Error fetching appointments: " + (error as Error).message);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    if (userData?.uid) { // Ensure user UID is available before fetching
      fetchAppointments();
    }
  }, [userData]);

  // Handler to open the modal
  const handleView = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  // Handler to close the modal
  const closeModal = () => {
    setSelectedAppointment(null);
    setIsModalOpen(false);
  };

  // Filter appointments based on date and status
  const handleFilter = () => {
    let filtered = appointments;

    // Filter by status if a status is selected
    if (statusFilter) {
      filtered = filtered.filter((appointment) => appointment.status === statusFilter);
    }

    // Filter by date if a date is selected
    if (dateFilter) {
      filtered = filtered.filter((appointment) => appointment.selectedDate === dateFilter);
    }

    setFilteredAppointments(filtered);
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading message
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Appointment History</h2>

      {/* Filter Section */}
      <div className="mb-4">
        <label className="mr-2">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="mr-4 p-2 border"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="declined">Declined</option>
        </select>

        <label className="mr-2">Filter by Date:</label>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="mr-4 p-2 border"
        />

        <button onClick={handleFilter} className="bg-primary text-white py-2 px-4 rounded">
          Apply Filter
        </button>
      </div>

      {/* Appointments Table */}
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Appointment Code</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Time</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-2 text-center">No appointment history found.</td>
            </tr>
          ) : (
            filteredAppointments.map((appointment) => (
              <tr key={appointment.id} className="border-b">
                <td className="px-4 py-2 uppercase">{`${appointment.officeCode}${appointment.id}` || appointment.id}</td>
                <td className="px-4 py-2 capitalize">{appointment.appointmentType}</td>
                <td className="px-4 py-2">{appointment.selectedDate}</td>
                <td className="px-4 py-2">{appointment.timeRange}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded ${
                      appointment.status === "declined"
                        ? "bg-red-200 text-red-800"
                        : appointment.status === "approved"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleView(appointment)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal for viewing appointment details */}
      {isModalOpen && selectedAppointment && (
        <ViewAppointment appointment={selectedAppointment} onClose={closeModal} />
      )}
    </div>
  );
};

export default ClientAppointmentHistory;
