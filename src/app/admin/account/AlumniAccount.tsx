"use client"
import React, { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Alumni Accounts</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by name or student ID"
        className="mb-4 p-2 border border-gray-300 rounded-md w-full max-w-md"
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500">No alumni found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AlumniAccount
