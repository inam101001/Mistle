import React from "react";

function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 flex justify-between items-center bg-black text-white p-4 bg-opacity-80">
      <div className="gap-4 flex items-center">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300"
        >
          Github
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300"
        >
          Microsoft
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300"
        >
          Google
        </a>
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
        <a className="hover:text-gray-300" href="/">
          Logo
        </a>
      </div>
    </footer>
  );
}

export default Footer;
