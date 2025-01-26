
import OpenAI from 'openai';
import { RESUME_ANALYSIS_PROMPT } from '@/constant/promt/resumeAnalysisPrompt';

const openai = new OpenAI({
  apiKey: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
  dangerouslyAllowBrowser: true
});

export const analyzeResumeWithOpenAI = async (fileText: string): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: RESUME_ANALYSIS_PROMPT
        },
        {
          role: "user",
          content: fileText
        }
      ],
      temperature: 0.7,
      max_tokens: 5500,
    });

    console.log('API Response:', completion.choices[0].message);
    return completion.choices[0].message.content || "No analysis available";

  } catch (error) {
    console.error('OpenAI API Error:', error);
    return "Failed to analyze resume. Please try again.";
  }
};

