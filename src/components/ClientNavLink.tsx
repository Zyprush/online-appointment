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
      window.location.href = '/log-in';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const linkClass = isMobile
    ? "block py-2 px-4 text-gray-700 hover:bg-gray-100 w-full text-left"
    : "text-gray-700 hover:text-gray-900";

  return (
    <div className={isMobile ? "flex flex-col" : "flex gap-5 ml-auto mr-5"}>
      <Link href="/client/appointments" className={linkClass}>
        Appointments
      </Link>
      <Link href="/client/profile" className={linkClass}>
        Profile
      </Link>
      <Link href="/client/settings" className={linkClass}>
        Settings
      </Link>
      <button onClick={handleLogout} className={linkClass}>
        Logout
      </button>
    </div>
  );
};

export default ClientNavLink;