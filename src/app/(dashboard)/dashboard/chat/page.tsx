"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Loader2, Bot, User, Sparkles, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your EduFlow AI study assistant powered by Groq. I'm here to help you understand course material, answer questions, and support your learning journey. What would you like to explore today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setStreamingContent("");

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          accumulated += chunk;
          setStreamingContent(accumulated);
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: accumulated }]);
      setStreamingContent("");
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: "Chat cleared! I'm ready to help you with a fresh start. What would you like to learn?",
    }]);
  };

  const suggestions = [
    "Explain this concept in simple terms",
    "Give me an example of this",
    "What are the key takeaways?",
    "How does this apply in real life?",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-blue-400" />
            <span className="gradient-text">AI Study Assistant</span>
          </h1>
          <p className="text-sm text-muted-foreground">Powered by Groq LLaMA 3.3 70B • Streaming responses</p>
        </div>
        <button
          onClick={clearChat}
          className="btn-secondary text-sm"
          title="Clear chat"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
      </div>

      {/* Chat area */}
      <div className="flex-1 glass rounded-2xl border border-border overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
              {/* Avatar */}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                msg.role === "assistant" ? "bg-brand-500/20" : "bg-secondary border border-border"
              )}>
                {msg.role === "assistant" ? (
                  <Bot className="w-4 h-4 text-brand-400" />
                ) : (
                  <User className="w-4 h-4 text-muted-foreground" />
                )}
              </div>

              {/* Bubble */}
              <div className={cn(
                "max-w-[75%] rounded-2xl px-5 py-3 text-sm leading-relaxed",
                msg.role === "assistant"
                  ? "bg-secondary border border-border rounded-tl-sm"
                  : "bg-brand-500/20 border border-brand-500/30 rounded-tr-sm text-right"
              )}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}

          {/* Streaming */}
          {streamingContent && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-brand-400" />
              </div>
              <div className="max-w-[75%] rounded-2xl rounded-tl-sm px-5 py-3 text-sm leading-relaxed bg-secondary border border-border">
                <div className="whitespace-pre-wrap">{streamingContent}</div>
                <span className="inline-block w-0.5 h-4 bg-brand-400 animate-pulse ml-1 align-middle" />
              </div>
            </div>
          )}

          {loading && !streamingContent && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-brand-400" />
              </div>
              <div className="bg-secondary border border-border rounded-2xl rounded-tl-sm px-5 py-4">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="px-6 pb-3">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Try asking
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="text-xs px-3 py-1.5 bg-secondary border border-border rounded-full hover:border-brand-500/50 hover:text-brand-300 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex gap-3 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your course material... (Enter to send)"
              className="input-field resize-none flex-1 min-h-[44px] max-h-32"
              rows={1}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="btn-primary px-4 py-3 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Shift+Enter for new line • Enter to send</p>
        </div>
      </div>
    </div>
  );
}
