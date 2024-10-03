'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, BookOpen, User, Mail, Eye, EyeOff } from 'lucide-react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'
import Link from 'next/link'

export default function LogIn() {
  const [studentNo, setStudentNo] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const uid = userCredential.user.uid

      const studentDoc = await getDoc(doc(db, 'users', uid))
      if (studentDoc.exists()) {
        const studentData = studentDoc.data()
        if (studentData.studentId === studentNo) {
          console.log('Sign in successful:', { studentNo, email })
          const role = studentData.role;
          if (role === 'admin') {
            window.location.href = '/admin/dashboard';
          } else {
            window.location.href = '/student/dashboard';
          }
        } else {
          alert('Student ID does not match.')
        }
      } else {
        alert('No student record found.')
      }
    } catch (err) {
      const errorMessage = (err as Error).message;
      if (errorMessage.includes('wrong-password')) {
        alert('Incorrect password. Please try again.')
      } else if (errorMessage.includes('user-not-found')) {
        alert('No account found with this email address.')
      } else {
        alert('Error signing in: ' + errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex justify-center items-center h-full overflow-scroll fixed top-0 bottom-0 right-0 left-0 p-5 bg-[url('/img/omsc.jpg')]">
      <div className='w-2/3 h-full'></div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-1/3 max-w-md"
      >
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-20 h-20 rounded-full bg-primary flex items-center justify-center"
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
                  placeholder="student@gmail.com"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email Address"
                />
              </div>
              <div className="relative">
                <Lock className="absolute top-3 left-3 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute top-3 right-3 text-gray-400"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="flex space-x-4">
                <Link
                  className="flex-1 text-center bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition duration-300"
                  href={"/log-in"}
                >
                  Back
                </Link>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 ${loading ? 'bg-gray-400' : 'bg-primary'} text-white py-2 rounded-md transition duration-300`}
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </motion.button>
              </div>
            </form>
          </div>
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-center text-gray-600">
              By using this service, you understood and agree to the OMSC Online Services{' '}
              <a href="#" className="text-green-600 hover:underline">
                Terms of Use
              </a>
              {' '}and{' '}
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