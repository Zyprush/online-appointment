import { useState, useCallback } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";

// Define the Notif interface with 'date' and 'name' properties
interface Notif {
  id: string;
  date: string;  // Date and time of the notif
  name: string; // Name associated with the notif
  text: string;
  office: string; // Office who performed the notif
  seen: boolean;
}

// Custom hook for notifs
export const useNotifs = () => {
  const [notifs, setNotifs] = useState<Array<Notif> | null>(null);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  // Function to add a new notif
  const addNotif = useCallback(async (data: Omit<Notif, 'id'>) => {
    setLoadingNotifs(true);
    try {
      const submittedDoc = await addDoc(collection(db, "notifs"), data);
      console.log("Notif added successfully");
      setNotifs((prevNotifs) =>
        prevNotifs ? [...prevNotifs, { id: submittedDoc.id, ...data }] : [{ id: submittedDoc.id, ...data }]
      );
    } catch (error) {
      console.log("Error adding notif:", error);
    } finally {
      setLoadingNotifs(false);
    }
  }, []);

  // Function to fetch notifs by office
  const fetchNotifsByOffice = useCallback(
    async (office: string) => {
      setLoadingNotifs(true);
      try {
        // Fetch notifs filtered by office and ordered by 'date'
        const notifsQuery = query(
          collection(db, "notifs"),
          where("office", "==", office),
          orderBy("date", "desc")
        );
        const notifsDocSnap = await getDocs(notifsQuery);

        // Map through notifs and update state
        const allNotifs = notifsDocSnap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Notif, "id">), // Ensure the fetched data matches the Notif type
        }));

        setNotifs(allNotifs);
      } catch (error) {
        console.log("Error fetching notifs by office:", error);
      } finally {
        setLoadingNotifs(false);
      }
    },
    []
  );

  const deleteNotif = useCallback(async (notifId: string) => {
    try {
      await deleteDoc(doc(db, "notifs", notifId));
      setNotifs((prevNotifs) => 
        prevNotifs ? prevNotifs.filter((notif) => notif.id !== notifId) : null
      );
      return true;
    } catch (error) {
      console.error("Error deleting notif:", error);
      return false;
    }
  }, []);

  return { notifs, loadingNotifs, addNotif, deleteNotif, fetchNotifsByOffice };
};
