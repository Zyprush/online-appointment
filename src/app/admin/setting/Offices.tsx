import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

const Offices = () => {
  const [offices, setOffices] = useState<
    {
      name: string;
      phoneNumber: string;
    }[]
  >([]);
  const [newOffices, setNewOffices] = useState<{ name: string; phoneNumber: string }[]>([]); // New state for unsaved offices
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch offices from Firestore on component mount
  useEffect(() => {
    const fetchOffices = async () => {
      const officesDoc = await getDoc(doc(db, "settings", "offices"));
      if (officesDoc.exists()) {
        setOffices(officesDoc.data().offices || []);
      }
    };
    fetchOffices();
  }, []);

  // Save new offices to Firestore
  const saveOffices = async () => {
    if (!isFormValid()) {
      setError("Please complete all fields.");
      return;
    }

    if (window.confirm("Are you sure you want to submit the new offices? This cannot be undone, Edited or Deleted.")) {
      setError(null); // Clear error
      setLoading(true); // Set loading to true
      await setDoc(doc(db, "settings", "offices"), { offices: [...offices, ...newOffices] });
      setOffices((prevOffices) => [...prevOffices, ...newOffices]); // Update state with new offices
      setNewOffices([]); // Clear new offices
      setLoading(false); // Set loading to false after saving
    }
  };

  // Cancel adding new offices
  const cancelAddingOffices = () => {
    if (window.confirm("Are you sure you want to cancel adding new offices? All unsaved changes will be lost.")) {
      setNewOffices([]); // Clear unsaved new offices
      setError(null); // Clear any error message
    }
  };

  const isFormValid = () => {
    return newOffices.every(office => office.name.trim() !== "" && office.phoneNumber.trim() !== "");
  };

  const handleNewOfficeChange = (index: number, value: string, field: "name" | "phoneNumber") => {
    setNewOffices((prevNewOffices) =>
      prevNewOffices.map((office, i) => 
        i === index ? { ...office, [field]: value } : office
      )
    );
  };

  const addNewOffice = () => {
    setNewOffices([...newOffices, { name: "", phoneNumber: "" }]);
  };

  return (
    <div className="bg-white p-5 rounded-lg border flex flex-col gap-3 text-zinc-600">
      <div className="flex justify-between items-center">
        <span className="font-bold text-primary">Offices</span>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {/* Display existing offices (not editable or deletable) */}
      {offices.length > 0 &&
        offices.map((office, index) => (
          <div key={index} className="flex gap-3">
            <span>{office.name}</span>
            <span>{office.phoneNumber}</span>
          </div>
        ))}

      {/* Display new offices (editable until saved) */}
      {newOffices.length > 0 &&
        newOffices.map((office, index) => (
          <div key={index} className="flex gap-3 items-center">
            <input
              type="text"
              placeholder="Office Name"
              value={office.name}
              onChange={(e) => handleNewOfficeChange(index, e.target.value, "name")}
              className="p-2 text-sm border-primary border-2 rounded-sm w-80"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={office.phoneNumber}
              onChange={(e) => handleNewOfficeChange(index, e.target.value, "phoneNumber")}
              className="p-2 text-sm border-primary border-2 rounded-sm w-80"
            />
          </div>
        ))}

      {/* Add new office button */}
      <div className="mx-auto flex gap-5">
        <button
          onClick={addNewOffice}
          className="btn btn-sm rounded-none text-primary btn-outline"
        >
          Add Office
        </button>

        {/* Conditionally render Save and Cancel buttons only when there are unsaved offices */}
        {newOffices.length > 0 && (
          <>
            <button
              onClick={saveOffices}
              className="btn btn-sm rounded-none btn-primary text-white"
              disabled={!isFormValid() || loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={cancelAddingOffices}
              className="btn btn-sm rounded-none btn-outline text-red-500"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Offices;
