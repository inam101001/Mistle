"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/verifyemail", { token });
      setVerified(true);
    } catch (error: any) {
      setError(true);
      console.log(error.reponse.data);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("token=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  if (!token) {
    return (
      <div className=" flex min-h-screen items-center justify-center gap-6 lg:gap-12">
        <img src="/logo.svg" className="size-16"></img>
        <div className="border-r-2 h-12"></div>
        <p className="text-xl">Invalid Verify Email Link</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      {verified && (
        <div className="flex flex-col min-h-screen items-center justify-center gap-8">
          <a href="/">
            <img src="/logotext.svg" className=" w-60"></img>
          </a>
          <h1 className="text-2xl font-semibold text-center">
            Your Email is Verified Successfully
          </h1>
          <Link
            className="ml-1 text-center font-semibold text-main hover:underline mt-2"
            href="../account/signin"
          >
            Go to Sign In
          </Link>
        </div>
      )}
      {error && (
        <div>
          <h2 className="text-2xl font-semibold text-center text-red-600">
            {error}
          </h2>
        </div>
      )}
    </div>
  );
}
