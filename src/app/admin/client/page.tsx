'use client'

import React, { useState } from "react"
import VerifiedClient from "./VerifiedClient"
import UnverifiedClient from "./UnverfiedClient"

export default function Page() {
  const [showVerified, setShowVerified] = useState(true)

  return (
    <div className="w-full mx-auto min-h-screen bg-base-100 p-5">
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={() => setShowVerified(true)}
          className={`btn btn-sm rounded-sm w-full sm:w-auto ${
            showVerified ? 'btn-primary text-white' : 'btn-ghost'
          }`}
        >
          Verified Clients
        </button>
        <button
          onClick={() => setShowVerified(false)}
          className={`btn btn-sm w-full rounded-sm sm:w-auto ${
            !showVerified ? 'btn-primary text-white' : 'btn-ghost'
          }`}
        >
          Unverified Clients
        </button>
      </div>

      <div className="">
          <div className="transition-opacity duration-300 ease-in-out">
            {showVerified ? <VerifiedClient /> : <UnverifiedClient />}
          </div>
      </div>
    </div>
  )
}