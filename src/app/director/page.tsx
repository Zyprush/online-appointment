"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { format } from "date-fns";
import DirectorRouteGuard from "@/components/DirectorRouteGuard";
import NavLayout from "@/components/NavLayout";

interface Announcement {
  id: string;
  what: string;
  whenStart: string;
  whenEnd: string;
  who: string;
  where: string;
  files: string[];
  createdAt: string;
  isPriority: boolean;
  status: string;
}

const PendingAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncements, setSelectedAnnouncements] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const fetchPendingAnnouncements = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(
      query(collection(db, "announce"), where("status", "==", "pending"))
    );
    const announcementsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Announcement[];
    setAnnouncements(announcementsData);
    setLoading(false);
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedAnnouncements((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const markAsApproved = async () => {
    try {
      for (const id of selectedAnnouncements) {
        const docRef = doc(db, "announce", id);
        await updateDoc(docRef, { status: "approved" });
      }
      alert("Selected announcements marked as approved.");
      setSelectedAnnouncements([]);
      fetchPendingAnnouncements();
    } catch (error) {
      console.error("Error updating announcements: ", error);
    }
  };

  const deleteSelectedAnnouncements = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete the selected announcements?"
    );
    if (confirmed) {
      try {
        for (const id of selectedAnnouncements) {
          await deleteDoc(doc(db, "announce", id));
        }
        alert("Selected announcements deleted successfully.");
        setSelectedAnnouncements([]);
        fetchPendingAnnouncements();
      } catch (error) {
        console.error("Error deleting announcements: ", error);
      }
    }
  };

  useEffect(() => {
    fetchPendingAnnouncements();
  }, []);

  return (
    <DirectorRouteGuard>
      <NavLayout>
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Pending Announcements</h1>

          <div className="flex gap-4 mb-4">
            <button
              onClick={markAsApproved}
              disabled={selectedAnnouncements.length === 0}
              className="btn-primary btn-sm btn text-xs font-base text-white px-4 rounded-none"
            >
              Mark as Approved
            </button>
            <button
              onClick={deleteSelectedAnnouncements}
              disabled={selectedAnnouncements.length === 0}
              className="btn-error btn-sm btn text-xs font-base text-white px-4 rounded-none"
            >
              Delete
            </button>
          </div>

          {loading ? (
            <span className="text-sm font-semibold flex items-center gap-3 text-zinc-600 border rounded-sm p-2 px-6">
              <span className="loading loading-spinner loading-md"></span>{" "}
              Loading pending announcements...
            </span>
          ) : announcements.length === 0 ? (
            <span className="text-sm font-semibold text-zinc-600 border rounded-sm p-2 px-6">
              No pending announcements available.
            </span>
          ) : (
            <table className="min-w-full bg-white shadow rounded-md border border-gray-300 border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-800 border-b border-gray-300">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setSelectedAnnouncements(
                          e.target.checked
                            ? announcements.map((announce) => announce.id)
                            : []
                        )
                      }
                      checked={
                        announcements.length > 0 &&
                        selectedAnnouncements.length === announcements.length
                      }
                    />
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-800 border-b border-gray-300">
                    What
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-800 border-b border-gray-300">
                    When
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-800 border-b border-gray-300">
                    Who
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-800 border-b border-gray-300">
                    Where
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-800 border-b border-gray-300">
                    Attachments
                  </th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((announce) => (
                  <tr
                    key={announce.id}
                    className="text-xs text-start align-top"
                  >
                    <td className="p-4 border-b border-gray-300 align-top">
                      <input
                        type="checkbox"
                        checked={selectedAnnouncements.includes(announce.id)}
                        onChange={() => handleCheckboxChange(announce.id)}
                      />
                    </td>
                    <td className="p-4 border-b border-gray-300 align-top w-40 font-bold">
                      {announce.what}
                    </td>
                    <td className="p-4 border-b border-gray-300 align-top">
                      {format(
                        new Date(announce.whenStart),
                        "MMM dd, yyyy 'at' hh:mm a"
                      )}{" "}
                      -{" "}
                      {format(
                        new Date(announce.whenEnd),
                        "MMM dd, yyyy 'at' hh:mm a"
                      )}
                    </td>
                    <td className="p-4 border-b border-gray-300 align-top">
                      {announce.who}
                    </td>
                    <td className="p-4 border-b border-gray-300 align-top">
                      {announce.where}
                    </td>
                    <td className="p-4 border-b border-gray-300 align-top w-40 font-bold">
                      {announce.files.length > 0 ? (
                        <ul className="list-none pl-5">
                          {announce.files.map((file, index) => (
                            <li key={index}>
                              <a
                                href={file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500"
                              >
                                File {index + 1}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "No files"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </NavLayout>
    </DirectorRouteGuard>
  );
};

export default PendingAnnouncements;
