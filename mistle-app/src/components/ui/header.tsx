"use client";
import React, { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { Squash as Hamburger } from "hamburger-react";

import { IoSettingsOutline } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import { SiGithub } from "react-icons/si";
import { FaDiscord } from "react-icons/fa";
import { CgMail } from "react-icons/cg";

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
import Link from "next/link";
import HeaderAvatar from "./headerAvatar";

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
    <nav className="bg-black lg:bg-purple-900 lg:bg-clip-padding lg:backdrop-blur lg:bg-opacity-5 z-50 py-5 lg:fixed lg:top-0 lg:left-0 lg:right-0">
      <div className="flex items-center font-medium justify-start lg:justify-between pl-6 pr-4">
        <div className="z-30 lg:w-auto w-full flex items-center justify-between">
          <Link href="/mistle" target="_blank">
            <img src="/logotext.svg" alt="logo" className="h-7 filter" />
          </Link>
          <div className="lg:hidden">
            <Hamburger
              toggled={menuOpen}
              toggle={setMenuOpen}
              size={28}
              duration={0.3}
              rounded
            />
          </div>
        </div>
        <ul className="lg:flex uppercase hidden items-center xl:ml-20 ml-18 gap-10">
          <li className="filter">
            <Link href="/" rel="noopener noreferrer">
              Home
            </Link>
          </li>
          <li className="filter">
            <Link href="/tutorials" rel="noopener noreferrer">
              Tutorials
            </Link>
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
            <Link href="/about" rel="noopener noreferrer">
              About us
            </Link>
          </li>
        </ul>
        <HeaderAvatar showText={true} openLink="_blank" />
        {/* Mobile View */}

        <ul
          className={`
        lg:hidden bg-black absolute w-full z-20 text-left h-full bottom-0 py-24 pl-4 duration-500 ${
          menuOpen ? "left-0" : "-left-full"
        }`}
        >
          <li>
            <Link
              href="/"
              rel="noopener noreferrer"
              className="py-7 px-3 inline-block filter"
            >
              HOME
            </Link>
          </li>
          <li>
            <Link
              href="/tutorials"
              rel="noopener noreferrer"
              className="py-7 px-3 inline-block filter"
            >
              TUTORIALS
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              rel="noopener noreferrer"
              className="py-7 px-3 inline-block filter"
            >
              ABOUT US
            </Link>
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
                  <Link href="/account/signup" rel="noopener noreferrer">
                    Sign up
                  </Link>
                </button>
                <button className=" bg-main px-3 py-2 rounded-lg  text-black font-semibold transform transition-transform hover:scale-105">
                  <Link href="/account/signin" rel="noopener noreferrer">
                    Sign In
                  </Link>
                </button>
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-start gap-2">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src="https://github.com/shadcn.png\" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className=" text-white text-xl whitespace-nowrap font-medium ml-2 mr-6 overflow-hidden overflow-ellipsis max-w-[40%] cursor-default">
                    {session.user?.email}
                  </span>
                  <IoSettingsOutline size="1.8em" className="mr-4" />
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <TbLogout
                        size="1.8em"
                        className=" text-red-600 cursor-pointer"
                      />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will log you out of your current session. You
                          will have to log in again to access your diagrams.
                          servers.
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
        </ul>
      </div>
    </nav>
  );
};

export default Header;
