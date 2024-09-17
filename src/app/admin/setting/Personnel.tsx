import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

const Personnel = () => { // New component for managing personnel
  const [personnel, setPersonnel] = useState< // Changed from offices to personnel
    {
      name: string;
      position: string; // Added position field
    }[]
  >([]);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // New loading state

  // Fetch personnel from Firestore on component mount
  useEffect(() => {
    const fetchPersonnel = async () => {
      const personnelDoc = await getDoc(doc(db, "settings", "personnel")); // Changed from offices to personnel
      if (personnelDoc.exists()) {
        setPersonnel(personnelDoc.data().personnel || []); // Changed from offices to personnel
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
    await setDoc(doc(db, "settings", "personnel"), { personnel }); // Changed from offices to personnel
    setLoading(false); // Set loading to false after saving
    setIsEditing(false); // Exit editing mode after saving
  };

  const isFormValid = () => {
    return personnel.every(person => person.name.trim() !== "" && person.position.trim() !== ""); // Validate both name and position
  };

  const handlePersonnelChange = (index: number, field: keyof typeof personnel[number], value: string) => {
    setPersonnel((prevPersonnel) =>
      prevPersonnel.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const deletePersonnel = (index: number) =>
    setPersonnel(personnel.filter((_, i) => i !== index));

  const addPersonnel = () =>
    setPersonnel([
      ...personnel,
      {
        name: "",
        position: "", // Initialize position field
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
        personnel.map((person, index) => (
          <div key={index} className="flex gap-3">
            {isEditing ? (
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Personnel Name"
                  value={person.name}
                  onChange={(e) =>
                    handlePersonnelChange(index, "name", e.target.value)
                  }
                  className="p-2 text-sm border-primary border-2 rounded-sm w-80"
                />
                <input
                  type="text"
                  placeholder="Position"
                  value={person.position} // Added position input
                  onChange={(e) =>
                    handlePersonnelChange(index, "position", e.target.value)
                  }
                  className="p-2 text-sm border-primary border-2 rounded-sm"
                />
                <button
                  onClick={() => deletePersonnel(index)}
                  className="btn btn-sm rounded-sm text-white btn-error"
                >
                  Delete
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <span>{person.name}</span>
                <span>{person.position}</span> {/* Display position */}
              </div>
            )}
          </div>
        ))}

      {isEditing && (
        <div className="mx-auto flex gap-5">
          <button
            onClick={addPersonnel}
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