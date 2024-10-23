import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Dynamic import of ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

// Quill modules configuration
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "color",
  "background",
];

interface Service {
  name: string;
  office: string;
  requirements: string;
}

interface RequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  isEditing: boolean;
  onSave: (requirements: string) => void;
}

const RequirementsModal: React.FC<RequirementsModalProps> = ({
  isOpen,
  onClose,
  service,
  isEditing,
  onSave,
}) => {
  const [requirements, setRequirements] = useState(service.requirements || "");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[800px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{service.name} - Requirements</h2>

        {isEditing ? (
          <div className="h-[400px] mb-4">
            <ReactQuill
              theme="snow"
              value={requirements}
              onChange={setRequirements}
              modules={quillModules}
              formats={quillFormats}
              className="h-[300px]"
            />
          </div>
        ) : (
          <div
            className="prose max-w-none quill-content"
            dangerouslySetInnerHTML={{ __html: requirements }}
          />
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="btn btn-sm btn-outline rounded-sm">
            Close
          </button>
          {isEditing && (
            <button
              onClick={() => {
                onSave(requirements);
                onClose();
              }}
              className="btn btn-sm btn-primary text-white rounded-sm"
            >
              Save Requirements
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequirementsModal;