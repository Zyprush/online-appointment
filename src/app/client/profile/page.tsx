"use client";

import { useEffect, useState, useCallback } from "react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/firebase";
import NavLayout from "@/components/NavLayout";
import EditProfile from "./EditProfile";

interface ClientData {
  barangay: string;
  birthdate: string;
  city: string;
  contact: string;
  email: string;
  extensionName?: string;
  firstName: string;
  homeAddress: string;
  lastName: string;
  middleName?: string;
  province: string;
  role: string;
  sex: string;
}

const ClientInformation = () => {
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);

  const fetchClientData = useCallback(async (userId: string) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setClientData(docSnap.data() as ClientData);
      } else {
        setError("No client data found.");
      }
    } catch (err) {
      setError("Error fetching client data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        fetchClientData(user.uid);
      } else {
        setError("No user logged in.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchClientData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-screen text-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <NavLayout>
      <div className="p-2 md:p-8">
        <div className=" flex flex-col justify-start md:mx-20 bg-opacity-70 md:bg-white h-auto rounded-lg">
          <div className="flex">
            <h2 className="text-2xl font-bold text-primary m-5">
              Client Information
            </h2>
            <div className="col-span-2 mt-5 ml-auto mr-5">
                <button onClick={() => setEditModalOpen(true)} className="btn btn-outline text-primary btn-sm rounded-sm">
                  Edit Profile
                </button>
              </div>
          </div>
            <hr className="" />
          {clientData ? (
            <div className="grid grid-cols-2 gap-5 gap-y-6 p-5 md:p-10">
              <PersonalDetail label="Last Name" value={clientData.lastName} />
              <PersonalDetail label="First Name" value={clientData.firstName} />
              <PersonalDetail
                label="Middle Name"
                value={clientData.middleName || "N/A"}
              />
              <PersonalDetail
                label="Extension Name"
                value={clientData.extensionName || "N/A"}
              />
              <PersonalDetail
                label="Contact Number"
                value={clientData.contact}
              />
              <PersonalDetail label="Birthdate" value={clientData.birthdate} />
              <PersonalDetail label="Sex" value={clientData.sex} />
              <PersonalDetail label="Province" value={clientData.province} />
              <PersonalDetail label="City" value={clientData.city} />
              <PersonalDetail label="Barangay" value={clientData.barangay} />
              <PersonalDetail label="Email" value={clientData.email} />
              <PersonalDetail
                label="Home Address"
                value={clientData.homeAddress}
              />


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

interface PersonalDetailProps {
  label: string;
  value: string;
  isFullWidth?: boolean;
}

const PersonalDetail = ({
  label,
  value,
  isFullWidth = false,
}: PersonalDetailProps) => (
  <div className={`form-control ${isFullWidth ? "col-span-2" : ""}`}>
    <label className="text-primary font-bold">{label}:</label>
    <p className="text-sm">{value}</p>
  </div>
);

export default ClientInformation;
