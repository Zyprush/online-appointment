'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, BookOpen, Mail, Loader } from 'lucide-react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/firebase'
import Link from 'next/link'
import { getDoc, doc } from 'firebase/firestore'

export default function LogIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password) {
      setError('Email and password are required.')
      return
    }

    setLoading(true)
    try {
      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const uid = userCredential.user.uid
      console.log('uid', uid)

      // Fetch student data from Firestore
      const studentDoc = await getDoc(doc(db, 'users', uid))
      if (studentDoc.exists() && studentDoc.data().role === 'admin') {
        window.location.href = '/admin/appointment'
      } else {
        setError('No Admin or Staff record found.')
      }
    } catch (err) {
      setError('Error signing in: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
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
            <p className="text-sm text-center font-semibold text-gray-600 mb-8">Sign in as Admin or Staff</p>
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  className={`flex-1 bg-primary text-white py-2 rounded-md transition duration-300 flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin mr-2" size={20} />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
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