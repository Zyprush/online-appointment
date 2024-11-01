import Link from "next/link";
import { useRouter } from "next/navigation"; // Use Next.js router for navigation

interface OfficeNavLinkProps {
  isMobile?: boolean;
}

const OfficeNavLink: React.FC<OfficeNavLinkProps> = ({ isMobile = false }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Clear office login data from localStorage
      localStorage.removeItem("officeLoginData");

      // Navigate to the home page
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const linkClass = isMobile
    ? "block py-2 px-4 text-gray-700 hover:bg-gray-100 w-full text-left"
    : "text-gray-700 hover:text-gray-900 hover:bg-primary hover:text-white p-2";

  return (
    <div className={isMobile ? "flex flex-col" : "flex gap-5 ml-auto mr-5"}>
      <Link href="/office/appointment" className={linkClass}>
        Appointment
      </Link>
      <Link href="/office/calendar" className={linkClass}>
        Calendar
      </Link>
      <Link href="/office/announcement" className={linkClass}>
        Announcement
      </Link>
      <button onClick={handleLogout} className={linkClass}>
        Logout
      </button>
    </div>
  );
};

export default OfficeNavLink;
