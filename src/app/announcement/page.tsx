"use client";
import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, limit } from "firebase/firestore";
import { db } from "@/firebase";
import { format } from "date-fns";
import Navbar from "@/components/topNavbar";
import { getRelativeTime } from "@/helper/time";

interface Announcement {
  id: string;
  what: string;
  when: string;
  who: string;
  where: string;
  createdAt: string;
  files: string[];
}

const Announce: React.FC = (): JSX.Element => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const q = query(
          collection(db, "announce"),
          orderBy("when", "desc"),
          limit(30)
        );

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
  }, []);

  const openModal = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
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

        {!loading && !error && announcements.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map((announce) => (
              <div
                className="flex flex-col items-start mb-6 p-4 bg-zinc-100 border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
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
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && selectedAnnouncement && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-11/12 md:w-2/3 lg:w-1/2 max-w-4xl relative shadow-lg">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                {selectedAnnouncement.what}
              </h3>

              <div className="flex flex-col space-y-2">
                <p className="text-sm">
                  <strong>When:</strong>{" "}
                  {format(new Date(selectedAnnouncement.when), "MMM dd, yyyy")}
                </p>
                <p className="text-sm">
                  <strong>Who:</strong> {selectedAnnouncement.who}
                </p>
                <p className="text-sm">
                  <strong>Where:</strong> {selectedAnnouncement.where}
                </p>
              </div>

              {selectedAnnouncement.files.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-bold mb-2 text-gray-600 text-sm">
                    Attached Files
                  </h4>
                  <ul className="flex flex-wrap">
                    {selectedAnnouncement.files.map((file, index) => (
                      <li key={index} className="mr-2 mb-2">
                        <a
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={file}
                            alt={`Document ${index}`}
                            className="h-32 w-32 object-cover rounded border border-gray-300"
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
