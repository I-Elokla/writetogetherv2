"use client";

import Loading from "../loading";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
import { useSearchParams } from "next/navigation";
import Editor from "../tiptap/editor";
import Link from "next/link";

export default function EditorPage() {
  const params = useSearchParams();
  const docId = params?.get("docId");
  const roomId = docId
    ? `userspace:nextjs-tiptap-${docId}`
    : "userspace:nextjs-tiptap";

  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider id={roomId} initialPresence={{ cursor: null }}>
        <div className="p-4">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
        <ClientSideSuspense fallback={<Loading />}>
          <Editor />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
