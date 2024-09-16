'use client'

import React, { useState } from "react"
import VerifiedClient from "./VerifiedClient"
import UnverifiedClient from "./UnverfiedClient"

export default function Page() {
  const [showVerified, setShowVerified] = useState(true)

  return (
    <div className="container mx-auto min-h-screen bg-base-100">
      <h1 className="text-xl font-bold text-center mb-8">Client Management</h1>
      
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
        <button
          onClick={() => setShowVerified(true)}
          className={`btn btn-sm w-full sm:w-auto ${
            showVerified ? 'btn-primary' : 'btn-ghost'
          }`}
        >
          Verified Clients
        </button>
        <button
          onClick={() => setShowVerified(false)}
          className={`btn btn-sm w-full sm:w-auto ${
            !showVerified ? 'btn-primary' : 'btn-ghost'
          }`}
        >
          Unverified Clients
        </button>
      </div>

      <div className="bg-base-100 shadow-xl">
          <div className="transition-opacity duration-300 ease-in-out">
            {showVerified ? <VerifiedClient /> : <UnverifiedClient />}
          </div>
      </div>
    </div>
  )
}