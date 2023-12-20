import React from "react";
import Header from "./components/header";
import Footer from "./components/footer";

export default function Home() {
  return (
    <div className="text-center flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-col items-center justify-center h-screen">
        <a
          href="./mistle/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-neutral-600 text-white py-2 px-4 rounded hover:bg-neutral-800 hover:transform hover:scale-105 transition duration-300 ease-in-out"
        >
          Launch App
        </a>
      </main>
      <Footer />
    </div>
  );
}

//https://www.canva.com/en_gb/ FOR BODY

//https://nextjs.org/  FOR LOGO & FONT

//HEADER
//App logo on left
//log in on right
//sign up on right
// if logged in then My account on right
//about us
//blog/Tutorials
//[Optional] github link
//HEADER

//BODY
//big launch app button in the center
// some grafitti bg
//Templates slide in the middle
//floating button for mail support on bottom right
//BODY

//FOOTER
//Logo
//some links
//some more links
//FOOTER
