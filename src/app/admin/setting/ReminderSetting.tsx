"use client";
import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

const ReminderSetting: React.FC = (): JSX.Element => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newValue, setNewValue] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchSetting = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "settings", "reminder");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setValue(docSnap.data().value);
        } else {
          setValue(null);
        }
      } catch (error) {
        console.error("Error fetching setting:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSetting();
  }, []);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setNewValue(value || "");
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewValue(event.target.value);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "settings", "reminder"), { value: newValue });
      setValue(newValue);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving setting:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewValue(value || "");
  };

  return (
    <div className="flex flex-col items-center justify-apart w-full p-5 group bg-white text-zinc-600">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {isEditing ? (
            <div className="flex w-full flex-col justify-start gap-5 items-start my-auto">
              <p className="font-semibold text-primary text-sm">Reminder</p>
              <textarea
                value={newValue}
                onChange={handleChange}
                placeholder="Enter reminder"
                className="w-full h-40 p-2 border border-gray-300 rounded"
                disabled={isSaving}
              />
              <div className="flex gap-2 mt-10 mr-0 ml-auto">
                <button
                  onClick={handleCancel}
                  className="btn btn-sm btn-outline text-secondary rounded-sm"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn btn-primary btn-sm rounded-sm text-white"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex w-full justify-start my-auto gap-5 items-center">
              <p className="font-bold mb-auto mt-0 text-primary">Reminder</p>
              <div
                className="text-sm text-zinc-500 ml-0 w-full rounded-sm min-w-80 p-2 bg-slate-100 reminder-content"
                dangerouslySetInnerHTML={{ __html: value || "No data for Reminder" }}
              />
              <button
                onClick={toggleEdit}
                className="btn btn-outline btn-sm rounded-sm text-primary mx-auto hover:text-secondary ml-auto mb-auto mt-0 mr-0"
              >
                Edit
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReminderSetting;
