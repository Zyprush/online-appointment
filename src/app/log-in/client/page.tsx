'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, BookOpen, Mail, Eye, EyeOff } from 'lucide-react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'
import Link from 'next/link'

export default function ClientLogIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const uid = userCredential.user.uid
      const clientDoc = await getDoc(doc(db, 'users', uid))
      if (clientDoc.exists()) {
        console.log('Sign in successful:', { email })
        window.location.href = '/client/appointment'
      } else {
        setError('No client record found.')
      }
    } catch (err) {
      const errorCode = (err as Error).message
      alert(errorCode)
      switch (errorCode) {
        case 'auth/invalid-credential':
          setError('Invalid email or password. Please try again.')
          break
        case 'auth/user-disabled':
          setError('This account has been disabled. Please contact support.')
          break
        case 'auth/too-many-requests':
          setError('Too many failed login attempts. Please try again later.')
          break
        case 'auth/wrong-password':
          setError('The password is incorrect. Please try again.')
          break
        case 'auth/user-not-found':
          setError('No user found with this email. Please check and try again.')
          break
        default:
          setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-5 bg-[url('/img/omsc.jpg')] bg-cover bg-center fixed inset-0">
      <div className="hidden lg:block w-2/3 h-full"></div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full sm:w-2/3 lg:w-1/3 max-w-lg"
      >
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex justify-center mb-6">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary flex items-center justify-center"
              >
                <BookOpen className="text-white w-8 h-8 sm:w-10 sm:h-10" />
              </motion.div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-1">
              OMSC Appointment System
            </h2>
            <p className="text-sm text-center text-gray-600 mb-6 sm:mb-8">
              Sign in as OMSC Client
            </p>
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="relative">
                <Mail className="absolute top-2.5 left-3 text-gray-400" />
                <input
                  type="email"
                  placeholder="client@gmail.com"
                  className="w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email Address"
                />
              </div>
              <div className="relative">
                <Lock className="absolute top-2.5 left-3 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute top-2.5 right-3 text-gray-400"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  className="flex-1 text-center bg-gray-200 text-gray-800 py-2 sm:py-3 rounded-md hover:bg-gray-300 transition duration-300"
                  href={"/log-in"}
                >
                  Back
                </Link>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 ${loading ? 'bg-gray-400' : 'bg-primary'} text-white py-2 sm:py-3 rounded-md transition duration-300`}
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </motion.button>
              </div>
            </form>
          </div>
          <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-center text-gray-600">
              By using this service, you understand and agree to the OMSC Online Services{' '}
              <a href="#" className="text-green-600 hover:underline">
                Terms of Use
              </a>{' '}
              and{' '}
              <a href="#" className="text-green-600 hover:underline">
                Privacy Statement
              </a>
              .
            </p>
            <p className="text-xs text-center text-gray-600 mt-2">
              Don&#39;t have an account?
              <Link href="/signup/client" className="underline text-blue-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}