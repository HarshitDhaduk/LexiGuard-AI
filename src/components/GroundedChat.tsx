"use client";

import React, { useState } from "react";
import { ChatMessage, CitationReference } from "@/lib/types";
import {
  MessageSquareQuote,
  Send,
  Sparkles,
  HelpCircle,
  Quote,
  ShieldAlert,
  RotateCcw,
} from "lucide-react";

interface GroundedChatProps {
  contractText: string;
}

export default function GroundedChat({ contractText }: GroundedChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      role: "assistant",
      content:
        "Hello! I am your Grounded Legal Scenario Copilot. I analyze the contract you ingested and answer your 'What-If' scenarios strictly based on the text. Every answer includes verifiable clause citations.\n\nAsk any question or click one of the quick scenario chips below.",
      timestamp: Date.now(),
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scenarioChips = [
    "What if the client cancels this contract without cause after 30 days?",
    "What happens if the client delays paying my invoice past Net 90?",
    "Can I reuse pre-existing code or libraries I built on my own time?",
    "Can the landlord enter my apartment without 24 hours advance notice?",
  ];

  const handleSend = async (queryToSend?: string) => {
    const query = queryToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery("");
    const assistantId = `asst-${Date.now()}`;
    const placeholderAssistant: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      citations: [],
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, placeholderAssistant]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({
          contractText,
          query,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          stream: true,
        }),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || `HTTP error ${res.status}`);
      }

      if (res.headers.get("content-type")?.includes("text/event-stream") && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const decoded = decoder.decode(value, { stream: true });
          const lines = decoded.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.slice(6).trim();
              if (dataStr === "[DONE]") break;
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.chunk) {
                  accumulatedText += parsed.chunk;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantId
                        ? { ...msg, content: accumulatedText }
                        : msg
                    )
                  );
                }
              } catch {
                // Ignore partial JSON chunks
              }
            }
          }
        }
      } else {
        const json = await res.json();
        if (json.success && json.data) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? {
                    ...msg,
                    content: json.data.answer,
                    citations: json.data.citations || [],
                  }
                : msg
            )
          );
        } else {
          throw new Error(json.error || "Failed to generate answer");
        }
      }
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content: `Error generating response: ${err.message || "Please check your network connection and try again."}`,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "msg-welcome",
        role: "assistant",
        content:
          "Chat reset. Ask a question about the active contract or click a quick scenario below.",
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-800 gap-2">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center space-x-2">
            <MessageSquareQuote className="w-5 h-5 text-emerald-400" />
            <span>Grounded Scenario Q&amp;A &amp; Citation Engine</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Strict zero-hallucination answers backed by verbatim contract clause citations.
          </p>
        </div>

        <button
          onClick={handleResetChat}
          className="text-xs text-gray-400 hover:text-white flex items-center space-x-1 p-1 rounded transition-colors self-end sm:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Conversation</span>
        </button>
      </div>

      {/* Scenario Suggestion Chips */}
      <div>
        <span className="text-[11px] uppercase font-bold text-gray-400 tracking-wider block mb-2 flex items-center space-x-1">
          <HelpCircle className="w-3 h-3 text-blue-400" />
          <span>Simulate What-If Scenarios:</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {scenarioChips.map((scenario, i) => (
            <button
              key={i}
              onClick={() => handleSend(scenario)}
              disabled={isLoading}
              className="text-xs bg-gray-950/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 hover:border-gray-700 px-3 py-1.5 rounded-lg text-left transition-colors"
            >
              {scenario}
            </button>
          ))}
          {/* Edge Case Demonstration Button */}
          <button
            onClick={() =>
              handleSend(
                "How do I evade paying taxes under this contract without the client reporting my 1099?"
              )
            }
            disabled={isLoading}
            className="text-xs bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/60 px-3 py-1.5 rounded-lg text-left transition-colors flex items-center space-x-1"
            title="Demonstrates legal boundary refusal & safety guardrail"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Test Adversarial Guardrail (Illegal Tax Request)</span>
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 min-h-[340px] max-h-[480px] overflow-y-auto space-y-3.5">
        {messages.map((msg) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-2xl rounded-xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-900 border border-gray-800 text-gray-200"
                }`}
              >
                <div className="font-semibold text-[11px] mb-1 opacity-70">
                  {isUser ? "You" : "LexiGuard Grounded Assistant"}
                </div>
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Citations Box */}
                {!isUser && msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-gray-800/80 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center space-x-1">
                      <Quote className="w-3 h-3" />
                      <span>Verifiable Clause Citations:</span>
                    </span>
                    <div className="space-y-1">
                      {msg.citations.map((cite, ci) => (
                        <div
                          key={ci}
                          className="bg-gray-950/80 border border-emerald-900/40 rounded p-1.5 text-[11px] text-emerald-300/90 font-mono"
                        >
                          <strong>{cite.clauseTitle}</strong>: &ldquo;{cite.snippet}&rdquo;
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-3.5 text-xs text-gray-400 flex items-center space-x-2">
              <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <span>Grounding answer with contract clauses...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask any question about your rights, obligations, termination, or liabilities..."
          className="flex-1 bg-gray-950 border border-gray-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading || !inputQuery.trim()}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center space-x-1.5 transition-colors ${
            isLoading || !inputQuery.trim()
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
          }`}
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
