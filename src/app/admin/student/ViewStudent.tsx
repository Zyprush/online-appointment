import React from "react";

interface Student {
  id: string;
  fullName: string;
  studentId: string;
  email: string;
  birthday: string;
  phone: string;
  course: string;
  role: string;
}

interface ViewStudentProps {
  student: Student | null;
  onClose: () => void;
}

const ViewStudent: React.FC<ViewStudentProps> = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Student Details</h2>
        <div className="space-y-4">
          <div>
            <strong>Student ID:</strong> {student.studentId}
          </div>
          <div>
            <strong>Full Name:</strong> {student.fullName}
          </div>
          <div>
            <strong>Email:</strong> {student.email}
          </div>
          <div>
            <strong>Birthday:</strong> {student.birthday}
          </div>
          <div>
            <strong>Phone:</strong> {student.phone}
          </div>
          <div>
            <strong>Course:</strong> {student.course}
          </div>
          <div>
            <strong>Role:</strong> {student.role}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="btn btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewStudent;