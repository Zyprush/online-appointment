import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';

interface ClientNavLinkProps {
  isMobile?: boolean;
}

const ClientNavLink: React.FC<ClientNavLinkProps> = ({ isMobile = false }) => {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return isMobile
      ? `block py-2 px-4 text-gray-700 hover:bg-gray-100 w-full text-left ${
          isActive ? 'bg-primary text-white' : ''
        }`
      : `text-gray-700 hover:text-gray-900 hover:bg-primary hover:text-white p-2 ${
          isActive ? 'bg-primary text-white' : ''
        }`;
  };

  return (
    <div className={isMobile ? 'flex flex-col' : 'flex gap-5 ml-auto mr-5'}>
      <Link href="/client/appointment" className={getLinkClass('/client/appointment')}>
        Appointments
      </Link>
      <Link href="/client/calendar" className={getLinkClass('/client/calendar')}>
        Calendar
      </Link>
      <Link href="/client/schedule" className={getLinkClass('/client/schedule')}>
        Schedule
      </Link>
      <Link href="/client/profile" className={getLinkClass('/client/profile')}>
        Profile
      </Link>
      <button onClick={handleLogout} className={getLinkClass('/')}>
        Logout
      </button>
    </div>
  );
};

export default ClientNavLink;
