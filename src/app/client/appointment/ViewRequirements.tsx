import React from "react";
import "react-quill/dist/quill.snow.css";

interface Service {
  name: string;
  office?: string;
  officeCode?: string;
  phoneNumber?: string;
  requirements?: string;
}

interface ViewRequirementsProps {
  selectedService: string;
  services: Service[];
}

const ViewRequirements: React.FC<ViewRequirementsProps> = ({
  selectedService,
  services,
}) => {
  const service = services.find((s) => s.name === selectedService);

  if (!selectedService || !service?.requirements) {
    return null;
  }

  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="font-extrabold text-lg text-primary">Requirements/Instructions:</h3>
      <hr className="mb-4" />
      <div
        className="prose max-w-none quill-content text-sm"
        dangerouslySetInnerHTML={{ __html: service.requirements }}
      />
    </div>
  );
};

export default ViewRequirements;
