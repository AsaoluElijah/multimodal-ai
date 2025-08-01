export default function ChatMessage({
  message,
  files = [],
  isAI = false,
  timestamp,
}) {
  const hasText = typeof message === "string" && message.trim() !== "";
  const hasFiles = Array.isArray(files) && files.length > 0;

  return (
    <div className={`flex items-start gap-3 ${!isAI && "justify-end"}`}>
      <div
        className={`rounded-lg py-4 max-w-[80%] ${
          !isAI ? "px-4 bg-white border border-slate-200" : ""
        }`}
      >
        {/* Text message */}
        {hasText && (
          <p className="text-slate-700 whitespace-pre-line">{message}</p>
        )}

        {/* File list */}
        {hasFiles && (
          <ul className="mt-2 space-y-1 text-sm text-slate-700 list-disc list-inside">
            {files.map((fileName, idx) => (
              <li key={idx}>{fileName}</li>
            ))}
          </ul>
        )}

        {/* Timestamp */}
        {timestamp && (
          <p className="text-xs text-slate-500 mt-2">{timestamp}</p>
        )}
      </div>
    </div>
  );
}
