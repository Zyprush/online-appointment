"use client";
import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import RequirementsModal from "@/app/admin/setting/RequirementsModal";
import NavLayout from "@/components/NavLayout";
import { useOffice } from "@/hooks/useOffice";


interface Service {
  name: string;
  office: string;
  requirements: string;
}

const OfficeServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const officeData = useOffice();

  useEffect(() => {
    const fetchServicesAndOffices = async () => {
      const servicesDoc = await getDoc(doc(db, "settings", "services"));

      if (servicesDoc.exists()) {
        setServices(servicesDoc.data().services || []);
      }

    };
    fetchServicesAndOffices();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      (service) => service.name?.trim() !== "" 
      // && service.office?.trim() !== ""
    );
  };

  const handleServiceChange = (
    index: number,
    field: keyof Service,
    value: string
  ) => {
    setServices((prevServices) =>
      prevServices.map((s, i) => {
        if (i === index && s.office === officeData?.office) {
          return { ...s, [field]: value };
        }
        return s; // Return unchanged service if office doesn't match
      })
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
      {
        name: "",
        office: officeData?.office || "Office",
        requirements: "",
      },
      ...services,
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
                  <input
                    type="text"
                    value={service.office}
                    readOnly
                    disabled
                    className="p-2 text-sm border-primary opacity-50 border-2 rounded-sm w-80"
                  />
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

export default OfficeServices;
