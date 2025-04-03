"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">My Video App</h1>
        <ul className="flex space-x-4">
          <li>
            <Link
              href="/"
              className={`hover:text-gray-400 ${
                pathname === "/" ? "underline" : ""
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard"
              className={`hover:text-gray-400 ${
                pathname === "/dashboard" ? "underline" : ""
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/login"
              className={`hover:text-gray-400 ${
                pathname === "/login" ? "underline" : ""
              }`}
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;