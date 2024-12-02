import React from "react";

interface AppointmentProps {
  appointment: {
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
  };
  onClose: () => void;
}

const DetailRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <span className="flex flex-col gap-1">
    <span className="text-primary font-bold">{label}:</span>
    <span className="text-sm text-gray-600 font-normal capitalize">{value}</span>
  </span>
);

const ViewAppointment: React.FC<AppointmentProps> = ({
  appointment,
  onClose,
}) => {
  const {
    id,
    appointmentType,
    selectedDate,
    timeRange,
    selectedService,
    selectedOffice,
    otherReason,
    name,
    contact,
    email,
    dateCreated,
    officeCode
  } = appointment;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70"
      style={{ zIndex: 1000 }}
    >
      <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg z-50">
        {/* <h2 className="text-2xl font-bold mb-4 text-primary">Appointment Details</h2> */}
        <div className="grid gap-6 gap-x-7 grid-cols-2 md:gap-x-10 rounded z-50">
          {/* <DetailRow label="Appointment Code" value={id} /> */}
          <span className="flex flex-col gap-1">
    <span className="text-primary font-bold">Appointment Code</span>
    <span className="text-sm text-gray-600 font-normal capitalize">{officeCode + id}</span>
  </span>
          <DetailRow label="Type" value={appointmentType} />
          <DetailRow label="Date" value={selectedDate} />
          <DetailRow label="Time" value={timeRange} />
          {appointmentType === "service" && <DetailRow label="Service" value={selectedService} />}
          <DetailRow label="Office" value={selectedOffice} />
          {otherReason && <DetailRow label="Other Reason" value={otherReason} /> }
          <DetailRow label="Name" value={name} />
          <DetailRow label="Contact" value={contact} />
          <DetailRow label="Email" value={email} />
          {/* <DetailRow label="Role" value={role} /> */}
          <DetailRow label="Date Created" value={dateCreated} />
        </div>

        <button
          className="mt-10 btn-sm btn-primary text-white btn ml-auto mr-0 rounded-sm"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewAppointment;
