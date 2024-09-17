import React from 'react';

const Appointment = () => {
  return (
    <div className="bg-white p-4 rounded shadow overflow-x-auto">
      <h3 className="font-bold text-lg mb-4">Your Appointments</h3>
      <input
        type="text"
        placeholder="Search"
        className="border rounded px-2 py-1 mb-4 w-full"
      />
      <table className="table-auto w-full text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Appointment Code</th>
            <th className="px-4 py-2">Appointment</th>
            <th className="px-4 py-2">Schedule</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2" colSpan={5}>
              No data available in table
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Appointment;