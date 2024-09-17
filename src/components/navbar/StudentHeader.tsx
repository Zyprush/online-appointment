import Image from "next/image";
import StudentNavLink from "@/components/StudentNavLink";
import { useState } from "react";
import { Menu } from "lucide-react";

const StudentHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        </div>
        <StudentNavLink />
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
        {isMenuOpen && (
          <div className="bg-white border-b border-zinc-300 shadow-md">
            <StudentNavLink isMobile={true} />
          </div>
        )}
      </div>
    </>
  );
};

export default StudentHeader;