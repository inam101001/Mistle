"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import Button from "./button";

import { LuUser } from "react-icons/lu";
import { LuShapes } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const { data: session }: any = useSession();
  const [menuOpen, setMenuOpen] = React.useState(false);

  function handleSignOut() {
    signOut();
  }

  return (
    <nav className="bg-black md:bg-purple-900 md:bg-clip-padding md:backdrop-blur-sm md:bg-opacity-5 py-5 z-10 md:fixed md:top-0 md:left-0 md:right-0 w-screen">
      <div className="flex items-center font-medium justify-start md:justify-between px-6">
        <div className="z-50 md:w-auto w-full flex items-center justify-between">
          <a href="/">
            <img src="/logo3.svg" alt="logo" className="h-7 filter" />
          </a>
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden self-end"
          >
            <img
              src={menuOpen ? "/close.svg" : "/menu.svg"}
              alt="menu"
              className={`h-12 rotate ${menuOpen ? "open" : ""}`}
            />
          </div>
        </div>
        <ul className="md:flex uppercase hidden items-center xl:ml-20 ml-18 gap-10">
          <li className="filter">
            <a href="/" rel="noopener noreferrer">
              Home
            </a>
          </li>
          <li className="filter">
            <a href="/" target="_blank" rel="noopener noreferrer">
              Tutorials
            </a>
          </li>
          <li>
            <button className="filter uppercase">Contact us</button>
          </li>
          <li className="filter">
            <a href="/about" target="_blank" rel="noopener noreferrer">
              About us
            </a>
          </li>
        </ul>
        <div className="md:flex items-center justify-center gap-4 hidden px-2">
          {!session ? (
            <>
              <Button type="signup" name="Sign up" color="gray" />
              <Button type="signin" name="Sign In" color="indigo" />
            </>
          ) : (
            <>
              <div className="flex items-center justify-end gap-4 min-w-[200px]">
                <span className=" text-white font-medium px-2 overflow-hidden overflow-ellipsis max-w-[160px] cursor-default">
                  {session.user?.email}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png\" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <LuUser size="1.2em" className=" mr-2" />
                      My Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <LuShapes size="1.2em" className=" mr-2" />
                      My Diagrams
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IoSettingsOutline size="1.2em" className=" mr-2" />{" "}
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleSignOut}>
                      <TbLogout size="1.3em" className=" text-red-600 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </div>

        {/* Mobile View */}

        <ul
          className={`
        md:hidden bg-black absolute uppercase w-full text-left h-full bottom-0 py-24 pl-4 duration-500 ${
          menuOpen ? "left-0" : "-left-full"
        }`}
        >
          <li>
            <a
              href="/"
              rel="noopener noreferrer"
              className="py-7 px-3 inline-block filter"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="py-7 px-3 inline-block filter"
            >
              Tutorials
            </a>
          </li>
          <li>
            <button className="py-7 px-3 inline-block filter uppercase">
              Contact us
            </button>
          </li>
          <li>
            <a
              href="/about"
              target="_blank"
              rel="noopener noreferrer"
              className="py-7 px-3 inline-block filter"
            >
              About us
            </a>
          </li>
          <div className="flex items-start justify-start mx-3 my-6 gap-4 ">
            {!session ? (
              <>
                <button className=" bg-[#696969] px-3 py-2 rounded-lg text-black font-semibold transform transition-transform hover:scale-105">
                  <a href="/account/signup" rel="noopener noreferrer">
                    Sign up
                  </a>
                </button>
                <button className=" bg-[#6547eb] px-3 py-2 rounded-lg  text-black font-semibold transform transition-transform hover:scale-105">
                  <a href="/account/signin" rel="noopener noreferrer">
                    Sign In
                  </a>
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-start gap-4 min-w-[200px]">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="https://github.com/shadcn.png\" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className=" text-white text-xl font-medium px-2 overflow-hidden overflow-ellipsis max-w-[240px] cursor-default">
                    {session.user?.email}
                  </span>
                </div>
              </>
            )}
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
