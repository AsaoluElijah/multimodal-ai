export default function FileUpload({
  uploadedFiles,
  onFileUpload,
  onRemoveFile,
}) {
  if (uploadedFiles.length === 0) return null;

  return (
    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <h4 className="text-sm font-semibold text-blue-800 mb-2">
        Uploaded Files ({uploadedFiles.length})
      </h4>
      <div className="space-y-2">
        {uploadedFiles.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white rounded px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-slate-700">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <button
              onClick={() => onRemoveFile(index)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
