"use client";

import { isValidElement, useEffect, useState } from "react";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SignUp() {
  // State for handling form input
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const router = useRouter();

  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/mistle");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    //const name = e.target[0].value;
    const email = e.target[0].value;
    const password = e.target[1].value;
    //More Data Fields go here!

    if (!isValidEmail(email)) {
      setError("Email is Invalid!");
      return;
    }

    if (!password || password.length < 5) {
      setError("Password is Invalid!");
      return;
    }

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
        setError("This E-mail is already registered!");
      }
      if (res.status === 200) {
        setError("");
        router.push("/account/signin");
      }
    } catch (error) {
      setError("Error, Try Again");
      console.log(error);
    }
  };

  //loading goes here
  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }

  // You can make an API call or use any authentication library here
  return (
    sessionStatus !== "authenticated" && (
      <>
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="w-full max-w-xs p-8">
            <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Email</label>
                <input
                  className="block text-black pl-1 mb-1"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  className="block text-black pl-1 mb-1"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <button
                  className="bg-neutral-300 text-black font-medium p-2 rounded-md mt-2"
                  type="submit"
                >
                  Sign Up
                </button>
                <p className="text-red-600 text-[16px] mb-4">
                  {error && error}
                </p>
              </div>
            </form>
            <div className=" text-gray-500 mt-4 ">
              Have an account?
              <Link
                className="ml-1 text-center text-white hover:underline mt-2"
                href="./signin"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  );
}
