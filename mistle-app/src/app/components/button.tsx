import React from "react";
import { TbLogin2 } from "react-icons/tb";
import { FaPen } from "react-icons/fa";

const Button = (props: any) => {
  return (
    <a
      href={`/account/${props.type}`}
      rel="noopener noreferrer"
      className={`headbutton ${props.color}`}
    >
      {props.type === "signin" ? (
        <>
          <div className="svg-wrapper">
            <TbLogin2 size="1.4em" className="headsvg" />
          </div>
          <span>{props.name}</span>
        </>
      ) : (
        <>
          <div className="svg-wrapper">
            <FaPen className="headsvg ml-1" />
          </div>
          <span>{props.name}</span>
        </>
      )}
    </a>
  );
};

export default Button;
