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
    // Temporarily add user message to state for immediate UI feedback
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Fetch the last 5 messages as context
    const recentMessages = await getRecentMessages(userId, 5);
    // Format context as a conversation history
    const context = recentMessages
      .map(msg => `${msg.sender === "user" ? "User" : "AI"}: ${msg.text}`)
      .join("\n");
    const fullPrompt = context ? `${context}\nUser: ${input}` : `User: ${input}`;

    // Generate AI response with the full prompt
    const aiText = await askGemini(fullPrompt);
    const aiMessage = { userId, sender: "ai", text: aiText };

    // Update state with both messages
    setMessages((prev) => [...prev.filter(m => m !== userMessage), userMessage, aiMessage]);

    await saveMessage(userMessage);
    await saveMessage(aiMessage);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <CommonLayout>
      <div className="flex flex-col h-full">
        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-gray-500 py-10">
              <p className="text-lg">Hello there! How can I help you today?</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[70%] p-3 rounded-lg shadow ${
                  msg.sender === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : "mr-auto bg-gray-100 text-gray-900"
                }`}
              >
                {msg.sender === "ai" ? (
                  <div className="prose prose-blue max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:mb-3 [&_p]:mb-4 pb-2">
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
                  msg.text
                )}
              </div>
            ))
          )}
          {loading && (
            <div className="text-sm text-gray-500">Spark is thinking...</div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSubmit} className="p-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ask me anything about learning, AI, data science..."
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      </div>
    </CommonLayout>
  );
}