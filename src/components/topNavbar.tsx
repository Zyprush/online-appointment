import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  // State for managing mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <nav className="flex justify-between items-center py-4 px-6 md:px-12 bg-white">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-extrabold text-primary">
            OMSC Appointment
          </span>
        </div>
        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-gray-700">
          <li>
            <Link href="/" className="hover:text-primary hover:font-bold hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-primary hover:font-bold hover:underline">
              About Us
            </Link>
          </li>
          <li>
            <a href="mailto:mambuappoint@gmail.com" className="hover:text-primary hover:font-bold hover:underline">
              Contact
            </a>
          </li>
        </ul>
        <div className="hidden md:block space-x-4">
          <Link
            href="/signup/client"
            className="text-blue-600  hover:text-primary hover:font-bold hover:underline"
          >
            Sign Up
          </Link>
          <Link href="/log-in" className="text-blue-600 hover:text-primary hover:font-bold hover:underline">
            Login
          </Link>
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-blue-600 focus:outline-none"
          >
            {/* Mobile menu icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col items-start p-4 space-y-4 text-gray-700">
            <li>
              <Link
                href="/"
                className="hover:text-blue-600"
                onClick={toggleMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-blue-600"
                onClick={toggleMenu}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-blue-600"
                onClick={toggleMenu}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/signup/client"
                className="hover:text-blue-600"
                onClick={toggleMenu}
              >
                Sign Up
              </Link>
            </li>
            <li>
              <Link
                href="/log-in"
                className="hover:text-blue-600"
                onClick={toggleMenu}
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
