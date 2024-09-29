import React, { useState, useEffect } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

const Reminder = () => {
  const [reminderContent, setReminderContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReminder = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "settings", "reminder");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setReminderContent(docSnap.data().value);
        } else {
          setReminderContent(null);
        }
      } catch (error) {
        console.error("Error fetching reminder:", error);
        setReminderContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReminder();
  }, []);

  if (loading) {
    return (
      <div className="bg-teal-300 p-5 rounded-lg my-6">
        <h3 className="font-bold text-lg">Reminder</h3>
        <p className="mt-2">Loading...</p>
      </div>
    );
  }

  if (!reminderContent) {
    return null; // Don't render anything if there's no reminder
  }

  return (
    <div className="bg-teal-300 p-5 rounded-lg my-6">
      <h3 className="font-bold text-lg">Reminder</h3>
      <div 
        className="mt-2 reminder-content"
        dangerouslySetInnerHTML={{ __html: reminderContent }}
      />
    </div>
  );
};

export default Reminder;