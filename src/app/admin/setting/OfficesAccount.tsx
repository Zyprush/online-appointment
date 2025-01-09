import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

const fixedOffices: { name: string; username: string; password: string }[] = [
  { name: "Registrar Office", username: "", password: "" },
  { name: "Cashier", username: "", password: "" },
  { name: "Admission & Guidance", username: "", password: "" },
  { name: "Student Affairs and Services", username: "", password: "" },
  { name: "BSIT Faculty", username: "", password: "" },
  { name: "BEED Faculty", username: "", password: "" },
  { name: "BSBA OM Faculty", username: "", password: "" },
  { name: "BSBA FM Faculty", username: "", password: "" },
  { name: "BSOA Faculty", username: "", password: "" },
  { name: "Campus Director", username: "", password: "" },
];

const OfficesAccount = () => {
  const [officesAccount, setOfficesAccount] = useState(fixedOffices);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchOfficesAccount = async () => {
      const officesAccountDoc = await getDoc(doc(db, "settings", "officesAccount"));
      if (officesAccountDoc.exists()) {
        setOfficesAccount(officesAccountDoc.data().officesAccount || fixedOffices);
      }
    };
    fetchOfficesAccount();
  }, []);

  const saveOfficesAccount = async () => {
    if (!isFormValid()) {
      setError("Please complete all fields and ensure passwords are at least 8 characters long.");
      return;
    }

    setError(null);
    setLoading(true);
    await setDoc(doc(db, "settings", "officesAccount"), { officesAccount });
    setLoading(false);
    setIsEditing(false);
  };

  const isFormValid = () => {
    return officesAccount.every(
      (office) =>
        office.username.trim() !== "" && office.password.trim() !== "" && office.password.length >= 8
    );
  };

  const handleOfficeChange = (index: number, field: keyof typeof officesAccount[number], value: string) => {
    setOfficesAccount((prevOfficesAccount) =>
      prevOfficesAccount.map((office, i) =>
        i === index ? { ...office, [field]: value } : office
      )
    );

    if (field === "password") {
      validatePassword(index, value);
    }
  };

  const validatePassword = (index: number, password: string) => {
    if (password.length < 8 && password.length > 0) {
      setPasswordErrors(prev => ({ ...prev, [index]: "Password must be at least 8 characters long" }));
    } else {
      setPasswordErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setShowPasswords(false);
    setPasswordErrors({});
  };

  const toggleShowPasswords = () => {
    setShowPasswords(!showPasswords);
  };

  return (
    <div className="bg-white p-5 rounded-lg border text-sm flex flex-col gap-3 text-zinc-600">
      <div className="flex justify-between items-center">
        <span className="font-bold text-primary">Offices Account</span>
        <button
          onClick={toggleEdit}
          className="btn btn-sm text-primary btn-outline rounded-sm"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {officesAccount.length > 0 && (
        isEditing ? (
          // Render inputs for editing
          <>
            <div className="flex justify-end">
              <button
                onClick={toggleShowPasswords}
                className="btn btn-sm btn-outline rounded-sm"
              >
                {showPasswords ? "Hide Passwords" : "Show Passwords"}
              </button>
            </div>
            {officesAccount.map((office, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <span className="w-80">{office.name}</span>
                  <input
                    type="text"
                    placeholder="Username"
                    value={office.username}
                    onChange={(e) =>
                      handleOfficeChange(index, "username", e.target.value)
                    }
                    className="p-2 text-sm border-primary border-2 rounded-sm w-80"
                  />
                  <input
                    type={showPasswords ? "text" : "password"}
                    placeholder="Password"
                    value={office.password}
                    onChange={(e) =>
                      handleOfficeChange(index, "password", e.target.value)
                    }
                    onBlur={() => validatePassword(index, office.password)}
                    className="p-2 text-sm border-primary border-2 rounded-sm w-80"
                  />
                </div>
                {passwordErrors[index] && (
                  <div className="text-red-500 text-xs">{passwordErrors[index]}</div>
                )}
              </div>
            ))}
          </>
        ) : (
          // Render table when not editing
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2">Office Name</th>
                <th className="p-2">Username</th>
                <th className="p-2">Password</th>
              </tr>
            </thead>
            <tbody>
              {officesAccount.map((office, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{office.name}</td>
                  <td className="p-2">{office.username || "Not set"}</td>
                  <td className="p-2">{office.password ? "*******" : "Not set"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      {isEditing && (
        <div className="mx-auto flex gap-5">
          <button
            onClick={saveOfficesAccount}
            className="btn btn-sm rounded-none btn-primary text-white"
            disabled={!isFormValid() || loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
};

export default OfficesAccount;