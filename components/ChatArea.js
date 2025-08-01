import ChatMessage from "./ChatMessage";
import { Bot, Zap } from "lucide-react";

export default function ChatArea({ messages = [] }) {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="space-y-4 px-2 py-4">
        {messages.length === 0 ? (
          <div className="text-center mt-[30vh]">
            <Bot size={70} className="my-3 m-auto text-gray-600" />
            <p className="text-lg font-semi-bold">
              Hello! I&apos;m your AI assistant. You can chat with me using
              text, upload files for analysis, or speak to me directly. How can
              I help you today?
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <ChatMessage
              key={index}
              message={msg.text || ""}
              files={msg.files || []}
              isAI={msg.isAI}
              timestamp={msg.timestamp}
            />
          ))
        )}
      </div>
    </div>
  );
}
