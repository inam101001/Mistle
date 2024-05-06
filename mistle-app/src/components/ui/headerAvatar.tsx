import React from "react";
import { signOut, useSession } from "next-auth/react";
import HeaderButton from "./headerButton";
import { LuUser } from "react-icons/lu";
import { LuShapes } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";

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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const HeaderAvatar = ({
  showText,
  openLink,
}: {
  showText: boolean;
  openLink: string;
}) => {
  const { data: session }: any = useSession();

  function handleSignOut() {
    signOut();
  }

  return (
    <div
      className={`${
        showText ? `lg:flex hidden` : "flex"
      } items-center justify-center gap-4 px-2`}
    >
      {!session ? (
        <>
          {showText && (
            <>
              <HeaderButton type="signup" name="Sign up" color="gray" />
              <HeaderButton type="signin" name="Sign In" color="indigo" />
            </>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-end gap-4 min-w-[200px]">
            {showText && (
              <span className=" text-white font-medium whitespace-nowrap px-2 overflow-hidden overflow-ellipsis max-w-[160px] cursor-default">
                {session.user?.email}
              </span>
            )}
            <AlertDialog>
              <Sheet>
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png\" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <LuUser size="1.2em" className="mr-2" />
                      My Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <SheetTrigger className="flex flex-row">
                        <LuShapes size="1.2em" className=" mr-2" />
                        My Diagrams
                      </SheetTrigger>
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
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="flex flex-row items-center justify-start">
                      <LuShapes size="1.8em" className=" mr-3" />
                      <span className="text-xl">My Diagrams</span>
                    </SheetTitle>
                  </SheetHeader>
                  <SheetDescription className="mt-8 pt-8 border-t">
                    {/* Fetch Diagrams from DB and Map &  set OnClick D*/}
                    <ul
                      className="px-2 pb-32 h-screen flex flex-col items-center justify-start"
                      style={{
                        scrollbarWidth: "none",
                        overflowY: "scroll",
                      }}
                    >
                      <li className="relative mt-2 mb-6 cursor-pointer">
                        <div
                          onClick={() =>
                            window.open(
                              "/mistle?diagram=BlockDiagram",
                              openLink
                            )
                          }
                          className="bg-center flex flex-col items-center justify-end bg-cover rounded-2xl bg-no-repeat h-40 md:h-48 w-64 md:w-80 overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 "
                          style={{
                            backgroundImage: `url("/tutorials/library-management-system.png")`,
                          }}
                        >
                          <h1 className="bg-violet-700 text-white text-based whitespace-nowrap overflow-hidden overflow-ellipsis font-semibold text-center w-full px-4 py-2">
                            Diagram Name goes heredsadasdsadsaasdasdsad
                          </h1>
                        </div>
                      </li>
                    </ul>
                  </SheetDescription>
                </SheetContent>
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
              </Sheet>
            </AlertDialog>
          </div>
        </>
      )}
    </div>
  );
};

export default HeaderAvatar;
