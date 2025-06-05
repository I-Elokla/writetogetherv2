"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontSize from "@tiptap/extension-font-size";
import BlockQuoteIcon from "./icons/blockquote-icon";
import BoldIcon from "./icons/bold-icon";
import HeadingOneIcon from "./icons/heading-one-icon";
import HeadingTwoIcon from "./icons/heading-two-icon";
import HeadingThreeIcon from "./icons/heading-three-icon";
import {
  useLiveblocksExtension,
  FloatingToolbar,
} from "@liveblocks/react-tiptap";

interface LanguageToolMatch {
  message: string;
  offset: number;
  length: number;
  rule: {
    issueType: string;
  };
}

export default function TiptapEditor() {
  const liveblocks = useLiveblocksExtension();

  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          "outline-none flex-1 px-4 py-3 transition-all prose prose-invert prose-slate max-w-none",
      },
    },
    extensions: [
      StarterKit.configure({ history: false }),
      TextStyle.configure({ types: ["textStyle"] }),
      Color.configure({ types: ["textStyle"] }),
      FontSize.configure({ types: ["textStyle"] }),
      liveblocks,
    ],
  });

  const [checking, setChecking] = useState(false);
  const [matches, setMatches] = useState<LanguageToolMatch[]>([]);

  const checkGrammar = async () => {
    if (!editor) return;
    setChecking(true);
    const text = editor.getText();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/language`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: "en-US" }),
      });
      if (!res.ok) {
        console.error("LanguageTool API error", await res.text());
        setMatches([]);
      } else {
        const data = await res.json();
        setMatches(data.matches);
      }
    } catch (err) {
      console.error("Grammar check failed", err);
      setMatches([]);
    } finally {
      setChecking(false);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Toolbar */}
      <div className="border-b border-border/80 bg-background flex items-center gap-1 p-1">
        {/* Heading Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <HeadingOneIcon className="h-4 w-4" />
              Heading
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {[1, 2, 3].map((lvl) => (
              <DropdownMenuItem
                key={lvl}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: lvl }).run()
                }
              >
                {lvl === 1 && <HeadingOneIcon className="mr-2 h-4 w-4" />}
                {lvl === 2 && <HeadingTwoIcon className="mr-2 h-4 w-4" />}
                {lvl === 3 && <HeadingThreeIcon className="mr-2 h-4 w-4" />}
                Heading {lvl}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Bold Toggle */}
        <Toggle
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          size="sm"
          className="gap-2"
        >
          <BoldIcon className="h-4 w-4" />
          Bold
        </Toggle>

        {/* Blockquote Toggle */}
        <Toggle
          pressed={editor.isActive("blockquote")}
          onPressedChange={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
          size="sm"
          className="gap-2"
        >
          <BlockQuoteIcon className="h-4 w-4" />
          Quote
        </Toggle>

        {/* Font Size Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              Font Size
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {["12px", "16px", "24px", "32px", "48px"].map((size) => (
              <DropdownMenuItem
                key={size}
                onClick={() =>
                  editor.chain().focus().setFontSize(size).run()
                }
              >
                {size}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Color Picker */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              Text Color
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-2">
            <input
              type="color"
              onInput={(e) =>
                editor
                  .chain()
                  .focus()
                  .setColor((e.target as HTMLInputElement).value)
                  .run()
              }
              className="h-8 w-8 border-0 p-0"
            />
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Grammar Check Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={checkGrammar}
          disabled={checking}
          className="ml-auto"
        >
          {checking ? "Checking…" : "Check Grammar"}
        </Button>
      </div>

      {/* Grammar Suggestions */}
      {matches.length > 0 && (
        <div className="bg-yellow-50 border-t border-yellow-300 p-4">
          <h4 className="font-semibold mb-2">Suggestions:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {matches.map((m, i) => {
              const snippet = editor
                .getText()
                .substring(m.offset, m.offset + m.length);
              return (
                <li key={i}>
                  <strong>{m.rule.issueType}:</strong> “{snippet}” — {m.message}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Editor Content */}
      <div className="relative flex flex-col items-center w-full p-4 flex-1">
        <Card className="flex-1 max-w-[1000px] w-full">
          <CardContent className="p-0 h-full">
            <div className="relative flex flex-1 flex-col gap-2 h-full">
              <EditorContent editor={editor} className="h-full" />
              <FloatingToolbar editor={editor} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
