// pages/notifs/page.tsx
"use client";
import { useEffect } from "react";
import { useNotifs } from "@/hooks/useNotif";
import OfficeRouteGuard from "@/components/OfficeRouteGuard";
import NavLayout from "@/components/NavLayout";

const NotificationsPage = () => {
  const { notifs, loadingNotifs, fetchNotifsByOffice } = useNotifs();
  // Fetch the logged-in office's name

  useEffect(() => {
    fetchNotifsByOffice("Cashier");
  }, [fetchNotifsByOffice]);

  return (
    <OfficeRouteGuard>
      <NavLayout>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Notifications</h1>
          {loadingNotifs ? (
            <p>Loading notifications...</p>
          ) : notifs && notifs.length > 0 ? (
            <ul className="space-y-4">
              {notifs.map((notif) => (
                <li
                  key={notif.id}
                  className="p-4 bg-white shadow rounded border border-gray-200"
                >
                  <h2 className="text-lg font-semibold">{notif.name}</h2>
                  <p className="text-gray-600">{notif.text}</p>
                  <p className="text-sm text-gray-400">{notif.date}</p>
                  <p className="text-sm text-gray-500 italic">
                    Office: {notif.office}
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      notif.seen ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {notif.seen ? "Seen" : "Unseen"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No notifications available.</p>
          )}
        </div>
      </NavLayout>
    </OfficeRouteGuard>
  );
};

export default NotificationsPage;
