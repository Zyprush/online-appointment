"use client";
import NavLayout from "@/components/NavLayout";
import { useUserData } from "@/hooks/useUserData";
import { useFeedback } from "@/hooks/useFeedback";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const Feedback = () => {
  const { uid } = useUserData();
  const { feedbacks, loadingFeedbacks, fetchFeedbacks } = useFeedback();
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    if (uid) {
      fetchFeedbacks(uid);
    }
  }, [uid, fetchFeedbacks]);

  const handleToggleCompleted = () => {
    setShowCompleted(!showCompleted);
  };

  // Filter feedbacks based on completion status
  const filteredFeedbacks = feedbacks?.filter(
    (feedback) => feedback.completed === showCompleted
  );

  // Count incomplete feedbacks for the indicator
  const incompleteCount =
    feedbacks?.filter((feedback) => !feedback.completed).length || 0;

  return (
    <NavLayout>
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-3 text-primary">
          Feedback{" "}
          {incompleteCount > 0 && (
            <span className=" text-sm text-error italic font-semibold">
              number of feedbacks you did not complete: {incompleteCount}
            </span>
          )}
        </h1>
        <div className="mb-4 flex gap-4">
          <button
            onClick={() => setShowCompleted(false)}
            className={`px-4 py-2 rounded ${
              !showCompleted
                ? "bg-primary text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            Incomplete
          </button>
          <button
            onClick={handleToggleCompleted}
            className={`px-4 py-2 rounded ${
              showCompleted
                ? "bg-primary text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            Completed
          </button>
        </div>

        {loadingFeedbacks ? (
          <p>Loading feedback...</p>
        ) : filteredFeedbacks && filteredFeedbacks.length > 0 ? (
          <ul>
            {filteredFeedbacks.map((feedback) => (
              <li key={feedback.id} className="border-b py-2">
                <p>
                  <strong>Office:</strong> {feedback.office}
                </p>
                <p>
                  <strong>Date:</strong> {feedback.date}
                </p>
                <p>
                  <strong>Completed:</strong>{" "}
                  {feedback.completed ? "Yes" : "No"}
                </p>
                {!showCompleted && (
                  <Link
                    href={`/client/feedback/${feedback.id}`}
                    className="btn btn-sm btn-primary text-white rounded-sm"
                  >
                    Provide Feedback
                  </Link>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No feedback found.</p>
        )}
      </div>
    </NavLayout>
  );
};

export default Feedback;
