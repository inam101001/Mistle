"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  // State for handling form input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  //const session = useSession();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    if (!password || password.length < 10) {
      setError("Password is invalid");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      if (res?.url) router.replace("/");
    } else {
      setError("");
    }
  };

  //loading screen goes here
  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <>
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="w-full max-w-xs p-8 mb-12">
            <h1 className="text-3xl font-bold mb-4">Sign In</h1>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Email</label>
                <input
                  className=" text-black pl-1 block mb-1"
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
                  Sign In
                </button>
                {
                  <p className="text-red-600 text-[16px] mb-4">
                    {error && error}
                  </p>
                }
              </div>
            </form>
            <div className="text-center text-gray-500 mt-4">- OR -</div>
            <Link
              className="block text-center text-blue-500 hover:underline mt-2"
              href="./signup"
            >
              Sign Up
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  );
}
