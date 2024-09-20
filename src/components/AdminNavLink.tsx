import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';

interface AdminNavLinkProps {
  isMobile?: boolean;
}

const AdminNavLink: React.FC<AdminNavLinkProps> = ({ isMobile = false }) => {
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
      <Link href="/admin/appointment" className={linkClass}>
        Appointment
      </Link>
      <Link href="/admin/client" className={linkClass}>
        Client
      </Link>
      <Link href="/admin/student" className={linkClass}>
        Student
      </Link>
      <Link href="/admin/setting" className={linkClass}>
        Setting
      </Link>
      <button onClick={handleLogout} className={linkClass}>
        Logout
      </button>
    </div>
  );
};

export default AdminNavLink;