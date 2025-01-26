import { GoogleGenerativeAI } from "@google/generative-ai";
import { RESUME_ANALYSIS_PROMPT } from "@/constant/promt/resumeAnalysisPrompt";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

export const analyzeResumeWithGemini = async (fileText: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const prompt = `${RESUME_ANALYSIS_PROMPT}\n\nAnalyze this resume dont change the this data or dont make up data:\n${fileText}`;
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return response;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};