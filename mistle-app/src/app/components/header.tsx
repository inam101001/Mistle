"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
//Import LOGO

function Header() {
  const { data: session }: any = useSession();
  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center bg-black text-white p-4 bg-opacity-80">
      <div className="flex gap-4">
        <a href="/" className="hover:text-gray-300">
          Logo
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300"
        >
          Home
        </a>
      </div>
      <div className="flex gap-4">
        {!session ? (
          <>
            <a href="../account/signup" className="hover:text-gray-300">
              Sign Up
            </a>
            <a href="../account/signin" className="hover:text-gray-300">
              Sign In
            </a>
          </>
        ) : (
          <>
            <span className="bg-neutral-300 text-black font-medium pl-2 pr-2 rounded-md ">
              {session.user?.email}
            </span>
            <button
              onClick={() => {
                signOut();
              }}
              className="hover:text-gray-300"
            >
              SignOut
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
