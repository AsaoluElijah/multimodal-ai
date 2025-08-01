import { useState } from "react";
import { Geist } from "next/font/google";

import axios from "axios";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasText = inputText.trim();
    const hasFiles = uploadedFiles.length > 0;

    if (!hasText && !hasFiles) return;

    setIsLoading(true);

    const timestamp = new Date().toLocaleTimeString();

    const userMessage = {
      text: hasText ? inputText : null,
      files: hasFiles ? uploadedFiles.map((file) => file.name) : [],
      isAI: false,
      timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Prepare form data
    const formData = new FormData();
    formData.append("text", inputText);

    uploadedFiles.forEach((file, index) => {
      formData.append("files", file); // If your API accepts multiple files with same field name
    });

    try {
      const res = await axios.post("/api/message", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const aiMessage = {
        text: res.data?.response || "AI responded, but no text was returned.",
        isAI: true,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errMessage = {
        text: "Something went wrong while sending your message.",
        isAI: true,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errMessage]);
    } finally {
      setIsLoading(false);
      setInputText("");
      setUploadedFiles([]);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleRecording = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    if (!isRecording) {
      recognition.start();
      console.log("Recording started...");

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prevText) => `${prevText} ${transcript}`.trim());
      };

      recognition.onerror = (event) => {
        console.log(`Speech recognition error detected: ${event.error}`);
        console.log(`Additional information: ${event.message}`);
      };

      recognition.onend = () => {
        console.log("Recording ended.");
        setIsRecording(false);
      };

      // Store the instance globally to be able to stop it later
      window._recognition = recognition;
      setIsRecording(true);
    } else {
      console.log("Stopping recording...");
      window._recognition?.stop();
      setIsRecording(false);
    }
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
