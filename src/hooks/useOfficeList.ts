import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

interface Option {
  name: string;
  office?: string;
  phoneNumber?: string;
  officeCode?: string;
  requirements?: string;
}

const useOfficeList = (docId: string, field: string) => {
  const [data, setData] = useState<Option[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "settings", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData(docSnap.data()[field] || []);
        }
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      }
    };

    fetchData();
  }, [docId, field]);

  return data;
};

export default useOfficeList;
