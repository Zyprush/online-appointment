"use client";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import QrComponent from "./QrComponent";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from 'next/navigation'; // Import useRouter

interface InfoProps {
  params: {
    id: string;
  };
}

interface Appointment {
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
  officeCode: string;
  status: string;
}

const AppointmentSlip: React.FC<InfoProps> = ({ params }) => {
  const { id } = params;
  const router = useRouter(); // Initialize the router
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "appointments", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Appointment;
          setAppointment(data);
        } else {
          setError("Appointment is unavailable.");
        }
      } catch (error) {
        console.error("Error fetching appointment:", error);
        setError("Failed to load appointment.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAppointment();
    }
  }, [id]);

  const statusMessage = useMemo(() => {
    if (appointment?.status === "pending")
      return "This appointment is still pending.";
    if (appointment?.status === "declined")
      return "This appointment has been declined.";
    return "";
  }, [appointment]);

  // Function to print the div without reload and keep the formatting
  const handlePrint = () => {
    const printContents = document.getElementById("printable")?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
    }
  };

  // Function to handle back button click
  const handleBack = () => {
    router.back(); // Navigate to the last visited page
  };

  // Show loading state
  if (loading) return <div className="flex w-screen h-screen justify-center items-center">Loading...</div>;

  // Show error state
  if (error) return <div>{error}</div>;

  // Show appointment details if available
  if (appointment) {
    return (
      <div className="flex flex-col p-4 bg-slate-50">
        {/* Button to print the appointment */}
        <button
          className="btn btn-sm btn-primary fixed bottom-3 right-3 text-white rounded"
          onClick={handlePrint}
        >
          Print
        </button>

        {/* Button to go back */}
        <button
          className="btn btn-sm btn-primary fixed bottom-3 left-3 text-white rounded"
          onClick={handleBack}
        >
          Back
        </button>

        <style jsx global>{`
          @media print {
            @page {
              margin: 0; /* Remove margins for the page */
            }
            body {
              margin: 0;
              padding: 0;
            }
            #printable {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
            }
            /* Ensure background colors are printed */
            * {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            /* Optional: hide elements like the print button */
            button {
              display: none;
            }
          }
        `}</style>

        <div
          className="flex flex-col mx-auto border bg-white p-0 gap-5"
          style={{ width: "794px", height: "1123px" }}
          id="printable"
        >
          {/* Header Section */}
          <div className="flex p-0">
            <div className="bg-primary w-1/5 h-32 mt-10 flex justify-center items-center">
              <QrComponent />
            </div>
            <div className="w-3/5 bg-zinc-200 mt-10 flex flex-col justify-center p-4">
              <p className="text-4xl font-bold text-primary">
                Appointment Slip
              </p>
            </div>
            <div className="bg-primary w-2/5 h-32 mt-10 flex items-center pl-5">
              <div className="avatar">
                <div className="w-20 rounded-full border">
                  <Image
                    src="/img/logo.png"
                    alt="logo"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="ml-4 text-xl font-bold text-white">
                  <p>OMSC</p>
                  <p>Mamburao</p>
                </span>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="flex flex-col p-10">
            <div className="p-8 gap-4 flex flex-col">
              {statusMessage && <p className="text-red-500">{statusMessage}</p>}

              <p className="mb-5 border p-3 mr-auto">
                <span className="text-lg font-bold text-primary">
                  {appointment.officeCode}
                  {appointment.id}
                </span>
                <span className="text-xs text-zinc-600 block">
                  Appointment Code
                </span>
              </p>

              <h2 className="text-2xl font-bold text-primary mt-5">
                Appointment Details
              </h2>
              <Detail label="Office" value={appointment.selectedOffice} />
              <Detail label="Client Name" value={appointment.name} />
              <Detail label="Client Contact" value={appointment.contact} />
              <Detail label="Client Email" value={appointment.email} />
              <Detail
                label="Appointment Purpose"
                value={appointment.appointmentType}
                className="capitalize"
              />
              <Detail
                label="Appointment Date"
                value={appointment.selectedDate}
              />
              <Detail label="Appointment Time" value={appointment.timeRange} />
              {appointment.selectedService && (
                <Detail label="Service" value={appointment.selectedService} />
              )}
              <Detail label="Reason" value={appointment.otherReason} />
              <Detail
                label="Created At"
                value={new Date(appointment.dateCreated).toLocaleString()}
              />
            </div>
          </div>
          <div className="mt-auto mb-0 p-8 text-sm text-zinc-700">
            <p>Occidental Mindoro State College</p>
            <p>Mamburao Campus</p>
            <p>Barangay Tayamaan, Mamburao, Occidental Mindoro</p>
          </div>
        </div>
      </div>
    );
  }

  // Default fallback (if no appointment is available)
  return <div>Appointment not found.</div>;
};

// Reusable component for rendering appointment details
const Detail: React.FC<{
  label: string;
  value: string;
  className?: string;
}> = ({ label, value, className = "" }) => (
  <p className={className}>
    <strong className="mr-2">{label}:</strong> {value}
  </p>
);

export default AppointmentSlip;
