"use client"
import React, { useEffect, useState } from 'react'
import { collection, getDocs, doc, deleteDoc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase'

// Define a type for student data
interface Student {
  id: string;
  fullName: string;
  studentId: string;
  email: string;
  birthday: string;
  phone: string;
  course: string;
}

const StudentAccount = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState<string | null>(null) // Loading state for specific student

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'students'))
        const studentList: Student[] = querySnapshot.docs.map((doc) => {
          const data = doc.data() as Student;
          return {
            ...data, // Document data
            id: doc.id, // Document ID
          };
        })
        setStudents(studentList)
      } catch (err) {
        console.error('Error fetching student data: ', err)
      }
    }

    fetchStudents()
  }, [])

  // Function to archive a student
  const archiveStudent = async (student: Student) => {
    if (!window.confirm(`Are you sure you want to archive ${student.fullName}'s account?`)) {
      return
    }

    setLoading(student.id)

    try {
      // Add the student to the 'alumni' collection
      await setDoc(doc(db, 'alumni', student.id), student)

      // Remove the student from the 'students' collection
      await deleteDoc(doc(db, 'students', student.id))

      // Update the local state to remove the archived student
      setStudents((prev) => prev.filter((s) => s.id !== student.id))

      alert(`${student.fullName}'s account has been archived successfully.`)
    } catch (err) {
      console.error('Error archiving student: ', err)
      alert(`Failed to archive ${student.fullName}'s account. Please try again.`)
    } finally {
      setLoading(null)
    }
  }

  // Filter students by name or student ID
  const filteredStudents = students.filter((student) => 
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Student Accounts</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by name or student ID"
        className="mb-4 p-2 border border-gray-300 rounded-md w-full max-w-md"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Student Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Student ID</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Full Name</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Email</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Birthday</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Phone</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Course</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-left">{student.studentId}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-left">{student.fullName}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-left">{student.email}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-left">{student.birthday}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-left">{student.phone}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-left">{student.course}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-left">
                    <button
                      className={`px-4 py-2 bg-blue-500 text-white rounded ${loading === student.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => archiveStudent(student)}
                      disabled={loading === student.id}
                    >
                      {loading === student.id ? 'Archiving...' : 'Archive'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-gray-500">No students found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StudentAccount
