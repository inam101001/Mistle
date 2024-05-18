import { LuUndo } from "react-icons/lu";
import { LuRedo } from "react-icons/lu";
import { GiArrowCursor } from "react-icons/gi";
import { LuShapes } from "react-icons/lu";
import { FaRegNoteSticky } from "react-icons/fa6";
import { BiHelpCircle } from "react-icons/bi";
import { RiFileCloseLine } from "react-icons/ri";
import { LuLayoutTemplate } from "react-icons/lu";
import { TbArrowCurveLeft } from "react-icons/tb";
import { BsArrowUpRight } from "react-icons/bs";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import HelpModal from "@/components/ui/shortcuts-modal";
import { cards } from "@/app/data/diagrams";

const Leftbar = ({
  loading,
  pallete,
  setPallete,
  linkType,
  setLinkType,
  diagramRef,
}: any) => {
  return (
    <div
      className={`${loading ? "show" : "load"}
fixed z-10 top-[20%] left-4 flex flex-col items-center justify-center gap-4 max-h-screen`}
    >
      <div className="w-10 pt-1 pb-2 bg-slate-950 rounded-lg flex flex-col items-center justify-center gap-2">
        <GiArrowCursor
          onClick={() => setPallete(false)}
          size="2em"
          className=" text-purple-400 hover:bg-slate-800 active:bg-slate-900 rounded-lg p-1 mt-1"
        />
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <LuShapes
                onClick={() => setPallete((prevPallete: any) => !prevPallete)}
                size="2em"
                className={`${
                  pallete ? "bg-slate-800" : ""
                } text-purple-400 hover:bg-slate-800 active:bg-slate-900 rounded-lg p-1 mt-1`}
              />
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="py-0.5">Shapes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger
              onClick={() => setLinkType((prevLinkType: any) => !prevLinkType)}
            >
              {linkType ? (
                <BsArrowUpRight
                  size="2em"
                  className=" text-purple-400 hover:bg-slate-800 active:bg-slate-900 rounded-lg p-1 mt-1"
                />
              ) : (
                <TbArrowCurveLeft
                  size="2em"
                  className=" text-purple-400 hover:bg-slate-800 active:bg-slate-900 rounded-lg p-1 mt-1"
                />
              )}
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="py-0.5">Link Type</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <FaRegNoteSticky
                onClick={() => {}}
                size="2em"
                className=" text-purple-400 hover:bg-slate-800 active:bg-slate-900 rounded-lg p-1 mt-1"
              />
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="py-0.5">Add a Note</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Dialog>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger>
                <DialogTrigger asChild>
                  <LuLayoutTemplate
                    size="2em"
                    className=" text-purple-400 hover:bg-slate-800 active:bg-slate-900 rounded-lg p-1 mt-1"
                  />
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="py-0.5">Templates</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DialogContent className="z-50 h-screen md:h-3/4 max-w-4xl">
            <DialogHeader>
              <DialogTitle>Templates</DialogTitle>
              <DialogDescription className="border-t border-purple-400 pt-6">
                <div
                  className="flex h-screen pb-28 md:pb-0 md:h-4/5 flex-wrap items-start justify-center gap-6"
                  style={{ scrollbarWidth: "none", overflowY: "scroll" }}
                >
                  {cards.map((diagram, index) => (
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <div
                        key={index}
                        //Might wanna look into this link structure
                        onClick={() => window.open(diagram.link, "_self")}
                        className="bg-center bg-cover rounded-2xl bg-no-repeat h-36 w-48 overflow-hidden 
       transition-transform duration-300 ease-in-out
       hover:scale-105 "
                        style={{
                          backgroundImage: `url('${diagram.source}')`,
                        }}
                      ></div>
                      <h1 className="text-white text-center w-full">
                        {diagram.alt}
                      </h1>
                    </div>
                  ))}
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger>
                <DialogTrigger asChild>
                  <BiHelpCircle
                    size="2em"
                    className=" text-purple-400 hover:bg-slate-800 active:bg-slate-900 rounded-lg p-1 mt-1"
                  />
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="py-0.5">Shortcuts Help</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DialogContent className="z-50 h-screen md:h-3/4">
            <div className=" overflow-y-hidden">
              <DialogHeader>
                <DialogTitle>Shortcuts Guide</DialogTitle>
                <DialogDescription className=" border-t border-purple-400 pt-8">
                  <HelpModal />
                </DialogDescription>
              </DialogHeader>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="w-10 h-20 bg-slate-950 rounded-lg flex flex-col items-center justify-center gap-2">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <LuUndo
                onClick={() =>
                  diagramRef.current?.getDiagram()?.commandHandler.undo()
                }
                size="2em"
                className=" text-purple-400 hover:bg-slate-800 active:bg-slate-900 rounded-lg p-1 mt-1"
              />
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="py-0.5">
                Undo{" "}
                <span className="bg-neutral-800 py-1 px-1.5 rounded-md">
                  Ctrl + Z
                </span>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <LuRedo
                onClick={() =>
                  diagramRef.current?.getDiagram()?.commandHandler.redo()
                }
                size="2em"
                className=" text-purple-400 hover:bg-slate-800 active:bg-slate-900 rounded-lg p-1 mb-1"
              />
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="py-0.5">
                Redo{" "}
                <span className="bg-neutral-800 py-1 px-1.5 rounded-md">
                  Ctrl + Y
                </span>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="w-10 h-10 bg-slate-950 rounded-lg flex flex-col items-center justify-center gap-2">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <RiFileCloseLine
                onClick={() => {
                  if (
                    window.confirm(
                      "This action cannot be undone. Are you sure you want to clear the canvas?"
                    )
                  ) {
                    diagramRef.current?.getDiagram()?.clear();
                  }
                }}
                size="2em"
                className=" text-red-500 hover:bg-slate-800 active:bg-slate-900 rounded-lg p-1"
              />
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="py-0.5 text-red-400">Clear Canvas</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Leftbar;
