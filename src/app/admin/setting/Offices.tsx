import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

interface Office {
  name: string;
  phoneNumber: string;
  designatedPersonnel: string;
}

const Offices: React.FC = () => {
  const fixedOffices: string[] = [
    "Registrar Office",
    "Cashier",
    "Admission & Guidance",
    "Student Affairs and Services",
    "BSIT Faculty",
    "BEED Faculty",
    "BSBA OM Faculty",
    "BSBA FM Faculty",
    "BSOA Faculty"
  ];

  const [offices, setOffices] = useState<Office[]>([]);
  const [editingOffices, setEditingOffices] = useState<Office[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchOffices = async () => {
      const officesDoc = await getDoc(doc(db, "settings", "offices"));
      if (officesDoc.exists()) {
        const existingOffices = officesDoc.data().offices as Office[] || [];
        const updatedOffices = fixedOffices.map(name => {
          const existingOffice = existingOffices.find(o => o.name === name);
          return existingOffice || { name, phoneNumber: "", designatedPersonnel: "" };
        });
        setOffices(updatedOffices);
        setEditingOffices(updatedOffices);
      } else {
        const newOffices = fixedOffices.map(name => ({ name, phoneNumber: "", designatedPersonnel: "" }));
        setOffices(newOffices);
        setEditingOffices(newOffices);
      }
    };
    fetchOffices();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveOffices = async () => {
    if (!isFormValid()) {
      setError("Please complete all fields correctly.");
      return;
    }

    if (window.confirm("Are you sure you want to save the changes?")) {
      setError(null);
      setLoading(true);
      await setDoc(doc(db, "settings", "offices"), { offices: editingOffices });
      setOffices(editingOffices);
      setLoading(false);
      setIsEditing(false);
    }
  };

  const isFormValid = (): boolean => {
    return editingOffices.every(office => 
      isValidPhoneNumber(office.phoneNumber) && office.designatedPersonnel.trim() !== ""
    );
  };

  const isValidPhoneNumber = (phoneNumber: string): boolean => {
    return /^9\d{9}$/.test(phoneNumber);
  };

  const handleOfficeChange = (index: number, value: string, field: keyof Omit<Office, 'name'>) => {
    setEditingOffices(prevOffices =>
      prevOffices.map((office, i) => 
        i === index ? { ...office, [field]: value } : office
      )
    );
  };

  const toggleEdit = () => {
    if (isEditing) {
      // If we're exiting edit mode, save changes
      setIsEditing(false);
      setOffices(editingOffices);
    } else {
      // If we're entering edit mode, reset editingOffices to current offices
      setEditingOffices([...offices]);
      setIsEditing(true);
    }
    setError(null);
  };

  const cancelEditing = () => {
    if (window.confirm("Are you sure you want to cancel editing? All unsaved changes will be lost.")) {
      setEditingOffices([...offices]);
      setIsEditing(false);
      setError(null);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg border flex flex-col gap-3 text-zinc-600">
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-primary text-xl">Offices</span>
        <button
          onClick={toggleEdit}
          className="btn btn-sm rounded-none btn-outline text-primary"
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {isEditing ? (
        <div className="flex flex-col gap-3">
          {editingOffices.map((office, index) => (
            <div key={index} className="flex gap-3 items-center">
              <span className="w-40">{office.name}</span>
              <div className="flex flex-col">
                <input
                  type="text"
                  placeholder="Phone Number (10 digits, start with 9)"
                  value={office.phoneNumber}
                  onChange={(e) => handleOfficeChange(index, e.target.value, "phoneNumber")}
                  className={`p-2 text-sm border-2 rounded-sm w-60 ${
                    isValidPhoneNumber(office.phoneNumber) ? 'border-primary' : 'border-red-500'
                  }`}
                />
                {!isValidPhoneNumber(office.phoneNumber) && (
                  <span className="text-red-500 text-xs mt-1">Phone number must be 10 digits and start with 9</span>
                )}
              </div>
              <input
                type="text"
                placeholder="Designated Personnel"
                value={office.designatedPersonnel}
                onChange={(e) => handleOfficeChange(index, e.target.value, "designatedPersonnel")}
                className="p-2 text-sm border-primary border-2 rounded-sm w-60"
              />
            </div>
          ))}
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Office Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designated Personnel</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {offices.map((office, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{office.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{office.phoneNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{office.designatedPersonnel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isEditing && (
        <div className="mx-auto flex gap-5 mt-4">
          <button
            onClick={saveOffices}
            className="btn btn-sm rounded-none btn-primary text-white"
            disabled={!isFormValid() || loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={cancelEditing}
            className="btn btn-sm rounded-none btn-outline text-red-500"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default Offices;