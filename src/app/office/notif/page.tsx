// pages/notifs/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useNotifs } from "@/hooks/useNotif";
import OfficeRouteGuard from "@/components/OfficeRouteGuard";
import NavLayout from "@/components/NavLayout";
import { useOffice } from "@/hooks/useOffice";

const NotificationsPage = () => {
  const { notifs, loadingNotifs, fetchNotifsByOffice, deleteNotif } = useNotifs();
  const [selectedNotifs, setSelectedNotifs] = useState<string[]>([]);
  const officeData = useOffice();
  useEffect(() => {
    if (officeData?.office) {
      fetchNotifsByOffice(officeData.office);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchNotifsByOffice, officeData]);

  // Handle selection of notifications
  const toggleSelectNotif = (id: string) => {
    setSelectedNotifs((prev) =>
      prev.includes(id) ? prev.filter((notifId) => notifId !== id) : [...prev, id]
    );
  };

  // Handle delete selected notifications
  const handleDeleteSelected = async () => {
    for (const notifId of selectedNotifs) {
      await deleteNotif(notifId);
    }
    setSelectedNotifs([]);
  };

  // Handle mark selected as seen
  const handleMarkAsRead = async () => {
    // Update seen status in Firestore (you'll need to add this function to useNotifs)
    // For now, mock functionality
    console.log("Mark as read for:", selectedNotifs);
    setSelectedNotifs([]);
  };

  return (
    <OfficeRouteGuard>
      <NavLayout>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Notifications</h1>

          <div className="mb-4 flex gap-2">
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
              disabled={!selectedNotifs.length}
            >
              Delete Selected
            </button>
            <button
              onClick={handleMarkAsRead}
              className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
              disabled={!selectedNotifs.length}
            >
              Mark as Read
            </button>
          </div>

          {loadingNotifs ? (
            <p>Loading notifications...</p>
          ) : notifs && notifs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {notifs.map((notif) => (
                <div
                  key={notif.id}
                  className={`border border-gray-300 rounded-lg p-4 ${
                    selectedNotifs.includes(notif.id) ? "bg-gray-200" : ""
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <input
                      type="checkbox"
                      checked={selectedNotifs.includes(notif.id)}
                      onChange={() => toggleSelectNotif(notif.id)}
                      className="mr-2"
                    />
                    <span
                      className={`text-sm ${
                        notif.seen ? "text-green-500" : "font-bold text-red-500"
                      }`}
                    >
                      {notif.seen ? "" : "New"}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold mt-2">{notif.name}</h4>
                  <p className="text-sm">{notif.text}</p>
                  <p className="text-sm text-gray-500">{notif.date}</p>
                  <p className="text-sm text-gray-500">{notif.office}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No notifications available.</p>
          )}
        </div>
      </NavLayout>
    </OfficeRouteGuard>
  );
};

export default NotificationsPage;