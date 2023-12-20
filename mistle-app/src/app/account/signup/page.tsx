"use client";

import { useState } from "react";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

export default function SignUp() {
  // State for handling form input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // You can make an API call or use any authentication library here
  return (
    <>
      <Header />
      <div className="flex items-center justify-center h-screen">
        <div className="w-full max-w-xs p-8">
          <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
          <form onSubmit={() => console.log("submitted")}>
            <div>
              <label>Name</label>
              <input
                className="block text-black pl-1 mb-1"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
