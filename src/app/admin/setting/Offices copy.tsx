import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

interface Office {
  name: string;
  employees: Employee[];
}

interface Employee {
  name: string;
  contact: string;
}

const Offices = () => {
  const [offices, setOffices] = useState<Office[]>([]);
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
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

  // Save offices to Firestore
  const saveOffices = async () => {
    if (!isFormValid()) {
      setError("Please complete all fields.");
      return;
    }

    setError(null);
    setLoading(true);
    await setDoc(doc(db, "settings", "offices"), { offices });
    setLoading(false);
    setIsEditing(false); // Exit edit mode after saving
  };

  // Form validation
  const isFormValid = () => {
    return offices.every(
      (office) =>
        office.name.trim() !== "" &&
        office.employees.every((emp) => emp.name.trim() !== "" && emp.contact.trim() !== "")
    );
  };

  // Handle office input change
  const handleOfficeChange = (index: number, field: keyof Office, value: string) => {
    setOffices((prevOffices) =>
      prevOffices.map((office, i) => (i === index ? { ...office, [field]: value } : office))
    );
  };

  // Handle employee input change
  const handleEmployeeChange = (
    officeIndex: number,
    empIndex: number,
    field: keyof Employee,
    value: string
  ) => {
    setOffices((prevOffices) =>
      prevOffices.map((office, i) =>
        i === officeIndex
          ? {
              ...office,
              employees: office.employees.map((emp, j) =>
                j === empIndex ? { ...emp, [field]: value } : emp
              ),
            }
          : office
      )
    );
  };

  // Add new employee
  const addEmployee = (officeIndex: number) => {
    setOffices((prevOffices) =>
      prevOffices.map((office, i) =>
        i === officeIndex
          ? { ...office, employees: [...office.employees, { name: "", contact: "" }] }
          : office
      )
    );
  };

  // Delete employee
  const deleteEmployee = (officeIndex: number, empIndex: number) => {
    setOffices((prevOffices) =>
      prevOffices.map((office, i) =>
        i === officeIndex
          ? { ...office, employees: office.employees.filter((_, j) => j !== empIndex) }
          : office
      )
    );
  };

  // Add new office
  const addOffice = () => {
    setOffices([...offices, { name: "", employees: [] }]);
  };

  // Delete office
  const deleteOffice = (index: number) => {
    setOffices(offices.filter((_, i) => i !== index));
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="bg-white p-5 rounded-lg border flex flex-col gap-3">
      {offices.map((office, officeIndex) => (
        <div key={officeIndex} className="p-3 border-b">
          <input
            type="text"
            placeholder="Office Name"
            value={office.name}
            onChange={(e) => handleOfficeChange(officeIndex, "name", e.target.value)}
            className={`input input-bordered w-full ${!isEditing ? "disabled" : ""}`}
            disabled={!isEditing} // Disable when not in editing mode
          />
          {office.employees.map((employee, empIndex) => (
            <div key={empIndex} className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Employee Name"
                value={employee.name}
                onChange={(e) => handleEmployeeChange(officeIndex, empIndex, "name", e.target.value)}
                className={`input input-bordered w-1/2 ${!isEditing ? "disabled" : ""}`}
                disabled={!isEditing} // Disable when not in editing mode
              />
              <input
                type="tel"
                placeholder="Contact"
                value={employee.contact}
                onChange={(e) => handleEmployeeChange(officeIndex, empIndex, "contact", e.target.value)}
                pattern="^\d{10}$"
                className={`input input-bordered w-1/2 ${!isEditing ? "disabled" : ""}`}
                disabled={!isEditing} // Disable when not in editing mode
              />
              {isEditing && (
                <button onClick={() => deleteEmployee(officeIndex, empIndex)} className="btn btn-error">
                  Delete Employee
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <button onClick={() => addEmployee(officeIndex)} className="btn btn-primary mt-2">
              Add Employee
            </button>
          )}
          {isEditing && (
            <button onClick={() => deleteOffice(officeIndex)} className="btn btn-error mt-2">
              Delete Office
            </button>
          )}
        </div>
      ))}
      {isEditing && (
        <button onClick={addOffice} className="btn btn-primary mt-4">
          Add Office
        </button>
      )}
      {isEditing ? (
        <button onClick={saveOffices} className="btn btn-success mt-4">
          Save
        </button>
      ) : (
        <button onClick={toggleEdit} className="btn btn-warning mt-4">
          Edit
        </button>
      )}
      {loading && <p>Saving...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Offices;
