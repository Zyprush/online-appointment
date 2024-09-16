"use client"
import React, { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { db } from '@/firebase'

// Define a type for alumni data
interface Alumni {
  id: string;
  fullName: string;
  studentId: string;
  email: string;
  birthday: string;
  phone: string;
  course: string;
}

const AlumniAccount = () => {
  const [alumni, setAlumni] = useState<Alumni[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState<string | null>(null) // State to manage loading

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'alumni'))
        const alumniList: Alumni[] = querySnapshot.docs.map((doc) => {
          const data = doc.data() as Alumni
          return {
            ...data, // Document data
            id: doc.id, // Document ID
          }
        })
        setAlumni(alumniList)
      } catch (err) {
        console.error('Error fetching alumni data: ', err)
      }
    }

    fetchAlumni()
  }, [])

  // Filter alumni by name or student ID
  const filteredAlumni = alumni.filter((alumnus) =>
    alumnus.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alumnus.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const restoreStudent = async (student: Alumni) => {
    if (!window.confirm(`Are you sure you want to restore ${student.fullName}'s account?`)) {
      return
    }

    setLoading(student.id) // Set loading for this student
    try {
      // Get the student from the 'alumni' collection
      const studentDoc = await getDoc(doc(db, 'alumni', student.id))
      if (studentDoc.exists()) {
        const data = studentDoc.data() as Alumni;

        // Add the student back to the 'students' collection
        await setDoc(doc(db, 'students', student.id), data)

        // Remove the student from the 'alumni' collection
        await deleteDoc(doc(db, 'alumni', student.id))

        alert(`${student.fullName}'s account has been restored successfully.`)

        // Refresh the page to show updated data
        window.location.reload()
      } else {
        alert(`No archived record found for ${student.fullName}.`)
      }
    } catch (err) {
      console.error('Error restoring student: ', err)
      alert(`Failed to restore ${student.fullName}'s account. Please try again.`)
    } finally {
      setLoading(null) // Reset loading state
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Alumni Accounts</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by name or student ID"
        className="mb-4 p-2 border border-gray-300 rounded-md w-full max-w-xs"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Alumni Table */}
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
            {filteredAlumni.length > 0 ? (
              filteredAlumni.map((alumnus) => (
                <tr key={alumnus.id}>
                  <td className="py-2 px-4 border-b border-gray-200">{alumnus.studentId}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{alumnus.fullName}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{alumnus.email}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{alumnus.birthday}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{alumnus.phone}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{alumnus.course}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <button
                      className={`ml-2 px-4 py-2 bg-secondary text-white rounded ${loading === alumnus.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => restoreStudent(alumnus)}
                      disabled={loading === alumnus.id}
                    >
                      {loading === alumnus.id ? 'Restoring...' : 'Restore'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-gray-500">No alumni found</td> {/* Updated colSpan */}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AlumniAccount
