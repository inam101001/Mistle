import React from "react";

function Footer() {
  return (
    <footer className="flex justify-center items-center absolute bottom-0 w-full border-t-2 border-zinc-800 bg-black p-2 border-opacity-50 bg-opacity-30">
      <p className=" text-zinc-400 mx-2 text-sm">
        &copy; 2023-{new Date().getFullYear()} Mistle. All rights reserved.
      </p>
      {/* <div className="gap-2 flex items-center">
        <a
          href="https://github.com/Mistle-Diagrams/Mistle"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300 hover:translate-y-[-2.5px] transform transition duration-250 ease-in-out"
        >
          <div className="flex items-center gap-2 justify-center">
            <img src="/github.svg" alt="github" className="w-5 h-5" />
            Github
          </div>
        </a>
        <div className="border-r-2 p-2.5 mr-1.5"></div>
        <a
          href="mailto:mistlediagrams@gmail.com"
          rel="noopener noreferrer"
          className="hover:text-gray-300 hover:translate-y-[-2.5px] transform transition duration-250 ease-in-out"
        >
          <div className="flex items-center justify-center">
            <img src="/discord.svg" alt="discord" className="w-10 h-10" />
            Discord
          </div>
        </a>
      </div> */}
    </footer>
  );
}

export default Footer;
