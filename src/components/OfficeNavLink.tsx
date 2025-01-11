import { Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Use Next.js pathname for active page logic

interface OfficeNavLinkProps {
  isMobile?: boolean;
}

const OfficeNavLink: React.FC<OfficeNavLinkProps> = ({ isMobile = false }) => {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      // Clear office login data from localStorage
      localStorage.removeItem("officeLoginData");

      // Navigate to the home page
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
      <Link href="/office/notif" className={getLinkClass('/office/notif')}>
        <Bell className="h-5 w-5 my-auto" />
      </Link>
      <Link href="/office/appointment" className={getLinkClass("/office/appointment")}>
        Appointment
      </Link>
      <Link href="/office/calendar" className={getLinkClass("/office/calendar")}>
        Calendar
      </Link>
      <Link href="/office/feedback" className={getLinkClass("/office/feedback")}>
        Feedback
      </Link>
      <Link href="/office/logs" className={getLinkClass('/office/logs')}>
        Logs
      </Link>

      <Link href="/office/services" className={getLinkClass("/office/services")}>
        Services
      </Link>
      <Link href="/office/announcement" className={getLinkClass("/office/announcement")}>
        Announcement
      </Link>
      <button onClick={handleLogout} className={getLinkClass("/")}>
        Logout
      </button>
    </div>
  );
};

export default OfficeNavLink;
