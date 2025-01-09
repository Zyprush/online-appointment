import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase";
import { useOffice } from "@/hooks/useOffice";

interface AddAnnounceProps {
  onClose: () => void; // Prop to handle modal close
}

const AddAnnounce: React.FC<AddAnnounceProps> = ({ onClose }) => {
  const [what, setWhat] = useState("");
  const [whenStart, setWhenStart] = useState("");
  const [whenEnd, setWhenEnd] = useState("");
  const [who, setWho] = useState("");
  const [where, setWhere] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPriority, setIsPriority] = useState(false);
  const officeData = useOffice();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!what || !whenStart || !whenEnd || !who || !where) {
      setError("All fields are required.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const uploadedFiles: string[] = [];

      if (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileRef = ref(storage, `announcements/${file.name}`);
          await uploadBytes(fileRef, file);
          const downloadURL = await getDownloadURL(fileRef);
          uploadedFiles.push(downloadURL);
        }
      }
      const currentTime = new Date().toISOString(); // Get current time in ISO format
      await addDoc(collection(db, "announce"), {
        what,
        whenStart,
        whenEnd,
        who,
        where,
        files: uploadedFiles,
        createdAt: currentTime,
        isPriority,
        office: officeData?.office,
        status: "pending",
      });

      setWhat("");
      setWhenStart("");
      setWhenEnd("");
      setWho("");
      setWhere("");
      setFiles(null);
      onClose(); // Close the modal after successful submission
    } catch (err) {
      setError("Failed to submit announcement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 w-full h-full bg-zinc-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg p-6 shadow-lg w-full md:max-w-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition duration-150"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mt-10 md:mt-0 mb-4 text-primary  drop-shadow">
          Add Announcement
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="what">
              What:
            </label>
            <input
              type="text"
              value={what}
              onChange={(e) => setWhat(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="what"
            />
          </div>
          <label className="block text-sm font-bold mr-4" htmlFor="when-start">
            When:
          </label>
          <div className="mb-4 flex flex-col md:flex-row items-center">
            <input
              type="datetime-local"
              value={whenStart}
              onChange={(e) => setWhenStart(e.target.value)}
              required
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:mr-2"
              id="when-start"
            />
            <span className="text-gray-600">to</span>
            <input
              type="datetime-local"
              value={whenEnd}
              onChange={(e) => setWhenEnd(e.target.value)}
              required
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-2"
              id="when-end"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="who">
              Who:
            </label>
            <input
              type="text"
              value={who}
              onChange={(e) => setWho(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="who"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="where">
              Where:
            </label>
            <input
              type="text"
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="where"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="files">
              Attach Files:
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="files"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="priority">
              Priority:
            </label>
            <input
              type="checkbox"
              checked={isPriority}
              onChange={(e) => setIsPriority(e.target.checked)}
              className="shadow appearance-none border rounded h-4 w-4 p-2 focus:outline-none focus:shadow-outline"
              id="priority"
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAnnounce;
