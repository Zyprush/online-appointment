import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          OMSC APP-iontment
        </Link>
        <div>
          <Link href="/log-in" className="text-white mr-4 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
