import { useRef } from "react";
import { Paperclip, Mic, CircleStop, Send, Loader } from "lucide-react";

import FileUpload from "./FileUpload";

export default function InputArea({
  inputText,
  setInputText,
  uploadedFiles,
  onFileUpload,
  onRemoveFile,
  isRecording,
  onToggleRecording,
  onSubmit,
  isLoading,
}) {
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <div className="w-full">
      {/* File Upload Section */}
      <FileUpload
        uploadedFiles={uploadedFiles}
        onFileUpload={onFileUpload}
        onRemoveFile={onRemoveFile}
      />

      {/* Input Form */}
      <form onSubmit={onSubmit} className="space-y-2">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here... (Shift + Enter for new line)"
            className="w-full p-4 pr-24 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            disabled={isLoading}
          />

          {/* Action Buttons */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            {/* File Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Upload files"
              disabled={isLoading}
            >
              <Paperclip size={20} />
            </button>

            {/* Voice Recording Button */}
            <button
              type="button"
              onClick={onToggleRecording}
              className={`p-2 rounded-lg transition-colors ${
                isRecording
                  ? "text-red-500 bg-red-100"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              }`}
              title={isRecording ? "Stop recording" : "Start voice recording"}
              disabled={isLoading}
            >
              {isRecording ? <CircleStop size={20} /> : <Mic size={20} />}
            </button>
            {/* Send Button */}
            <button
              type="submit"
              disabled={
                !(inputText.trim() || uploadedFiles.length > 0) || isLoading
              }
              className={`p-2 rounded-lg transition-colors ${
                (inputText.trim() && !isLoading) || uploadedFiles.length > 0
                  ? "text-white bg-blue-500 hover:bg-blue-600"
                  : "text-slate-400 bg-slate-200 cursor-not-allowed"
              }`}
              title="Send message"
            >
              {isLoading ? <Loader size={20} /> : <Send size={20} />}
            </button>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={onFileUpload}
          className="hidden"
          accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp3,.mp4,.wav"
        />
      </form>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="mt-2 flex items-center gap-2 text-red-500">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">
            Recording... Click to stop
          </span>
        </div>
      )}
    </div>
  );
}
