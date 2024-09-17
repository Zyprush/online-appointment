import React, { useState } from 'react';

// You may want to replace these with actual data from your backend
const services = [
  'Pay Fees',
  'Claim Documents',
  'Submit Requirements',
  'Other'
];

const offices = [
  'Registrar',
  'Cashier',
  'Dean\'s Office',
  'Student Affairs',
  'Other'
];

const RequestAppointment: React.FC = () => {
  const [appointmentType, setAppointmentType] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedOffice, setSelectedOffice] = useState<string>('');
  const [otherReason, setOtherReason] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the appointment request to your backend
    console.log('Appointment requested:', { appointmentType, selectedService, selectedOffice, otherReason });
    // Reset form after submission
    setAppointmentType(null);
    setSelectedService('');
    setSelectedOffice('');
    setOtherReason('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Request Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Appointment Type
          </label>
          <div>
            <button
              type="button"
              className={`mr-2 mb-2 px-4 py-2 rounded ${appointmentType === 'service' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              onClick={() => setAppointmentType('service')}
            >
              Avail OMSC services
            </button>
            <button
              type="button"
              className={`mr-2 mb-2 px-4 py-2 rounded ${appointmentType === 'meet' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              onClick={() => setAppointmentType('meet')}
            >
              Meet/Transact with OMSC Official/Personnel
            </button>
          </div>
        </div>

        {appointmentType === 'service' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Select Service
            </label>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              required
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>
        )}

        {appointmentType === 'meet' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Select Office/Official
            </label>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedOffice}
              onChange={(e) => setSelectedOffice(e.target.value)}
              required
            >
              <option value="">Select an office</option>
              {offices.map((office) => (
                <option key={office} value={office}>{office}</option>
              ))}
            </select>
          </div>
        )}

        {(selectedService === 'Other' || selectedOffice === 'Other') && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Please specify
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={!appointmentType}
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default RequestAppointment;