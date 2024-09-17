import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

const Services = () => {
  const [services, setServices] = useState<
    {
      name: string;
    }[]
  >([]);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      const servicesDoc = await getDoc(doc(db, "settings", "services"));
      if (servicesDoc.exists()) {
        setServices(servicesDoc.data().services || []);
      }
    };
    fetchServices();
  }, []);

  const saveServices = async () => {
    if (!isFormValid()) {
      setError("Please complete all fields.");
      return;
    }

    setError(null);
    setLoading(true);
    await setDoc(doc(db, "settings", "services"), { services });
    setLoading(false);
    setIsEditing(false);
  };

  const isFormValid = () => {
    return services.every(office => office.name.trim() !== "");
  };

  const handleOfficeChange = (index: number, field: keyof typeof services[number], value: string) => {
    setServices((prevServices) =>
      prevServices.map((o, i) => (i === index ? { ...o, [field]: value } : o))
    );
  };

  const deleteOffice = (index: number) =>
    setServices(services.filter((_, i) => i !== index));

  const addOffice = () =>
    setServices([
      ...services,
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
        <span className="font-bold text-primary">Services</span>
        <button
          onClick={toggleEdit}
          className="btn btn-sm text-primary btn-outline rounded-sm"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {services.length > 0 &&
        services.map((office, index) => (
          <div key={index} className="flex gap-3">
            {isEditing ? (
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Office Name"
                  value={office.name}
                  onChange={(e) =>
                    handleOfficeChange(index, "name", e.target.value)
                  }
                  className="p-2 text-sm border-primary border-2 rounded-sm w-80"
                />
                <button
                  onClick={() => deleteOffice(index)}
                  className="btn btn-sm rounded-sm text-white btn-error"
                >
                  Delete
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <span>{office.name}</span>
              </div>
            )}
          </div>
        ))}

      {isEditing && (
        <div className="mx-auto flex gap-5">
          <button
            onClick={addOffice}
            className="btn btn-sm rounded-none text-primary btn-outline"
          >
            Add Office
          </button>
          <button
            onClick={saveServices}
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

export default Services;