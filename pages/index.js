import { useState } from "react";
import { Geist } from "next/font/google";

import ChatArea from "@/components/ChatArea";
import InputArea from "@/components/InputArea";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const hasText = inputText.trim();
    const hasFiles = uploadedFiles.length > 0;

    if (!hasText && !hasFiles) return;

    setIsLoading(true);

    const timestamp = new Date().toLocaleTimeString();

    // User message (text and/or files)
    const userMessage = {
      text: hasText ? inputText : null,
      files: hasFiles ? uploadedFiles.map((file) => file.name) : [],
      isAI: false,
      timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        text: "This is a simulated AI response based on your message and uploaded files.",
        isAI: true,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
      setInputText("");
      setUploadedFiles([]);
    }, 2000);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording functionality
    console.log("Voice recording:", !isRecording);
  };

  return (
    <div className={`${geistSans.className} min-h-screen h-screen bg-slate-50`}>
      <div className="flex flex-col h-full w-full max-w-3xl mx-auto px-2 py-4">
        <div className="flex-1 flex flex-col justify-end">
          <div className="flex flex-col h-full max-h-[90vh] w-full">
            <div className="flex-1 min-h-0">
              <ChatArea messages={messages} />
            </div>
            <div className="shrink-0">
              <InputArea
                inputText={inputText}
                setInputText={setInputText}
                uploadedFiles={uploadedFiles}
                onFileUpload={handleFileUpload}
                onRemoveFile={removeFile}
                isRecording={isRecording}
                onToggleRecording={toggleRecording}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
