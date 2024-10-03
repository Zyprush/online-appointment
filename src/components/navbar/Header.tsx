import { useState, useEffect } from "react";
import Image from "next/image";
import AdminNavLink from "@/components/AdminNavLink";
import StudentNavLink from "@/components/StudentNavLink";
import { Menu } from "lucide-react";
import { auth, db } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import ClientNavLink from "../ClientNavLink";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      } else {
        setUserRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const NavLink = userRole === 'admin'
    ? AdminNavLink
    : userRole === 'client'
      ? ClientNavLink
      : StudentNavLink;

  return (
    <>
      {/* Desktop Header */}
      <span className="w-full h-14 bg-white justify-between px-5 items-center border-b hidden md:flex fixed top-0 border border-zinc-300 bg-opacity-80 z-50">
        <div className="flex items-center gap-4">
          <details className="dropdown dropdown-end">
            <summary
              tabIndex={0}
              role="button"
              className="h-10 w-10 flex items-center justify-center overflow-hidden border border-primary bg-primary rounded-full"
            >
              <Image
                src="/img/logo.png"
                alt="logo"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </summary>
          </details>
          <p className="capitalize font-bold text-primary">{userRole}</p>
        </div>
        {userRole && <NavLink />}
      </span>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50">
        <div className="bg-white border-b border-zinc-300 px-4 py-2 flex justify-between items-center">
          <Image
            src="/img/logo.png"
            alt="logo"
            width={40}
            height={40}
            className="h-10 w-10 object-cover rounded-full"
          />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 focus:outline-none"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* AnimatePresence handles the mounting/unmounting animations */}
        <AnimatePresence>
          {isMenuOpen && userRole && (
            <motion.div
              key="menu" // Key is important for animating items in AnimatePresence
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white border-b border-zinc-300 shadow-md"
            >
              <NavLink isMobile={true} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Header;
