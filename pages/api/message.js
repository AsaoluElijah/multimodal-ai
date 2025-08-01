import { IncomingForm } from "formidable";

import {
  GoogleGenAI,
  createPartFromUri,
  createUserContent,
} from "@google/genai";
import mime from "mime-types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const form = new IncomingForm({
    multiples: true,
    uploadDir: "/tmp",
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "Failed to parse form data" });
    }

    const userText = fields.text?.toString().trim() || "";
    const uploadedFiles = Array.isArray(files.files)
      ? files.files
      : files.files
      ? [files.files]
      : [];

    const contentParts = [];

    // 1. Attach file(s) if any
    for (const file of uploadedFiles) {
      const filePath = file.filepath || file.path;
      const mimeType = mime.lookup(filePath) || "application/octet-stream";

      try {
        let uploaded = await ai.files.upload({
          file: filePath,
          config: { mimeType },
        });

        // If the file is a video, poll until it's ACTIVE
        if (mimeType.startsWith("video/")) {
          while (!uploaded.state || uploaded.state.toString() !== "ACTIVE") {
            console.log(
              `Waiting for video to process (state: ${uploaded.state})...`
            );
            await new Promise((r) => setTimeout(r, 5000));
            uploaded = await ai.files.get({ name: uploaded.name });
          }
        }

        contentParts.push(createPartFromUri(uploaded.uri, mimeType));
        contentParts.push("\n\n");
      } catch (uploadErr) {
        console.error("File upload to Gemini failed:", uploadErr);
        return res
          .status(500)
          .json({ error: "Failed to upload file to Gemini." });
      }
    }

    // 2. Append user prompt
    if (userText) contentParts.push(userText);

    // 3. Send to Gemini
    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: createUserContent(contentParts),
      });

      res.status(200).json({ response: result.text });
    } catch (geminiErr) {
      console.error("Gemini API error:", geminiErr);
      res.status(500).json({ error: "Failed to get response from Gemini." });
    }
  });
}
