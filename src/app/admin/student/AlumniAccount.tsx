"use client"
import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, updateDoc, query, where } from 'firebase/firestore'
import { db } from '@/firebase'
import ViewStudent from './ViewStudent' // Import the ViewStudent modal
import EditStudent from './EditStudent' // Import the EditStudent modal

// Define a type for user data
interface User {
  id: string;
  fullName: string;
  studentId: string;
  email: string;
  birthday: string;
  phone: string;
  course: string;
  role: string;
}

const AlumniAccount: React.FC = () => {
  const [students, setStudents] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [studentToEdit, setStudentToEdit] = useState<User | null>(null)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const q = query(collection(db, 'users'), where("role", "==", "alumni"))
        const querySnapshot = await getDocs(q)
        const studentList: User[] = querySnapshot.docs.map((doc) => ({
          ...doc.data() as User,
          id: doc.id,
        }))
        setStudents(studentList)
      } catch (err) {
        console.error('Error fetching student data: ', err)
      }
    }

    fetchStudents()
  }, [])

  const filteredStudents = students.filter((student) =>
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const changeToStudent = async (e: React.MouseEvent, student: User) => {
    e.stopPropagation() // Prevent modal from opening when clicking the button
    if (!window.confirm(`Are you sure you want to change ${student.fullName}'s account back to student?`)) {
      return
    }

    setLoading(student.id)
    try {
      const userRef = doc(db, 'users', student.id)
      
      // Update the role to "student"
      await updateDoc(userRef, { role: 'student' })

      alert(`${student.fullName}'s account has been changed to student successfully.`)
      
      // Update the local state
      setStudents(students.filter(s => s.id !== student.id))
    } catch (err) {
      console.error('Error changing student status: ', err)
      alert(`Failed to change ${student.fullName}'s account status. Please try again.`)
    } finally {
      setLoading(null)
    }
  }

  // Function to handle opening the view modal
  const handleOpenModal = (student: User) => {
    setSelectedStudent(student)
    setShowModal(true)
  }

  // Function to handle closing the view modal
  const handleCloseModal = () => {
    setSelectedStudent(null)
    setShowModal(false)
  }

  // Function to handle opening the edit modal
  const handleEditClick = (e: React.MouseEvent, student: User) => {
    e.stopPropagation()
    setStudentToEdit(student)
    setShowEditModal(true)
  }

  // Function to handle updating student information
  const handleUpdateStudent = (updatedStudent: User) => {
    setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s))
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Alumni Accounts</h1>

      <input
        type="text"
        placeholder="Search by name or student ID"
        className="mb-4 p-2 border border-gray-300 rounded-md w-full max-w-xs"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200">Student ID</th>
              <th className="py-2 px-4 border-b border-gray-200">Full Name</th>
              <th className="py-2 px-4 border-b border-gray-200">Email</th>
              <th className="py-2 px-4 border-b border-gray-200">Birthday</th>
              <th className="py-2 px-4 border-b border-gray-200">Phone</th>
              <th className="py-2 px-4 border-b border-gray-200">Course</th>
              <th className="py-2 px-4 border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id} onClick={() => handleOpenModal(student)} className="cursor-pointer hover:bg-gray-100">
                  <td className="py-2 px-4 border-b border-gray-200">{student.studentId}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{student.fullName}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{student.email}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{student.birthday}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{student.phone}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{student.course}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                      onClick={(e) => handleEditClick(e, student)}
                    >
                      Edit
                    </button>
                    <button
                      className={`ml-2 px-4 py-2 bg-secondary text-white rounded ${loading === student.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={(e) => changeToStudent(e, student)}
                      disabled={loading === student.id}
                    >
                      {loading === student.id ? 'Changing...' : 'Change to Student'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-gray-500">No alumni found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ViewStudent Modal */}
      {showModal && selectedStudent && (
        <ViewStudent student={selectedStudent} onClose={handleCloseModal} />
      )}

      {/* EditStudent Modal */}
      {showEditModal && studentToEdit && (
        <EditStudent
          student={studentToEdit}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateStudent}
        />
      )}
    </div>
  )
}

export default AlumniAccount
