"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.MouseEvent, email: string, password: string) => {
    e.preventDefault();

    const { data, error } = await authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onError: (e) => {
          setError(e.error.message);
        },
        onSuccess: (s) => {
          console.log("success");
          router.push("/")
        },
      }
    );
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-6">Register to WriteTogether</h1>
      <form className="flex flex-col gap-4 w-full max-w-sm bg-white p-6 rounded shadow" onSubmit={(e) => e.preventDefault()}>
        <input
          type="name"
          placeholder="Name"
          className="border px-4 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border px-4 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border px-4 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          onClick={async (e) => handleRegister(e, email, password)}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          type="submit"
        >
          Register
        </button>
        {error && <p className="text-red-600">{error}</p>}
      </form>
      <Link className="mt-4 text-blue-600 hover:underline" href="/login">
        Already have an account? Login
      </Link>
    </main>
  );
}
