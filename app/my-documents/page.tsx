"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

type Doc = {
  code: string;
  title: string;
  createdAt: string;
};

export default function MyDocumentsPage() {
  const router = useRouter();
  const [docs, setDocs] = useState<Doc[] | null>(null);
  const [error, setError] = useState<string>("");
  const { data } = authClient.useSession();
  const user = data?.user;

  useEffect(() => {
    if (!user) return;
    fetch(`/api/documents?owner=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setDocs(data.documents);
      })
      .catch((err) => setError(err.message));
  }, [user]);

  if (!user) return;

  const deleteDoc = async (code: string) => {
    if (!confirm(`Delete document "${code}"? This cannot be undone.`)) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/documents`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner: user.email, code }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to delete");
    } else {
      setDocs((prev) => prev?.filter((d) => d.code !== code) ?? null);
    }
  };

  if (docs === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        {error ? <p className="text-red-600">{error}</p> : <p>Loading…</p>}
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Documents</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          ← Home
        </Link>
      </div>

      {docs.length === 0 && (
        <p className="text-gray-600">You haven’t created any documents yet.</p>
      )}

      <ul className="space-y-4">
        {docs.map((doc) => (
          <li
            key={doc.code}
            className="flex justify-between items-center p-4 border rounded hover:shadow"
          >
            <div
              className="flex-1 cursor-pointer"
              onClick={() => router.push(`/editor?docId=${doc.code}`)}
            >
              <div className="font-medium">{doc.title}</div>
              <div className="text-sm text-gray-600">Code: {doc.code}</div>
              <div className="text-sm text-gray-500">
                {new Date(doc.createdAt).toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => deleteDoc(doc.code)}
              className="ml-4 text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
