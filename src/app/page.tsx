"use client";
import Navbar from '@/components/topNavbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar />
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold text-blue-600">Welcome to OMSC Appointment System</h1>
            <p className="py-6 text-zinc-700">
              Experience seamless appointment scheduling and management. Stay tuned for exciting updates and features.
            </p>
            <button className="btn btn-primary">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
