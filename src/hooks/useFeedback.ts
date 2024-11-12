import { useState, useCallback } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";

interface Feedback {
  id: string;
  clientId: string;
  date: string;
  office: string;
  completed: boolean;
  SQDO0?: number;
  SQDO1?: number;
  SQDO2?: number;
  SQDO3?: number;
  SQDO4?: number;
  SQDO5?: number;
  SQDO6?: number;
  SQDO7?: number;
  SQDO8?: number;
}

export const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<Array<Feedback> | null>(null);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);

  const addFeedback = useCallback(async (data: Omit<Feedback, "id">) => {
    setLoadingFeedbacks(true);
    try {
      const submittedDoc = await addDoc(collection(db, "feedbacks"), data);
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks
          ? [...prevFeedbacks, { id: submittedDoc.id, ...data }]
          : [{ id: submittedDoc.id, ...data }]
      );
    } catch (error) {
      console.log("Error adding feedback:", error);
    } finally {
      setLoadingFeedbacks(false);
    }
  }, []);

  const fetchFeedbacks = useCallback(async (id: string) => {
    setLoadingFeedbacks(true);
    try {
      const feedbacksQuery = query(
        collection(db, "feedbacks"),
        orderBy("date", "desc"),
        where("clientId", "==", id)
      );
      const feedbacksDocSnap = await getDocs(feedbacksQuery);
      const allFeedbacks = feedbacksDocSnap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Feedback, "id">),
      }));
      setFeedbacks(allFeedbacks);
    } catch (error) {
      console.log("Error fetching feedbacks by admin:", error);
    } finally {
      setLoadingFeedbacks(false);
    }
  }, []);

  const answerFeedback = useCallback(async (feedbackId: string, answers: Partial<Feedback>) => {
    setLoadingFeedbacks(true);
    try {
      const feedbackRef = doc(db, "feedbacks", feedbackId);
      await updateDoc(feedbackRef, answers);
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks
          ? prevFeedbacks.map((feedback) =>
              feedback.id === feedbackId ? { ...feedback, ...answers } : feedback
            )
          : null
      );
    } catch (error) {
      console.log("Error updating feedback:", error);
    } finally {
      setLoadingFeedbacks(false);
    }
  }, []);

  return {
    feedbacks,
    loadingFeedbacks,
    addFeedback,
    fetchFeedbacks,
    answerFeedback,
  };
};
