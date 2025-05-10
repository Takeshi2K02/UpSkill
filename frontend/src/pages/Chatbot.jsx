import React, { useState, useRef, useEffect } from "react";
import useAI from "../ai/useAI";
import { getChatHistory, saveMessage } from "../services/chatService";
import { Send, Loader2 } from "lucide-react";
import CommonLayout from "../layouts/CommonLayout";

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
    const aiText = await askGemini(input);
    const aiMessage = { userId, sender: "ai", text: aiText };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInput("");

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
                {msg.text}
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