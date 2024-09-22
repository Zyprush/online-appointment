"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import NavLayout from "@/components/NavLayout";
import EditProfile from "./EditProfile";

const ClientInformation = () => {
  const [clientData, setClientData] = useState<{
    barangay: string;
    birthdate: string;
    city: string;
    contact: string;
    email: string;
    extensionName: string;
    firstName: string;
    homeAddress: string;
    lastName: string;
    middleName: string;
    province: string;
    role: string;
    sex: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  useEffect(() => {
    const fetchClientData = async (userId: string) => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setClientData(docSnap.data() as typeof clientData);
        } else {
          setError("No client data found.");
        }
      } catch (err) {
        setError("Error fetching client data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchClientData(user.uid);
      } else {
        setError("No user logged in.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen w-screen text-center">Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <NavLayout>
      <div className="p-2 md:p-8">
        <div className="p-5 md:p-10 flex flex-col justify-start items-between md:mx-20 bg-white min-h-screen rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Client Information</h2>
          {clientData ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 text-lg font-semibold">
                Personal Details
              </div>
              <div className="form-control">
                <label className="label text-sm">Last Name:</label>
                <p>{clientData.lastName}</p>
              </div>
              <div className="form-control">
                <label className="label text-sm">First Name:</label>
                <p>{clientData.firstName}</p>
              </div>
              <div className="form-control">
                <label className="label text-sm">Middle Name:</label>
                <p>{clientData.middleName || "N/A"}</p>
              </div>
              <div className="form-control">
                <label className="label text-sm">Extension Name:</label>
                <p>{clientData.extensionName || "N/A"}</p>
              </div>
              <div className="form-control">
                <label className="label text-sm">Contact Number:</label>
                <p>{clientData.contact}</p>
              </div>
              <div className="form-control">
                <label className="label text-sm">Birthdate:</label>
                <p>{clientData.birthdate}</p>
              </div>
              <div className="form-control">
                <label className="label text-sm">Sex:</label>
                <p>{clientData.sex}</p>
              </div>
              <div className="form-control col-span-2">
                <label className="label text-sm">Home Address:</label>
                <p>{clientData.homeAddress}</p>
              </div>
              <div className="form-control">
                <label className="label text-sm">Province:</label>
                <p>{clientData.province}</p>
              </div>
              <div className="form-control">
                <label className="label text-sm">City:</label>
                <p>{clientData.city}</p>
              </div>
              <div className="form-control">
                <label className="label text-sm">Barangay:</label>
                <p>{clientData.barangay}</p>
              </div>
              <div className="form-control">
                <label className="label text-sm">Email:</label>
                <p>{clientData.email}</p>
              </div>
              <div className="col-span-2">
                <button onClick={() => setEditModalOpen(true)} className="btn">
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <p>No client data available</p>
          )}
        </div>
      </div>

      <EditProfile
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
      />
    </NavLayout>
  );
};

export default ClientInformation;
