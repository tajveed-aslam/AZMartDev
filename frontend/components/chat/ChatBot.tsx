"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import { getImageUrl } from "@/lib/formatters";
import { useCurrency } from "@/hooks/useCurrency";
import type { Product } from "@/types";

interface Message {
  role: "user" | "bot";
  text: string;
  products?: Product[];
}

const INITIAL_MESSAGE: Message = {
  role: "bot",
  text: "Hi! I can help you find the perfect product. Ask me anything like \"best perfume under 10000\" or \"gift ideas for kids\" 🎁",
};

export function ChatBot() {
  const { format } = useCurrency();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chat", { message: text });
      setMessages((prev) => [...prev, { role: "bot", text: res.data.reply, products: res.data.products }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Sorry, I couldn't connect right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-primary text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-110 transition-all duration-200 flex items-center justify-center"
        aria-label="Open chat assistant"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl shadow-indigo-200/60 border border-gray-100 flex flex-col overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="gradient-primary px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl">🤖</div>
            <div>
              <p className="font-bold text-white text-sm">A&Z Assistant</p>
              <p className="text-indigo-200 text-xs">Powered by product search</p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-white/70 hover:text-white transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[380px] bg-gray-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
                {msg.role === "bot" && (
                  <div className="w-7 h-7 rounded-xl gradient-primary flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">
                    🤖
                  </div>
                )}
                <div className={`max-w-[85%] space-y-2`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "btn-gradient rounded-tr-sm"
                      : "bg-white border border-gray-100 text-gray-700 rounded-tl-sm shadow-sm"
                  }`}>
                    {msg.text}
                  </div>
                  {msg.products && msg.products.length > 0 && (
                    <div className="space-y-2">
                      {msg.products.map((p) => (
                        <Link
                          key={p.id}
                          href={`/products/${p.id}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 bg-white rounded-xl p-2.5 border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all duration-200"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                            {p.images[0] && (
                              <Image
                                src={getImageUrl(p.images[0])}
                                alt={p.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">{p.name}</p>
                            <p className="text-xs font-bold text-indigo-600">{format(p.price)}</p>
                          </div>
                          <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start gap-2">
                <div className="w-7 h-7 rounded-xl gradient-primary flex items-center justify-center text-white text-xs flex-shrink-0">🤖</div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about products..."
                className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
