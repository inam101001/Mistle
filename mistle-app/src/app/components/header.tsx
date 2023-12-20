import React from "react";
//Import LOGO

function Header() {
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
        <a href="../account/signup" className="hover:text-gray-300">
          Sign Up
        </a>
        <a href="../account/signin" className="hover:text-gray-300">
          Sign In
        </a>
      </div>
    </header>
  );
}

export default Header;
