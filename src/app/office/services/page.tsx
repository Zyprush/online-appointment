import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import RequirementsModal from "@/app/admin/setting/RequirementsModal";
import NavLayout from "@/components/NavLayout";

interface Office {
  name: string;
  phoneNumber: string;
  designatedPersonnel: string;
}

interface Service {
  name: string;
  office: string;
  requirements: string;
}

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    return services.every(
      (service) => service.name?.trim() !== "" && service.office?.trim() !== ""
    );
  };

  const handleServiceChange = (
    index: number,
    field: keyof Service,
    value: string
  ) => {
    setServices((prevServices) =>
      prevServices.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const handleRequirementsChange = (requirements: string) => {
    if (!selectedService) return;

    const serviceIndex = services.findIndex(
      (s) => s.name === selectedService.name
    );
    if (serviceIndex === -1) return;

    setServices(
      services.map((service, index) =>
        index === serviceIndex ? { ...service, requirements } : service
      )
    );
  };

  const deleteService = (index: number) =>
    setServices(services.filter((_, i) => i !== index));

  const addService = () =>
    setServices([
      ...services,
      {
        name: "",
        office: "",
        requirements: "",
      },
    ]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const openRequirementsModal = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <NavLayout>
      <div className="bg-white col-span-2 p-5 rounded-lg border flex flex-col gap-3 text-zinc-600">
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
                    onClick={() => openRequirementsModal(service)}
                    className="btn btn-sm btn-primary text-white rounded-sm"
                  >
                    Requirements
                  </button>
                  <button
                    onClick={() => deleteService(index)}
                    className="btn btn-sm rounded-sm text-white btn-error"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <div className="w-full">
                  <table className="table w-full">
                    <tbody>
                      <tr>
                        <td className="w-80">{service.name}</td>
                        <td>{service.office}</td>
                        <td className="text-right">
                          <button
                            onClick={() => openRequirementsModal(service)}
                            className="btn btn-sm btn-primary text-white rounded-sm"
                          >
                            View Requirements
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}

        {selectedService && (
          <RequirementsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            service={selectedService}
            isEditing={isEditing}
            onSave={handleRequirementsChange}
          />
        )}
      </div>
    </NavLayout>
  );
};

export default Services;
