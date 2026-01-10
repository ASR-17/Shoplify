import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;

// ✅ Safe initialization
try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
} catch (err) {
  console.warn("Gemini AI disabled:", err.message);
}

/**
 * Optional AI insights for dashboard
 * NEVER blocks graph rendering
 */
export const generateDashboardInsights = async (summaryData) => {
  if (!genAI) return null;
  if (!Array.isArray(summaryData) || summaryData.length === 0) return null;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
You are a financial analytics assistant.

Rules:
- Do NOT invent numbers
- Do NOT change values
- ONLY analyze trends

Return short, clear insights in plain text.

Data:
${JSON.stringify(summaryData, null, 2)}
`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.warn("Gemini failed, continuing without AI:", error.message);
    return null; // 🔥 critical fallback
  }
};
