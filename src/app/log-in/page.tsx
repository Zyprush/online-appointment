'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Lock, BookOpen, User, Mail } from 'lucide-react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function LogIn() {
  const [studentNo, setStudentNo] = useState('')
  const [email, setEmail] = useState('')
  const [birthday, setBirthday] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const uid = userCredential.user.uid

      // Fetch student data from Firestore
      const studentDoc = await getDoc(doc(db, 'students', uid))
      if (studentDoc.exists()) {
        const studentData = studentDoc.data()
        
        // Check if student ID and birthday match
        if (studentData.studentId === studentNo && studentData.birthday === birthday) {
          console.log('Sign in successful:', { studentNo, email, birthday })
        } else {
          alert('Student ID or birthday does not match.')
        }
      } else {
        alert('No student record found.')
      }
    } catch (err) {
      alert('Error signing in: ' + (err as Error).message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-20 h-20 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 flex items-center justify-center"
              >
                <BookOpen className="text-white w-10 h-10" />
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">OMSC Appointment System</h2>
            <p className="text-sm text-center text-gray-600 mb-8">Sign in as OMSC Student</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <User className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Student ID"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={studentNo}
                  onChange={(e) => setStudentNo(e.target.value)}
                  required
                  aria-label="Student ID"
                />
              </div>
              <div className="relative">
                <Mail className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="email"
                  placeholder="student@omsc.edu.ph"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email Address"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  required
                  aria-label="Birth Date"
                />
              </div>
              <div className="relative">
                <Lock className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-label="Password"
                />
              </div>
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition duration-300"
                >
                  Back
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-2 rounded-md hover:from-green-700 hover:to-emerald-600 transition duration-300"
                >
                  Sign in
                </motion.button>
              </div>
            </form>
          </div>
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-center text-gray-600">
              By using this service, you understood and agree to the OMSC Online Services{' '}
              <a href="#" className="text-green-600 hover:underline">
                Terms of Use
              </a>{' '}
              and{' '}
              <a href="#" className="text-green-600 hover:underline">
                Privacy Statement
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}