"use client"
import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, updateDoc, query, where } from 'firebase/firestore'
import { db } from '@/firebase'

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

const AlumniAccount = () => {
  const [students, setStudents] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState<string | null>(null)

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

  const archiveStudent = async (student: User) => {
    if (!window.confirm(`Are you sure you want to archive ${student.fullName}'s account?`)) {
      return
    }

    setLoading(student.id)
    try {
      const userRef = doc(db, 'users', student.id)
      
      // Update the role to "alumni"
      await updateDoc(userRef, { role: 'student' })

      alert(`${student.fullName}'s account has been archived successfully.`)
      
      // Update the local state
      setStudents(students.filter(s => s.id !== student.id))
    } catch (err) {
      console.error('Error archiving student: ', err)
      alert(`Failed to archive ${student.fullName}'s account. Please try again.`)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Student Accounts</h1>

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
                <tr key={student.id}>
                  <td className="py-2 px-4 border-b border-gray-200">{student.studentId}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{student.fullName}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{student.email}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{student.birthday}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{student.phone}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{student.course}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <button
                      className={`ml-2 px-4 py-2 bg-secondary text-white rounded ${loading === student.id ? 'opacity-50 cursor-not-allowed' : ''}`}
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

export default AlumniAccount
