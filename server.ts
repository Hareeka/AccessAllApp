import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: !!apiKey,
    service: "AccessAll AI Backend",
  });
});

// 2. Vision AI Endpoint (OCR, Object Recognition, Currency Recognition, Color Identification)
app.post("/api/ai/vision", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", task = "all" } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "imageBase64 is required" });
    }

    if (ai) {
      let promptTask = "Analyze this image for an individual with a disability. ";
      if (task === "ocr") {
        promptTask += "Perform precise Optical Character Recognition (OCR). Transcribe all readable text clearly, preserving paragraphs and formatting. Provide a 1-sentence simplified summary of what the text is about.";
      } else if (task === "currency") {
        promptTask += "Identify any currency notes, bills, or coins in the image. State the currency name, denomination value, authenticity cues if visible, and announce it clearly for a visually impaired user.";
      } else if (task === "color") {
        promptTask += "Identify the dominant colors in the image, especially clothing items, objects, or surroundings. State color names, approximate contrast, and provide accessible clothing matching or environmental guidance.";
      } else if (task === "object") {
        promptTask += "Identify the key objects, people, hazards, and spatial layout in front of the camera. Describe where items are located (e.g. left, right, center, ground level) to guide a person with visual impairment safely.";
      } else {
        promptTask += "Provide: 1) Any readable text (OCR), 2) Identified objects and obstacles, 3) Any currency visible, 4) Dominant colors, and 5) A concise voice announcement suitable for a screen reader.";
      }

      // Strip prefix if included
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const imagePart = {
        inlineData: {
          mimeType: mimeType,
          data: cleanBase64,
        },
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: { parts: [imagePart, { text: promptTask }] },
        config: {
          systemInstruction: "You are the Vision AI engine for AccessAll, an assistive platform for people with visual, hearing, cognitive, and physical disabilities. Be precise, clear, concise, and prioritize user safety and practical utility.",
        },
      });

      return res.json({
        success: true,
        result: response.text,
        task: task,
      });
    }

    // Fallback if no API key is configured
    return res.json({
      success: true,
      result: `[Vision Analysis Simulation] Analyzed image for task: ${task}. Detected clear central subject, high contrast lighting, safe path ahead, and readable text label. Configure GEMINI_API_KEY in Secrets for live multimodal inference.`,
      task: task,
      isSimulated: true,
    });
  } catch (error: any) {
    console.error("Error in /api/ai/vision:", error);
    res.status(500).json({ error: error?.message || "Failed to process visual AI request" });
  }
});

// 3. AI Personal Assistant
app.post("/api/ai/assistant", async (req, res) => {
  try {
    const { prompt, history = [], disabilityType = "general", simplifiedMode = false } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "prompt is required" });
    }

    if (ai) {
      let systemInstruction = `You are AccessAll's compassionate, highly accessible AI Personal Companion.
The user's primary disability context: ${disabilityType}.
${simplifiedMode ? "IMPORTANT: The user has requested Simplified Language Mode. Use short sentences, common everyday words, clear bullet points, no confusing idioms, and warm encouragement." : "Provide structured, clear, and proactive assistance."}
Help them organize daily schedules, medicine reminders, explain complex concepts simply, provide emotional support, and suggest accessible navigation or resources. Keep responses concise and easy to read aloud via text-to-speech.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
        },
      });

      return res.json({
        success: true,
        reply: response.text,
      });
    }

    // Fallback
    const friendlyReplies = [
      `I'm right here with you! You have 2 medication reminders today and your physical therapy scheduled for next week. Would you like me to read your daily schedule aloud?`,
      `Here is a simplified tip: Take things one step at a time today. Remember to stay hydrated, and let me know if you need help finding an accessible route or practicing your speech cards!`,
    ];
    return res.json({
      success: true,
      reply: friendlyReplies[Math.floor(Math.random() * friendlyReplies.length)],
      isSimulated: true,
    });
  } catch (error: any) {
    console.error("Error in /api/ai/assistant:", error);
    res.status(500).json({ error: error?.message || "Failed to generate assistant response" });
  }
});

