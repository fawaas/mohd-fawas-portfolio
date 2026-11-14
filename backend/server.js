const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.json({
    message: "ASK FAWAS AI SERVER IS ONLINE 🚀",
    status: "success",
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required.",
      });
    }

    const chatHistory = history.slice(-10).map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [{ text: item.content }],
    }));
    console.log("ASK FAWAS RECEIVED:", message);
    console.time("AI RESPONSE TIME");
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: [...chatHistory, { role: "user", parts: [{ text: message }] }],
      config: {
        thinkingConfig: {
          thinkingLevel: "minimal",
        },
        systemInstruction: `
You are Ask Fawas, the personal AI assistant.
You are friendly, helpful, and concise.
You know Fawas is a developer and creator who built Skillora and Calcora.
Never invent personal details. If you don't know something, say so.
        `,
      },
    });

    console.timeEnd("AI RESPONSE TIME");

    res.json({
      reply: response.text,
    });
  } catch (error) {
    console.error("Gemini AI error:", error);
    console.timeEnd("AI RESPONSE TIME")

    

    res.status(500).json({
      error: "AI could not respond. Please try again.",
    });
  }
});

const PORT = 5001;

const server = app.listen(PORT, () => {
  console.log(`ASK FAWAS AI running at http://localhost:${PORT}`);
});

server.on("error", (err) => {
  console.error("SERVER ERROR:", err);
});
