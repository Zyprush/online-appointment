"use client";
import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, limit} from "firebase/firestore";
import { db } from "@/firebase";
import { format } from "date-fns";
import Navbar from "@/components/topNavbar";

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
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const q = query(
          collection(db, "announce"),
          orderBy("isPriority", "desc"),
          orderBy("whenStart", "asc"),
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

  const handleOfficeClick = (office: string) => {
    setSelectedOffice(office);
  };

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
  ];

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

        <div className="mb-6">
          <div className="flex space-x-4">
            {offices.map((office) => (
              <button
                key={office}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 focus:outline-none"
                onClick={() => handleOfficeClick(office)}
              >
                {office}
              </button>
            ))}
          </div>
        </div>

        {selectedOffice && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-primary drop-shadow">
              {selectedOffice}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {announcements
                .filter((announce) => announce.isPriority && announce.office === selectedOffice)
                .map((announce) => (
                  <div
                    key={announce.id}
                    className="bg-white border border-gray-300 rounded-lg p-4"
                  >
                    <h3 className="font-bold text-lg text-gray-700 mb-2">
                      {announce.what}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <strong>Who:</strong> {announce.who}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Where:</strong> {announce.where}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>When:</strong> {format(new Date(announce.whenStart), "MMM dd, yyyy")} - {format(new Date(announce.whenEnd), "MMM dd, yyyy")}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announce;
