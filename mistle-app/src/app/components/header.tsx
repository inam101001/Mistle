"use client";
import React, { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Button from "./button";

import { LuUser } from "react-icons/lu";
import { LuShapes } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import { SiGithub } from "react-icons/si";
import { FaDiscord } from "react-icons/fa";
import { CgMail } from "react-icons/cg";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function Contacts() {
  return (
    <div className=" space-y-4">
      <div className="flex items-center justify-start gap-2">
        <CgMail color="#eb493b" size="2em" className="logoshadow" />
        <a
          href="mailto:mistlediagrams@gmail.com"
          rel="noopener noreferrer"
          className="hover:text-gray-300 hover:underline font-medium ml-1"
        >
          E-mail Address
        </a>
      </div>
      <div className="flex items-center justify-start gap-2 mt-3">
        <SiGithub size="1.5em" className=" ml-[3px] logoshadow" />
        <a
          href="https://github.com/Mistle-Diagrams/Mistle"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300 hover:underline font-medium ml-[7px]"
        >
          Github Repository
        </a>
      </div>
      <div className="flex items-center justify-start gap-2 mt-3">
        <FaDiscord
          color="#5d6af2"
          size="1.5em"
          className=" ml-[2px] logoshadow"
        />
        <a
          href="https://discord.gg/hXkwdH5Uvr"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300 hover:underline font-medium ml-[7.5px]"
        >
          Discord Server
        </a>
      </div>
    </div>
  );
}

const Header = () => {
  const { data: session }: any = useSession();
  const [menuOpen, setMenuOpen] = React.useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  function handleSignOut() {
    signOut();
  }

  return (
    <nav className="bg-black lg:bg-purple-900 lg:bg-clip-padding lg:backdrop-blur lg:bg-opacity-5 py-5 z-10 lg:fixed lg:top-0 lg:left-0 lg:right-0 w-screen">
      <div className="flex items-center font-medium justify-start lg:justify-between px-6">
        <div className="z-50 lg:w-auto w-full flex items-center justify-between">
          <a href="/">
            <img src="/logotext.svg" alt="logo" className="h-7 filter" />
          </a>
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden self-end"
          >
            <img
              src={menuOpen ? "/close.svg" : "/menu.svg"}
              alt="menu"
              className={`h-12 rotate ${menuOpen ? "open" : ""}`}
            />
          </div>
        </div>
        <ul className="lg:flex uppercase hidden items-center xl:ml-20 ml-18 gap-10">
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
            <Dialog>
              <DialogTrigger className="outline-none filter uppercase">
                Contact us
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Contact Us</DialogTitle>
                  <DialogDescription>
                    <div className="mb-6">
                      You can reach us out via our email address or join our
                      Discord server for more information.
                    </div>
                    <div className="flex flex-column justify-between items-center">
                      <Contacts />
                      <img
                        src="/logotext.svg"
                        alt="logo"
                        className="h-10 mt-6 mr-3 logoshadow"
                      />
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </li>
          <li className="filter">
            <a href="/about" rel="noopener noreferrer">
              About us
            </a>
          </li>
        </ul>
        <div className="lg:flex items-center justify-center gap-4 hidden px-2">
          {!session ? (
            <>
              <Button type="signup" name="Sign up" color="gray" />
              <Button type="signin" name="Sign In" color="indigo" />
            </>
          ) : (
            <>
              <div className="flex items-center justify-end gap-4 min-w-[200px]">
                <span className=" text-white font-medium whitespace-nowrap px-2 overflow-hidden overflow-ellipsis max-w-[160px] cursor-default">
                  {session.user?.email}
                </span>
                <AlertDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
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
                        <IoSettingsOutline size="1.2em" className=" mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <AlertDialogTrigger className="flex flex-row gap-[6px]">
                          <TbLogout size="1.3em" className=" text-red-600" />
                          Sign Out
                        </AlertDialogTrigger>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will log you out of your current session. You will
                        have to log in again to access your diagrams. servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSignOut}>
                        Sign Out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </>
          )}
        </div>

        {/* Mobile View */}

        <ul
          className={`
        lg:hidden bg-black absolute w-full z-10 text-left h-full bottom-0 py-24 pl-4 duration-500 ${
          menuOpen ? "left-0" : "-left-full"
        }`}
        >
          <li>
            <a
              href="/"
              rel="noopener noreferrer"
              className="py-7 px-3 inline-block filter"
            >
              HOME
            </a>
          </li>
          <li>
            <a
              href="/"
              rel="noopener noreferrer"
              className="py-7 px-3 inline-block filter"
            >
              TUTORIALS
            </a>
          </li>
          <li>
            <a
              href="/about"
              rel="noopener noreferrer"
              className="py-7 px-3 inline-block filter"
            >
              ABOUT US
            </a>
          </li>
          <li>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className="px-3 py-4 inline-block">
                <AccordionTrigger className="filter outline-none">
                  CONTACT US
                </AccordionTrigger>
                <AccordionContent>
                  <Contacts />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
                  <span className=" text-white text-xl whitespace-nowrap font-medium px-2 overflow-hidden overflow-ellipsis max-w-[200px] cursor-default">
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
