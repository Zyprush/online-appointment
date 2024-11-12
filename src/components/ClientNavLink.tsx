import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';

interface ClientNavLinkProps {
  isMobile?: boolean;
}

const ClientNavLink: React.FC<ClientNavLinkProps> = ({ isMobile = false }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const linkClass = isMobile
    ? "block py-2 px-4 text-gray-700 hover:bg-gray-100 w-full text-left"
    : "text-gray-700 hover:text-gray-900 hover:bg-primary hover:text-white p-2";

  return (
    <div className={isMobile ? "flex flex-col" : "flex gap-5 ml-auto mr-5"}>
      <Link href="/client/appointment" className={linkClass}>
        Appointments
      </Link>
      <Link href="/client/calendar" className={linkClass}>
        Calendar
      </Link>
      <Link href="/client/feedback" className={linkClass}>
        Feedback
      </Link>
      <Link href="/client/profile" className={linkClass}>
        Profile
      </Link>
      <button onClick={handleLogout} className={linkClass}>
        Logout
      </button>
    </div>
  );
};

export default ClientNavLink;