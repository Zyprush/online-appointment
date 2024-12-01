import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { usePathname } from "next/navigation"; // Use Next.js pathname for active page logic

interface AdminNavLinkProps {
  isMobile?: boolean;
}

const AdminNavLink: React.FC<AdminNavLinkProps> = ({ isMobile = false }) => {
  const pathname = usePathname(); // Get current pathname

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Function to check if the current link is active
  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return isMobile
      ? `block py-2 px-4 text-gray-700 hover:bg-gray-100 w-full text-left ${
          isActive ? "bg-primary text-white" : ""
        }`
      : `text-gray-700 hover:text-gray-900 hover:bg-primary hover:text-white p-2 ${
          isActive ? "bg-primary text-white" : ""
        }`;
  };

  return (
    <div className={isMobile ? "flex flex-col" : "flex gap-5 ml-auto mr-5"}>
      <Link href="/admin/calendar" className={getLinkClass("/admin/calendar")}>
        Calendar
      </Link>
      <Link href="/admin/client" className={getLinkClass("/admin/client")}>
        Client
      </Link>
      <Link href="/admin/setting" className={getLinkClass("/admin/setting")}>
        Setting
      </Link>
      <button onClick={handleLogout} className={getLinkClass("/")}>
        Logout
      </button>
    </div>
  );
};

export default AdminNavLink;
