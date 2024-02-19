import React from "react";
import Header from "./components/header";
import Footer from "./components/footer";

export default function Home() {
  return (
    <div className="text-center flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-col items-center justify-center h-screen">
        <h1 className=" sm:text-4xl xl:text-5xl font-bold w-3/4">
          Free Online Diagrams Design Tool for all your documentation needs
        </h1>
        <a href="./mistle/" target="_blank" rel="noopener noreferrer">
          <button className="pushable">
            <span className="shadow"></span>
            <span className="edge"></span>
            <span className="front">Get Started!</span>
          </button>
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
