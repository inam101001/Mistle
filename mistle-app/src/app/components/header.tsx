import React from "react";
//Import LOGO

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center bg-darkbg text-white p-4 bg-opacity-80">
      <div className="flex-wrap">
        <p>Logo</p>
      </div>
      <div className="flex gap-4">
        <a href="#" className="hover:text-gray-300">
          About Us
        </a>
        <a href="#" className="hover:text-gray-300">
          Sign Up
        </a>
        <a href="#" className="hover:text-gray-300">
          Sign In
        </a>
      </div>
    </header>
  );
}

export default Header;
