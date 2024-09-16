import Link from "next/link";

const Header = () => {
  return (
    <span className="w-full h-14 bg-white justify-between px-5 items-center border-b hidden md:flex fixed top-0 border border-zinc-300 bg-opacity-80 z-50">
      <div className="flex items-center gap-4">
        <details className="dropdown dropdown-end">
          <summary
            tabIndex={0}
            role="button"
            className="h-10 w-10 flex items-center justify-center overflow-hidden border-2 border-primary bg-primary rounded-full"
          >
            {/* <img
            src={userData?.profilePicUrl || "/img/profile-admin.jpg"}
            alt="profile"
            width={40}
            height={40}
            className="h-full w-full object-cover"
          /> */}
          </summary>
        </details>
      </div>
      <div className="flex gap-5 ml-auto mr-5">
        <Link href="/admin/appointment">Appointment</Link>
        <Link href="/admin/client">Client</Link>
        <Link href="/admin/student">Student</Link>
        <Link href="/admin/">Account</Link>
      </div>
    </span>
  );
};

export default Header;
