import React from "react";
interface Client {
  lastName: string;
  firstName: string;
  middleName?: string;
  extensionName?: string;
  contact: string;
  birthdate: string;
  sex: string;
  homeAddress: string;
  province: string;
  city: string;
  barangay: string;
  zipCode: string;
  email: string;
  verified: boolean;
  uid: string;
}

interface ViewClientProps {
  client: Client | null;
  onClose: () => void;
}

const ViewClient: React.FC<ViewClientProps> = ({ client, onClose }) => {
  if (!client) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Client Details</h2>
        <div className="space-y-4">
          <div>
            <strong>Last Name:</strong> {client.lastName}
          </div>
          <div>
            <strong>First Name:</strong> {client.firstName}
          </div>
          <div>
            <strong>Middle Name:</strong> {client.middleName || "-"}
          </div>
          <div>
            <strong>Extension Name:</strong> {client.extensionName || "-"}
          </div>
          <div>
            <strong>Contact Number:</strong> {client.contact}
          </div>
          <div>
            <strong>Birthdate:</strong> {client.birthdate}
          </div>
          <div>
            <strong>Sex:</strong> {client.sex}
          </div>
          <div>
            <strong>Home Address:</strong> {client.homeAddress}
          </div>
          <div>
            <strong>Province:</strong> {client.province}
          </div>
          <div>
            <strong>City:</strong> {client.city}
          </div>
          <div>
            <strong>Barangay:</strong> {client.barangay}
          </div>
          <div>
            <strong>Zip Code:</strong> {client.zipCode}
          </div>
          <div>
            <strong>Email:</strong> {client.email}
          </div>
          <div>
            <strong>Verified:</strong> {client.verified ? "Yes" : "No"}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="btn btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewClient;
