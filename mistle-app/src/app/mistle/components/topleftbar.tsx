import { LuFileJson2 } from "react-icons/lu";
import { BsFiletypeSvg } from "react-icons/bs";
import { BsFiletypePng } from "react-icons/bs";
import { FaUpload } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import Link from "next/link";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Topleftbar = ({
  loading,
  diagramName,
  handleNameChange,
  handleKeyPress,
  handleFileChange,
  handleSave,
  setDiagramName,
  format,
  setFormat,
}: any) => {
  return (
    <div
      className={`${loading ? "show" : "load"}
      fixed z-10 top-6 left-4 flex items-center justify-center gap-4`}
    >
      <Link href="/" target="_blank">
        <img
          src="/logo.svg"
          alt="logo"
          className="h-10 hover:scale-110 transition-transform ease-in-out cursor-pointer"
        />
      </Link>
      <input
        type="text"
        placeholder="Untitled Diagram"
        value={diagramName}
        onChange={handleNameChange}
        onKeyDown={handleKeyPress}
        className="bg-[#1a1a1a] border border-neutral-600 rounded-md pl-2 pb-[2px] hidden md:block"
      />
      <input
        type="file"
        onChange={(e) => handleFileChange(e)}
        accept=".json"
        className="hidden"
        id="file-input"
      />
      <label
        htmlFor="file-input"
        className="bg-[#1a1a1a] border border-neutral-600 text-white text-sm py-1 px-2 rounded-md cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 hover:text-cyan-500 active:scale-95"
      >
        <FaUpload />
        Load
      </label>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="bg-[#1a1a1a] border border-neutral-600 text-white text-sm py-1 px-2 rounded-md cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 hover:text-emerald-500 active:scale-95">
            <FaDownload />
            Save
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="sm:max-w-[385px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-main">
              Save Diagram
            </AlertDialogTitle>
            <AlertDialogDescription>
              Choose Name and Format to save your Diagram.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5 my-2 ">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                autoComplete="off"
                className="py-4 focus:outline-none focus:border-neutral-400"
                placeholder="Name of your diagram"
                value={diagramName}
                onChange={(e) => setDiagramName(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="filetype">Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger id="filetype">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="JSON">
                    <div className="flex items-center justify-start gap-2">
                      <LuFileJson2 size="1.6em" />
                      <span>JSON</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="SVG">
                    <div className="flex items-center justify-start gap-2">
                      <BsFiletypeSvg size="1.6em" />
                      <span>SVG</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="PNG">
                    <div className="flex items-center justify-start gap-2">
                      <BsFiletypePng size="1.6em" />
                      <span>PNG</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <AlertDialogFooter className="mt-10">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleSave(format)}
              disabled={!format}
              className="px-6 disabled:bg-neutral-800 bg-main text-neutral-50 hover:bg-main hover:ring-1 ring-violet-300 font-semibold"
            >
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Topleftbar;
