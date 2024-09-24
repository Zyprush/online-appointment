import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';

interface StudentNavLinkProps {
  isMobile?: boolean;
}

const StudentNavLink: React.FC<StudentNavLinkProps> = ({ isMobile = false }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/log-in';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const linkClass = isMobile
    ? "block py-2 px-4 text-gray-700 hover:bg-gray-100 w-full text-left"
    : "text-gray-700 hover:text-gray-900 hover:bg-primary hover:text-white p-2";

  return (
    <div className={isMobile ? "flex flex-col" : "flex gap-5 ml-auto mr-5"}>
      <Link href="/student/dashboard" className={linkClass}>
        Dashboard
      </Link>
      <Link href="/student/calendar" className={linkClass}>
        Calendar
      </Link>
      <Link href="/student/profile" className={linkClass}>
        Profile
      </Link>
      <button onClick={handleLogout} className={linkClass}>
        Logout
      </button>
    </div>
  );
};

export default StudentNavLink;