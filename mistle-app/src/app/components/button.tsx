import React from "react";

export default function Button(props: any) {
  return (
    <button className="bg-black text-white opacity-80 px-2 py-1 rounded-md m-2 hover:transform hover:scale-105 transition-all">
      {props.children}
    </button>
  );
}
