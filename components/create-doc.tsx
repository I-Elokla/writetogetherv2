"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateDoc() {
  const [docTitle, setDocTitle] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const user = data?.user;

  if (!user || isPending) {
    return <p>Loading..</p>;
  }

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) {
      alert("Please enter a document title.");
      return;
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner: user.email, title: docTitle }),
    });

    const { code, error } = await res.json();
    if (error) {
      alert(error);
    } else {
      router.push(`/editor?docId=${code}`);
    }
  };

  const handleJoinDoc = () => {
    if (inviteCode.trim()) {
      router.push(`/editor?docId=${inviteCode.trim()}`);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center w-full max-w-xl mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        <button
          onClick={async () => {
            await authClient.signOut(
              {},
              {
                onSuccess: () => {
                  console.log("signed out");
                  router.refresh();
                },
              }
            );
          }}
          className="text-red-600 hover:underline"
        >
          Sign out
        </button>
      </div>

      <form
        onSubmit={handleCreateDoc}
        className="flex gap-2 w-full max-w-xl mb-6"
      >
        <input
          type="text"
          placeholder="New document title"
          value={docTitle}
          onChange={(e) => setDocTitle(e.target.value)}
          className="border px-4 py-2 rounded flex-1"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Create
        </button>
      </form>

      <div className="flex gap-4 mb-6">
        <Link
          href="/my-documents"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
        >
          My Documents
        </Link>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter document code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        <button
          onClick={handleJoinDoc}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Join
        </button>
      </div>
    </main>
  );
}
