"use client";
import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, limit, where } from "firebase/firestore";
import { db } from "@/firebase";
import { format } from "date-fns";
import Navbar from "@/components/topNavbar";
import { getRelativeTime } from "@/helper/time";

interface Announcement {
  id: string;
  office: string;
  what: string;
  whenStart: string;
  whenEnd: string;
  who: string;
  where: string;
  createdAt: string;
  files: string[];
  isPriority: boolean;
}

const Announce: React.FC = (): JSX.Element => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [officeFilter, setOfficeFilter] = useState<string | null>(null);
  const offices = [
    "Registrar Office",
    "Cashier",
    "Admission & Guidance",
    "Student Affairs and Services",
    "BSIT Faculty",
    "BEED Faculty",
    "BSBA OM Faculty",
    "BSBA FM Faculty",
    "BSOA Faculty",
  ]

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        let q = query(
          collection(db, "announce"),
          where("office", "in", [
            "Registrar Office",
            "Cashier",
            "Admission & Guidance",
            "Student Affairs and Services",
            "BSIT Faculty",
            "BEED Faculty",
            "BSBA OM Faculty",
            "BSBA FM Faculty",
            "BSOA Faculty",
          ]),
          orderBy("isPriority", "desc"),
          orderBy("whenStart", "asc"),
          limit(30)
        );

        if (officeFilter) {
          q = query(q, where("office", "==", officeFilter));
        }

        const querySnapshot = await getDocs(q);
        const fetchedAnnouncements: Announcement[] = querySnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        ) as Announcement[];

        setAnnouncements(fetchedAnnouncements);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError("Failed to fetch announcements.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [officeFilter]);

  const openModal = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
  };

  const handleOfficeFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOfficeFilter(event.target.value === "All" ? null : event.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 md:px-12 py-16 bg-white">
      <Navbar />
      <div className="md:p-4 pt-0 w-full max-w-7xl">
        {loading && <p>Loading announcements...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && announcements.length === 0 && (
          <p>No announcements available.</p>
        )}

        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-bold text-primary drop-shadow">
            Announcements
          </h2>
        </div>

        <div className="flex items-center mb-6">
          {["All", ...offices].map((office) => (
            <button
              className={`inline-flex items-center justify-center px-4 py-2 mr-2 border border-transparent rounded-md shadow-sm text-base font-medium ${
                officeFilter === office
                  ? "bg-primary text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
                  : "bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              }`}
              onClick={() => handleOfficeFilterChange({ target: { value: office } } as React.ChangeEvent<HTMLSelectElement>)}
              key={office}
            >
              {office}
            </button>
          ))}
        </div>

        {!loading && !error && announcements.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map((announce) => (
              <div
                className="flex flex-col items-start mb-6 p-4 bg-white border-2 border-gray-200 rounded-lg hover:shadow-lg cursor-pointer"
                key={announce.id}
                onClick={() => openModal(announce)}
              >
                {announce.files.length > 0 && (
                  <div className="flex justify-center mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={announce.files[0]}
                      alt="Announcement"
                      className="h-48 w-full object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="flex-1 w-full">
                  <h3 className="font-bold text-lg text-gray-700 mb-2">
                    {announce.office}
                  </h3>
                  <h3 className="font-bold text-lg text-gray-700 mb-2">
                    {announce.what}
                  </h3>
                  <div className="text-xs text-gray-500 mb-1">
                    {getRelativeTime(announce.createdAt)}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Who:</strong> {announce.who}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Where:</strong> {announce.where}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>When:</strong> {format(new Date(announce.whenStart), "MMM dd, yyyy")} - {format(new Date(announce.whenEnd), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && selectedAnnouncement && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div className="bg-white rounded-lg p-8 w-11/12 md:w-3/5 lg:w-2/5 max-w-2xl relative shadow-2xl">
              {/* Close Button */}
              <button
                onClick={closeModal}
                aria-label="Close announcement"
                className="absolute top-3 right-3 text-2xl text-gray-600 hover:text-gray-800 transition duration-200 focus:outline-none"
              >
                &times;
              </button>

              {/* Announcement Title */}
              <h3 className="text-2xl font-bold mb-5 text-primary">
                {selectedAnnouncement.what}
              </h3>

              {/* Announcement Details */}
              <div className="space-y-3 mb-6 text-gray-700">
                <p className="text-sm">
                  <strong className="text-primary-500">When:</strong>{" "}
                  {format(new Date(selectedAnnouncement.whenStart), "MMM dd, yyyy")} - {format(new Date(selectedAnnouncement.whenEnd), "MMM dd, yyyy")}
                </p>
                <p className="text-sm">
                  <strong className="text-primary-500">Who:</strong>{" "}
                  {selectedAnnouncement.who}
                </p>
                <p className="text-sm">
                  <strong className="text-primary-500">Where:</strong>{" "}
                  {selectedAnnouncement.where}
                </p>
              </div>

              {/* Attached Files Section */}
              {selectedAnnouncement.files.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-600 mb-3">
                    Attached Files
                  </h4>
                  <ul className="flex flex-wrap gap-4">
                    {selectedAnnouncement.files.map((file, index) => (
                      <li
                        key={index}
                        className="w-24 h-24 border border-gray-200 rounded-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                      >
                        <a
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full h-full"
                          aria-label={`Open document ${index + 1}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={file}
                            alt={`Document ${index}`}
                            className="object-cover w-full h-full"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announce;
