"use client";
import React, { useState } from 'react'
import AlumniAccount from './AlumniAccount'
import StudentAccount from './StudentAccount'

const Page = () => {
  const [table, setTable] = useState<'student' | 'alumni'>('student')

  const handleToggle = () => {
    setTable((prevTable) => (prevTable === 'student' ? 'alumni' : 'student'))
  }

  const renderAccountTable = () => {
    switch (table) {
      case 'student':
        return <StudentAccount />
      case 'alumni':
        return <AlumniAccount />
      default:
        return null
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Account Management</h1>

      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        {table === 'student' ? 'Show Alumni Accounts' : 'Show Student Accounts'}
      </button>

      {/* Render the selected account table */}
      {renderAccountTable()}
    </div>
  )
}

export default Page
