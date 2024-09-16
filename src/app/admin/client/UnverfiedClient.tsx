import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase";
import ViewClient from "./ViewClient"; // Import the modal component

interface Client {
  lastName: string;
  firstName: string;
  middleName?: string;
  extensionName?: string;
  contactNumber: string;
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

const UnverifiedClient = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null); // State for selected client
  const [showModal, setShowModal] = useState<boolean>(false); // State for modal visibility

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsCollection = collection(db, "clients");
        const q = query(clientsCollection, where("verified", "==", false));
        const querySnapshot = await getDocs(q);
        const clientsData: Client[] = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as Client),
          uid: doc.id,
        }));
        setClients(clientsData);
        setFilteredClients(clientsData);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    setFilteredClients(
      clients.filter((client) =>
        `${client.firstName} ${client.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, clients]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleVerifyClient = async (uid: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to verify this client?"
    );
    if (!isConfirmed) return;

    try {
      const clientDoc = doc(db, "clients", uid);
      await updateDoc(clientDoc, { verified: true });
      setClients((prev) => prev.filter((client) => client.uid !== uid));
      setFilteredClients((prev) => prev.filter((client) => client.uid !== uid));
      alert("Client verified successfully");
    } catch (error) {
      console.error("Error verifying client:", error);
      alert("Error verifying client: " + (error as Error).message);
    }
  };

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClient(null);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 w-full">
      <div className="bg-white p-10 rounded-lg shadow-md w-full">
        <h2 className="text-2xl font-bold mb-6">Unverified Clients</h2>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name..."
            className="input input-bordered input-sm w-full"
          />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  First Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Birthdate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sex
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.uid} onClick={() => handleClientClick(client)} className="cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {client.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.firstName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.contactNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.birthdate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.sex}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleVerifyClient(client.uid)}
                      className="btn btn-primary"
                    >
                      Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && selectedClient && (
        <ViewClient client={selectedClient} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default UnverifiedClient;
