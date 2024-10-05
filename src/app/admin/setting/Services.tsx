import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

interface Office {
  name: string;
  phoneNumber: string;
  designatedPersonnel: string;
}

interface Service {
  name: string;
  office: string;
}

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [offices, setOffices] = useState<Office[]>([]); 
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch services and offices from Firestore on component mount
  useEffect(() => {
    const fetchServicesAndOffices = async () => {
      const servicesDoc = await getDoc(doc(db, "settings", "services"));
      const officesDoc = await getDoc(doc(db, "settings", "offices"));

      if (servicesDoc.exists()) {
        setServices(servicesDoc.data().services || []);
      }
      if (officesDoc.exists()) {
        setOffices(officesDoc.data().offices || []);
      }
    };
    fetchServicesAndOffices();
  }, []);

  // Save services to Firestore
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

  // Validate form
  const isFormValid = () => {
    return services.every(
      (service) => service.name?.trim() !== "" && service.office?.trim() !== ""
    );
  };

  // Handle changes in service name or office selection
  const handleServiceChange = (
    index: number,
    field: keyof Service,
    value: string
  ) => {
    setServices((prevServices) =>
      prevServices.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      )
    );
  };

  // Delete a service
  const deleteService = (index: number) =>
    setServices(services.filter((_, i) => i !== index));

  // Add a new service
  const addService = () =>
    setServices([
      ...services,
      {
        name: "",
        office: "",
      },
    ]);

  // Toggle edit mode
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

      {/* Display services */}
      {services.length > 0 &&
        services.map((service, index) => (
          <div key={index} className="flex gap-3">
            {isEditing ? (
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Service Name"
                  value={service.name}
                  onChange={(e) =>
                    handleServiceChange(index, "name", e.target.value)
                  }
                  className="p-2 text-sm border-primary border-2 rounded-sm w-80"
                />
                <select
                  value={service.office}
                  onChange={(e) =>
                    handleServiceChange(index, "office", e.target.value)
                  }
                  className="p-2 text-sm border-primary border-2 rounded-sm"
                >
                  <option value="">Select Office</option>
                  {offices?.map((office, i) => (
                    <option key={i} value={office?.name}>
                      {office?.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => deleteService(index)}
                  className="btn btn-sm rounded-sm text-white btn-error"
                >
                  Delete
                </button>
              </div>
            ) : (
              <table className="table w-full">
                <tbody>
                  <tr>
                    <td className="w-80">{service.name}</td>
                    <td>{service.office}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        ))}

      {/* Add service and save changes */}
      {isEditing && (
        <div className="mx-auto flex gap-5">
          <button
            onClick={addService}
            className="btn btn-sm rounded-none text-primary btn-outline"
          >
            Add Service
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