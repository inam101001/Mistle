import React from "react";

function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 flex justify-center items-center bg-black text-white p-4 bg-opacity-80">
      <div className="gap-8 flex items-center">
        <a
          href="https://github.com/Mistle-Diagrams/Mistle"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300"
        >
          <div className="flex items-center gap-2 justify-center pr-8 border-r-2">
            <img src="/github.svg" alt="github" className="w-5 h-5" />
            Github
          </div>
        </a>
        <a
          href="mailto:mistlediagrams@gmail.com"
          rel="noopener noreferrer"
          className="hover:text-gray-300"
        >
          <div className="flex items-center gap-2 justify-center pr-8 border-r-2">
            <img src="/gmail2.svg" alt="github" className="w-7 h-7" />
            Gmail
          </div>
        </a>
        <a
          href="../about"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300"
        >
          <div className="flex items-center gap-2 justify-center">
            <img src="/about2.svg" alt="github" className="w-5 h-5" />
            About Us
          </div>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
