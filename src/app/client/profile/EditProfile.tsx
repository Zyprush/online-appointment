"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface ClientData {
  barangay: string;
  birthdate: string;
  city: string;
  contact: string;
  extensionName: string;
  firstName: string;
  homeAddress: string;
  lastName: string;
  middleName: string;
  province: string;
}

const EditProfile = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchClientData = async (userId: string) => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setClientData(docSnap.data() as ClientData);
        } else {
          alert("No client data found.");
        }
      } catch (err) {
        alert("Error fetching client data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchClientData(user.uid);
      } else {
        alert("No user logged in.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (clientData) {
      setClientData({
        ...clientData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const validateContact = (contact: string): boolean => {
    const contactRegex = /^9\d{9}$/;
    return contactRegex.test(contact);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (clientData) {
      if (!validateContact(clientData.contact)) {
        alert("Contact number must be 10 digits and start with 9.");
        setSubmitting(false);
        return;
      }

      try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error("User not authenticated.");

        const docRef = doc(db, "users", userId);
        await updateDoc(docRef, {
          barangay: clientData.barangay,
          birthdate: clientData.birthdate,
          city: clientData.city,
          contact: clientData.contact,
          extensionName: clientData.extensionName || "",
          firstName: clientData.firstName,
          homeAddress: clientData.homeAddress,
          lastName: clientData.lastName,
          middleName: clientData.middleName || "",
          province: clientData.province,
        });

        alert("Profile updated successfully!");
        onClose();
        window.location.reload();
      } catch (err) {
        alert("Error updating client data.");
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md overflow-x-scroll">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-2">
          {clientData && (
            <>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="lastName"
                >
                  Last Name:
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={clientData.lastName}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="firstName"
                >
                  First Name:
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={clientData.firstName}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="middleName"
                >
                  Middle Name:
                </label>
                <input
                  type="text"
                  name="middleName"
                  id="middleName"
                  value={clientData.middleName || ""}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="extensionName"
                >
                  Extension Name:
                </label>
                <input
                  type="text"
                  name="extensionName"
                  id="extensionName"
                  value={clientData.extensionName || ""}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="contact"
                >
                  Contact Number:
                </label>
                <input
                  type="text"
                  name="contact"
                  id="contact"
                  value={clientData.contact}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="birthdate"
                >
                  Birthdate:
                </label>
                <input
                  type="date"
                  name="birthdate"
                  id="birthdate"
                  value={clientData.birthdate}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="homeAddress"
                >
                  Home Address:
                </label>
                <input
                  type="text"
                  name="homeAddress"
                  id="homeAddress"
                  value={clientData.homeAddress}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="province"
                >
                  Province:
                </label>
                <input
                  type="text"
                  name="province"
                  id="province"
                  value={clientData.province}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="city"
                >
                  City:
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={clientData.city}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="barangay"
                >
                  Barangay:
                </label>
                <input
                  type="text"
                  name="barangay"
                  id="barangay"
                  value={clientData.barangay}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
          <div className="flex justify-between mt-4 col-span-2 ml-auto gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`bg-primary ${submitting && "opacity-50 cursor-not-allowed"} text-white rounded-md px-4 py-2 hover:bg-blue-600 transition`}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;