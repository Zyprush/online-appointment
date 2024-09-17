import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

const Personnel = () => { // Renamed component
  const [personnel, setPersonnel] = useState<
    {
      name: string;
    }[] // Removed price from the type
  >([]);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // New loading state

  // Fetch personnel from Firestore on component mount
  useEffect(() => {
    const fetchPersonnel = async () => {
      const personnelDoc = await getDoc(doc(db, "settings", "personnel"));
      if (personnelDoc.exists()) {
        setPersonnel(personnelDoc.data().personnel || []);
      }
    };
    fetchPersonnel();
  }, []);

  // Save personnel to Firestore
  const savePersonnel = async () => {
    if (!isFormValid()) {
      setError("Please complete all fields.");
      return;
    }

    setError(null); // Clear error
    setLoading(true); // Set loading to true
    await setDoc(doc(db, "settings", "personnel"), { personnel });
    setLoading(false); // Set loading to false after saving
    setIsEditing(false); // Exit editing mode after saving
  };

  const isFormValid = () => {
    return personnel.every(service => service.name.trim() !== "");
  };

  const handleServiceChange = (index: number, field: keyof typeof personnel[number], value: string) => {
    setPersonnel((prevPersonnel) =>
      prevPersonnel.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const deleteService = (index: number) =>
    setPersonnel(personnel.filter((_, i) => i !== index));

  const addService = () =>
    setPersonnel([
      ...personnel,
      {
        name: "",
      },
    ]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="bg-white p-5 rounded-lg border flex flex-col gap-3 text-zinc-600">
      <div className="flex justify-between items-center">
        <span className="font-bold text-primary">Personnel</span> {/* Updated title */}
        <button
          onClick={toggleEdit}
          className="btn btn-sm text-primary btn-outline rounded-sm"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {personnel.length > 0 &&
        personnel.map((service, index) => (
          <div key={index} className="flex gap-3">
            {isEditing ? (
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Personnel Name"
                  value={service.name}
                  onChange={(e) =>
                    handleServiceChange(index, "name", e.target.value)
                  }
                  className="p-2 text-sm border-primary border-2 rounded-sm w-80"
                />
                <button
                  onClick={() => deleteService(index)}
                  className="btn btn-sm rounded-sm text-white btn-error"
                >
                  Delete
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <span>{service.name}</span>
              </div>
            )}
          </div>
        ))}

      {isEditing && (
        <div className="mx-auto flex gap-5">
          <button
            onClick={addService}
            className="btn btn-sm rounded-none text-primary btn-outline"
          >
            Add Personnel
          </button>
          <button
            onClick={savePersonnel}
            className="btn btn-sm rounded-none btn-primary text-white"
            disabled={!isFormValid() || loading} // Disable button if form is invalid or loading
          >
            {loading ? "Saving..." : "Save Changes"} {/* Show loading text */}
          </button>
        </div>
      )}
    </div>
  );
};

export default Personnel; // Updated export