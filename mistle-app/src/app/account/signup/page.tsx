"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function SignUpPage() {
  // State for handling form input
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/"); //Or dashboard if there is signed in User dashboard
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    //const name = e.target[0].value;
    const email = e.target[0].value;
    const password = e.target[1].value;
    //More Data Fields go here!

    if (!isValidEmail(email)) {
      setError("Email is Invalid!");
      return;
    }

    if (!password || password.length < 5) {
      setError("Minimum password length is 5 characters.");
      //Properly address correct password format
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("../api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (res.status === 400) {
        setError("This Email is already registered!");
      }
      if (res.status === 200) {
        setError("");
        await signIn("credentials", {
          email,
          password,
          callbackUrl: "/", // Redirect to home page after successful sign-in
          redirect: false, // Do not redirect automatically, we handle it manually
        });
        router.replace("/");
      }
    } catch (error) {
      setError("Error! Try Again");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  //loading goes here
  if (sessionStatus === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img
          src="/logo.svg"
          alt="loading"
          className="w-24 h-24 animate-bounce"
        />
      </div>
    );
  }
  // You can make an API call or use any authentication library here
  return (
    sessionStatus !== "authenticated" && (
      <div className=" overflow-hidden">
        <div className="flex justify-center border border-gray-500 rounded-3xl mt-5 mx-4 overflow-hidden p-1 box-border">
          <div className="w-full lg:w-1/2 border-white rounded-3xl m-12 flex flex-col items-center justify-start ">
            <h1 className="text-3xl font-semibold mt-8">Create an account</h1>
            <div className=" text-gray-500 mb-8">
              Already have an account?
              <Link
                className="ml-1 text-center font-semibold text-main hover:underline mt-2"
                href="./signin"
              >
                Sign In
              </Link>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 text-sm bg-transparent p-2.5 block w-80 rounded-md border placeholder:font-extralight border-neutral-700 focus:outline-none focus:ring-main focus:border-main"
                />
              </div>
              <div className="mb-2">
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 text-sm bg-transparent p-2.5 block w-80 rounded-md border placeholder:font-extralight border-neutral-700 focus:outline-none focus:ring-main focus:border-main"
                />
              </div>
              {
                <p className="text-red-600 text-[16px] mb-4">
                  {error && error}
                </p>
                // Error message goes to Toasts
              }
              <button
                type="submit"
                disabled={isLoading}
                className="w-80 py-2.5 px-4 border border-transparent rounded-full shadow-sm text-white font-semibold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2  focus:ring-indigo-500 disabled:bg-[#836BF0]"
              >
                {isLoading ? "Please wait..." : "Sign Up"}
              </button>
            </form>
            <hr className="w-80 h-[1px] mx-auto my-8 bg-gradient-to-r from-transparent via-gray-100 to-transparent border-0 rounded" />
            <a
              href="#"
              className="text-sm border border-gray-500 w-80 text-center py-3 px-4 mb-4 rounded-full flex gap-16 hover:border-main"
            >
              <FcGoogle size={"1.5em"} />
              Sign up with Google
            </a>
            <a
              href="#"
              className="text-sm border border-gray-500 w-80 text-center py-3 px-4 mb-8 rounded-full flex gap-16 hover:border-main"
            >
              <FaGithub size={"1.5em"} />
              Sign up with Github
            </a>
            <a
              href="/"
              className="text-gray-800 text-sm font-medium hover:text-gray-300 flex justify-center items-center gap-1 mt-4"
            >
              <MdOutlineArrowBackIosNew /> Go Back
            </a>
          </div>
          <div className="hidden lg:w-1/2 lg:flex rounded-5xl items-center justify-center bg-[url('/AccountBG.svg')] bg-opacity-50">
            <img
              src="/signup.svg"
              alt="Login Image"
              className="object-cover h-9/10 teeter"
            />
          </div>
        </div>
      </div>
    )
  );
}
