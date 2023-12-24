"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
//Import LOGO

function Header() {
  const { data: session }: any = useSession();
  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center bg-black text-white p-4 bg-opacity-80">
      <div className="flex-wrap">
        <a href="/">Logo</a>
      </div>
      <div className="flex gap-4">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300"
        >
          About Us
        </a>
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
            {session.user?.email}
            <li>
              <button
                onClick={() => {
                  signOut();
                }}
                className="hover:text-gray-300"
              >
                SignOut
              </button>
            </li>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
