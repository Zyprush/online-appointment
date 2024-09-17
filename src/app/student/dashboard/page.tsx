import React from 'react';
import Reminder from './Reminder';
import Appointment from './Appointment';

const StudentDashboard = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-gray-100 p-4">
        <h2 className="text-lg font-bold mb-4">Folders</h2>
        <ul>
          <li className="mb-2">
            <button className="w-full flex items-center justify-center bg-primary text-white py-2 px-4 rounded hover:bg-blue-600">
              + Request Appointment
            </button>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center text-gray-600">
              📁 Your Appointments
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center text-gray-600">
              📄 Appointment History
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4 p-4 md:p-6">
        <Reminder />
        <Appointment />
      </div>
    </div>
  );
};

export default StudentDashboard;
