"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getToken, removeToken } from "../../utils/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setLoggedIn(!!getToken());
  }, [pathname]);

  const handleLogout = () => {
    removeToken();
    setLoggedIn(false);
    router.push("/signin");
  };

  return (
    <nav className="bg-indigo-700 p-4 flex justify-between items-center">
      <Link href="/" className="text-white font-bold text-xl">
        Chat App
      </Link>
      <div className="flex gap-4">
        {!loggedIn && (
          <>
            <Link href="/signin" className="text-white hover:underline">Sign In</Link>
            <Link href="/signup" className="text-white hover:underline">Sign Up</Link>
          </>
        )}
        {loggedIn && (
          <>
            <Link href="/create-room" className="text-white hover:underline">Create Room</Link>
            <Link href="/join-room" className="text-white hover:underline">Join Room</Link>
            <button onClick={handleLogout} className="text-white hover:underline">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