// 4. Document Summarization & Cognitive Simplification
app.post("/api/ai/summarize", async (req, res) => {
  try {
    const { text, targetAudience = "cognitive_accessible" } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Summarize and simplify the following document for someone who benefits from clear, easy-to-read formatting:\n\n${text}`,
        config: {
          systemInstruction: "You are an expert cognitive accessibility specialist. Transform complex medical, legal, or educational text into: 1) A 2-sentence Plain English summary, 2) Key action items as bullet points, 3) Jargon translated into simple words. Use clean spacing and avoid overwhelming paragraphs.",
        },
      });

      return res.json({
        success: true,
        summary: response.text,
      });
    }

    return res.json({
      success: true,
      summary: `**Plain Language Summary**:\nThis document explains key steps in a clear way.\n\n**Key Points**:\n• Step 1: Review your basic information.\n• Step 2: Keep a copy of your verified certificate handy.\n• Step 3: Contact support if you need assistance.\n\n*(Connect your Gemini API key in Settings to summarize any custom document in real time)*`,
      isSimulated: true,
    });
  } catch (error: any) {
    console.error("Error in /api/ai/summarize:", error);
    res.status(500).json({ error: error?.message || "Failed to summarize document" });
  }
});

// 5. AI Tutor & Interactive Quiz Generator
app.post("/api/ai/tutor", async (req, res) => {
  try {
    const { topic, mode = "explain", level = "Beginner" } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    if (ai) {
      const prompt = mode === "quiz"
        ? `Create a 3-question accessible multiple-choice quiz about "${topic}" for a ${level} learner. For each question, provide 4 options (A, B, C, D), clearly state the correct answer, and give an encouraging 1-sentence explanation.`
        : `Teach "${topic}" for a ${level} learner with accessibility accommodations in mind. Use memorable analogies, breakdown into 3 sequential steps, and add an interactive practice question.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are AccessAll's patient, accessible AI Educator. Emphasize multi-sensory learning, positive reinforcement, and step-by-step clarity.",
        },
      });

      return res.json({
        success: true,
        content: response.text,
      });
    }

    return res.json({
      success: true,
      content: `### Learning: ${topic}\n\n**Key Concept**:\nEvery complex idea is built out of simple building blocks.\n\n**Step 1**: Understand the main purpose.\n**Step 2**: Practice with one small example.\n**Step 3**: Review with speech audio.\n\n*Interactive Quiz*:\nWhat is the best way to make a website accessible?\n(A) Avoid color contrast\n(B) Provide text alternatives, keyboard navigation, and clear headings\n(C) Use very tiny fonts\n(D) Disable screen readers\n\n**Answer: (B)** - Text alternatives and keyboard navigation allow everyone to participate!`,
      isSimulated: true,
    });
  } catch (error: any) {
    console.error("Error in /api/ai/tutor:", error);
    res.status(500).json({ error: error?.message || "Failed to run tutor" });
  }
});

// 6. AI Resume & Interview Assistant
app.post("/api/ai/career", async (req, res) => {
  try {
    const { type = "resume", userBackground, jobTitle, accommodations = [] } = req.body;

    if (ai) {
      const prompt = type === "interview"
        ? `Conduct a practice mock interview for a job candidate applying for "${jobTitle || "Accessibility Specialist"}". Accommodations needed: ${accommodations.join(", ") || "General accessibility"}. Provide 3 supportive interview questions, tips on how to confidently highlight their unique problem-solving strengths, and how to request reasonable accommodations professionally.`
        : `Help draft an inclusive, strengths-focused resume summary and skill highlight for: "${userBackground || "Experienced professional with adaptability and tech skills"}". Highlight attention to detail, resilience, and specific assistive tool proficiencies.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an inclusive career mentor specializing in employment for individuals with disabilities. Be empowering, practical, and articulate.",
        },
      });

      return res.json({
        success: true,
        result: response.text,
      });
    }

    return res.json({
      success: true,
      result: `**Inclusive Career Coaching**\n\n**Recommended Strengths to Highlight**:\n• Proven adaptability, resilience, and creative problem solving.\n• High proficiency in accessible digital tools and communication platforms.\n• Diligent attention to precision and team collaboration.\n\n**Mock Interview Practice Question**:\n*"Can you describe how you organize your daily workflow and assistive setup to achieve consistent results?"*\n\n**Suggested Strategy**: Share your daily routine, how technology empowers your independence, and emphasize your proactive communication!`,
      isSimulated: true,
    });
  } catch (error: any) {
    console.error("Error in /api/ai/career:", error);
    res.status(500).json({ error: error?.message || "Failed to process career assistance" });
  }
});

// Vite middleware setup
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AccessAll Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
