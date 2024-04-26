"use client";

import React, { useEffect } from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import AOS from "aos";
import "aos/dist/aos.css";
import { BackgroundBeams } from "../components/ui/background-beams";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";

export default function Home() {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  const cards = [
    {
      source: "/diagramCards/dia1.png",
      alt: "Diagram 1",
      link: "/mistle/",
    },
    {
      source: "/diagramCards/dia1.png",
      alt: "Diagram 2",
      link: "/mistle/",
    },
    {
      source: "/diagramCards/dia1.png",
      alt: "Diagram 3",
      link: "/mistle/",
    },
  ];

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center">
        <div className="text-center lg:h-screen flex flex-col items-center justify-center">
          <BackgroundBeams />
          <img
            src="/logotextonly.svg"
            className="w-2/5 lg:w-1/4 mt-32 lg:mt-48"
          />
          <div className="w-[40rem] h-20 relative mt-1 lg:mb-12">
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
          </div>
          <h1 className=" text-2xl md:text-3xl lg:text-5xl font-bold w-3/4 lg:mt-8 mb-8 lg:mb-16">
            Free Online Diagrams Design Tool for all your documentation needs
          </h1>
          <div className="relative mb-48">
            <a href="./mistle/" target="_blank" rel="noopener noreferrer">
              <button className="getStarted">
                <svg
                  viewBox="0 0 16 16"
                  className="bi bi-lightning-charge-fill"
                  fill="currentColor"
                  height="16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"></path>
                </svg>
                Get Started
              </button>
            </a>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1 className=" text-2xl text-center md:text-3xl lg:text-4xl w-3/4 font-bold mb-12 lg:mb-32">
            Why Choose Mistle for creating Diagrams?
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-24 lg:gap-32 mb-20 md:mb-30 lg:mb-40">
            <img
              src="/infos/info1.svg"
              className="w-2/4 block md:hidden"
              data-aos="fade-left"
            />
            <div className="w-2/3 md:w-1/3" data-aos="fade-right">
              <h1 className="text-3xl lg:text-4xl font-medium mb-2">
                Ease of Use
              </h1>
              <p className="text-xl lg:text-2xl text-neutral-500 text-justify">
                Our app offers an intuitive user interface, making it easy for
                users of all levels to create diagrams without a steep learning
                curve and hassle of mandatory sign-ups.
              </p>
            </div>
            <img
              src="/infos/info1.svg"
              className="w-1/3 hidden md:block"
              data-aos="fade-left"
            />
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 mb-10 lg:mb-40">
            <img
              src="/infos/info2.svg"
              className="w-2/4 lg:w-1/3"
              data-aos="zoom-in"
            />
            <div className="w-2/3 lg:w-1/3" data-aos="fade-left">
              <h1 className="text-3xl lg:text-4xl font-medium mb-2">
                Diagram Versatility
              </h1>
              <p className="text-xl lg:text-2xl text-neutral-500 text-justify">
                With support for a wide range of diagram types, including
                flowcharts, UML diagrams, entity-relationship diagrams, and
                more, our app caters to the diverse documentation needs of users
                across different disciplines.
              </p>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-32 mb-20 lg:mb-40">
            <div className="w-2/3 lg:w-1/3" data-aos="fade-right">
              <h1 className="text-3xl lg:text-4xl font-medium mb-2">
                Export Options
              </h1>
              <p className="text-xl lg:text-2xl text-neutral-500 text-justify">
                Our app offers a variety of export options such as SVG, PNG, and
                JSON. Users can also save their diagrams directly to their free
                registered account for easy access.
              </p>
            </div>
            <img
              src="/infos/info3.svg"
              className="w-2/4 lg:w-1/3"
              data-aos="fade-left"
            />
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 mb-16 lg:mb-24">
            <img
              src="/infos/info4.svg"
              className="w-1/3 hidden lg:block"
              data-aos="fade-right"
            />
            <div className="w-2/3 lg:w-1/3" data-aos="fade-left">
              <h1 className="text-3xl lg:text-4xl font-medium mb-2">
                Easy to Get Help
              </h1>
              <p className="text-xl lg:text-2xl text-neutral-500 text-justify">
                We value your input! If you have any questions or suggestions,
                reach out to us. Mistle support is in-house and free!
              </p>
            </div>
            <img
              src="/infos/info4.svg"
              className="w-2/4 block lg:hidden"
              data-aos="fade-right"
            />
          </div>
          <div className="border border-white rounded-3xl flex flex-col items-center justify-center py-8 px-12 mx-12 mb-16 lg:mb-24">
            <h1 className="text-3xl lg:text-4xl font-medium mb-4">
              Diagrams Resources
            </h1>
            <p className="text-xl lg:text-2xl text-center text-neutral-500">
              Tutorials and guides, helping users learn diagram design
              principles and best practices!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 px-8 pt-8">
              {cards.map((diagram, index) => (
                <div
                  key={index}
                  onClick={() => window.open(diagram.link, "_blank")}
                  className="bg-center flex flex-col items-center justify-end bg-cover rounded-2xl bg-no-repeat h-52 w-80 overflow-hidden 
               transition-transform duration-300 ease-in-out
               hover:scale-105 "
                  style={{ backgroundImage: `url('${diagram.source}')` }}
                >
                  <h1 className="bg-violet-500 text-center font-mono w-full py-1 bg-opacity-20">
                    {diagram.alt}
                  </h1>
                </div>
              ))}
            </div>
          </div>
          <div className=" flex flex-col items-center justify-start">
            <h1 className="text-3xl lg:text-4xl mx-10 text-center font-medium mb-8">
              <span className="text-violet-600"> Mistle</span> is crafted using
              a diverse range of technologies!
            </h1>
            <InfiniteMovingCards
              direction="left"
              speed="slow"
              pauseOnHover={false}
              className="py-2"
            />
          </div>
          <div className="flex items-center justify-center gap-12 py-16">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium ">
              Try Mistle App now for free!
            </h1>
            <a href="./mistle/" target="_blank" rel="noopener noreferrer">
              <button className="getStarted">
                <svg
                  viewBox="0 0 16 16"
                  className="bi bi-lightning-charge-fill"
                  fill="currentColor"
                  height="16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"></path>
                </svg>
                Get Started
              </button>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
