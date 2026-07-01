import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ResponsibleAI } from "@/components/layout/responsible-ai";
import { MessageSquare, Send, Trash2, Sparkles, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/chat")({
  head: () => ({ meta: [{ title: "AI Legal Chat — Chambers OS" }] }),
  component: Chat,
});

const SUGGESTIONS = [
  "Explain res judicata with a simple example.",
  "Draft me a 1-paragraph tender for defence.",
  "What are the elements of estoppel in SA law?",
  "Summarise the CCMA arbitration process.",
];

const CHAT_KEY = "chambers.chat.v1";

function Chat() {
  const [input, setInput] = useState("");
  const [initial] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(CHAT_KEY) || "[]");
    } catch {
      return [];
    }
  });

  const { messages, sendMessage, status, setMessages } = useChat({
    messages: initial,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (e) => toast.error(e.message || "Chat error"),
  });

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
    } catch {
      /* ignore */
    }
  }, [messages]);

  const busy = status === "submitted" || status === "streaming";
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  function submit(text?: string) {
    const value = (text ?? input).trim();
    if (!value || busy) return;
    sendMessage({ text: value });
    setInput("");
  }

  function clear() {
    setMessages([]);
    localStorage.removeItem(CHAT_KEY);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-5xl flex-col px-6 py-6">
      <PageHeader
        icon={<MessageSquare className="size-5" />}
        title="AI Legal Chat"
        description="Streaming, persistent conversations with your Chambers OS assistant."
        actions={
          <Button variant="outline" size="sm" onClick={clear} disabled={!messages.length}>
            <Trash2 className="mr-1.5 size-3.5" /> Clear chat
          </Button>
        }
      />

      <div
        ref={listRef}
        className="glass flex-1 space-y-4 overflow-y-auto rounded-xl p-4"
      >
        {messages.length === 0 && (
          <div className="grid h-full place-items-center text-center">
            <div>
              <Sparkles className="mx-auto mb-3 size-8 text-primary/70" />
              <p className="text-sm text-muted-foreground">
                Ask anything — I'll answer with citations to verify.
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="rounded-lg border border-border bg-card/60 p-3 text-left text-sm transition hover:border-primary/40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((m) => {
          const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
          const mine = m.role === "user";
          return (
            <div key={m.id} className={`flex gap-3 ${mine ? "justify-end" : ""}`}>
              {!mine && (
                <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                  <Bot className="size-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                  mine
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card/80"
                }`}
              >
                {text}
                {!mine && busy && m === messages[messages.length - 1] && (
                  <span className="ml-1 inline-block animate-pulse text-primary">▍</span>
                )}
              </div>
              {mine && (
                <div className="grid size-8 shrink-0 place-items-center rounded-full bg-accent">
                  <User className="size-4" />
                </div>
              )}
            </div>
          );
        })}

        {busy && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-3">
            <div className="grid size-8 place-items-center rounded-full bg-primary/15 text-primary">
              <Bot className="size-4" />
            </div>
            <div className="rounded-2xl border border-border bg-card/80 px-4 py-2.5 text-sm text-muted-foreground">
              <span className="inline-flex gap-1">
                <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-primary" />
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="glass flex items-end gap-2 rounded-xl p-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="Ask your legal question…  (Enter to send, Shift+Enter for newline)"
            rows={1}
            className="min-h-[44px] resize-none border-0 bg-transparent focus-visible:ring-0"
          />
          <Button
            onClick={() => submit()}
            disabled={busy || !input.trim()}
            className="bg-primary text-primary-foreground"
          >
            <Send className="size-4" />
          </Button>
        </div>
        <ResponsibleAI />
      </div>
    </div>
  );
}
