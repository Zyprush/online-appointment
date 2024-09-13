
"use client";
import React, { useState } from 'react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: (data: { date: string; time: string; natureOfRequest: string; fullName: string }) => void;
  selectedDate: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onBook, selectedDate }) => {
  const [time, setTime] = useState('');
  const [natureOfRequest, setNatureOfRequest] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBook({ date: selectedDate, time, natureOfRequest, fullName });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Book Appointment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input type="text" value={selectedDate} disabled className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select a time</option>
              {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => (
                <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                  {`${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nature of Request</label>
            <select
              value={natureOfRequest}
              onChange={(e) => setNatureOfRequest(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select nature of request</option>
              <option value="TOR request">TOR request</option>
              <option value="Registrar">Registrar</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;