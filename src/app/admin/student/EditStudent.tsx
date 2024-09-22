import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

interface User {
  id: string;
  fullName: string;
  studentId: string;
  email: string;
  birthday: string;
  contact: string;
  course: string;
  role: string;
}

interface EditStudentProps {
  student: User;
  onClose: () => void;
  onUpdate: (updatedStudent: User) => void;
}

const EditStudent: React.FC<EditStudentProps> = ({
  student,
  onClose,
  onUpdate,
}) => {
  const [editedStudent, setEditedStudent] = useState<User>({ ...student });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const contactRegex = /^9\d{9}$/;
    if (!contactRegex.test(editedStudent.contact)) {
      alert('Contact number must be 10 digits and start with "9".');
      setLoading(false);
      return;
    }
    try {
      const userRef = doc(db, "users", student.id);
      await updateDoc(userRef, {
        fullName: editedStudent.fullName,
        studentId: editedStudent.studentId,
        birthday: editedStudent.birthday,
        contact: editedStudent.contact,
        course: editedStudent.course,
      });

      onUpdate(editedStudent);
      onClose();
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-4">Edit Student</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="fullName"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={editedStudent.fullName}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="studentId"
            >
              Student ID
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={editedStudent.studentId}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email (Not Editable)
            </label>
            <input
              type="email"
              id="email"
              value={editedStudent.email}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
              disabled
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="birthday"
            >
              Birthday
            </label>
            <input
              type="date"
              id="birthday"
              name="birthday"
              value={editedStudent.birthday}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="contact"
            >
              Contact
            </label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={editedStudent.contact}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              placeholder="Contact Number"
              maxLength={10}
              pattern="[0-9]{10}"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="course"
            >
              Course
            </label>
            <input
              type="text"
              id="course"
              name="course"
              value={editedStudent.course}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;
