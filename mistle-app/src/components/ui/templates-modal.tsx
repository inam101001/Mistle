import React from "react";
import { cards } from "@/app/data/diagrams";

const Templates = () => {
  return (
    <div
      className="flex h-screen pb-28 md:pb-0 md:h-4/5 flex-wrap items-start justify-center gap-12"
      style={{ scrollbarWidth: "none", overflowY: "scroll" }}
    >
      {cards.map((diagram, index) => (
        <div className="flex flex-col items-center justify-center gap-1.5">
          <div
            key={index}
            onClick={() => window.open(diagram.link, "_self")}
            className="bg-center bg-cover rounded-2xl bg-no-repeat h-36 w-60 cursor-pointer overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 "
            style={{
              backgroundImage: `url('${diagram.source}')`,
            }}
          ></div>
          <h1 className="text-white text-center w-full">{diagram.alt}</h1>
        </div>
      ))}
    </div>
  );
};

export default Templates;
