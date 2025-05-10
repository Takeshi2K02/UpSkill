import React, { useState, useRef, useEffect } from "react";
import useAI from "../ai/useAI";
import { getChatHistory, saveMessage, getRecentMessages } from "../services/chatService";
import { Send, Loader2 } from "lucide-react";
import CommonLayout from "../layouts/CommonLayout";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

export default function Chatbot() {
  const { loading, askGemini } = useAI();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);
  const userId = sessionStorage.getItem("facebookId");

  useEffect(() => {
    async function fetchHistory() {
      if (userId) {
        const history = await getChatHistory(userId);
        setMessages(history);
      }
    }
    fetchHistory();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !userId) return;

    const userMessage = { userId, sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const recentMessages = await getRecentMessages(userId, 5);
    const context = recentMessages
      .map(msg => `${msg.sender === "user" ? "User" : "AI"}: ${msg.text}`)
      .join("\n");
    const fullPrompt = context ? `${context}\nUser: ${input}` : `User: ${input}`;

    const aiText = await askGemini(fullPrompt);
    const aiMessage = { userId, sender: "ai", text: aiText };

    setMessages((prev) => [...prev.filter(m => m !== userMessage), userMessage, aiMessage]);

    await saveMessage(userMessage);
    await saveMessage(aiMessage);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <CommonLayout>
      <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-gray-500 py-10 text-center">
              <p className="text-lg font-medium">Hello there! How can I help you today?</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                } animate-slide-up`}
              >
                <div
                  className={`inline-block max-w-[70%] p-4 rounded-lg shadow-md transition-all duration-200 ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-900 border border-gray-200"
                  }`}
                >
                  {msg.sender === "ai" ? (
                    <div className="prose prose-blue max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:mb-3 [&_p]:mb-4">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          li: ({ children }) => <li className="mb-2">{children}</li>,
                          p: ({ children }) => <p className="mb-4">{children}</p>,
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <span className="break-words">{msg.text}</span>
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-500 animate-pulse">
              <Loader2 size={18} className="animate-spin" />
              Spark is thinking...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSubmit} className="p-4 flex gap-3 items-center bg-white border-t border-gray-200">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-5 py-3 bg-gray-50 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder-gray-400 text-sm hover:shadow-md"
            placeholder="Ask me anything about learning, AI, data science..."
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} className="transform rotate-45" />
            )}
          </button>
        </form>
      </div>
    </CommonLayout>
  );
}