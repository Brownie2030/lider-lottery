import { GoogleGenAI, Type } from "@google/genai";
import { LOTTERY_CONFIG } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAILuckyNumbers = async (context: string): Promise<number[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate ${LOTTERY_CONFIG.selectionCount} unique lucky lottery numbers between ${LOTTERY_CONFIG.minNumber} and ${LOTTERY_CONFIG.maxNumber} based on the following user context or dream description: "${context}". Return ONLY a JSON array of integers.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.INTEGER },
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    
    const numbers = JSON.parse(text);
    
    // Validate numbers just in case
    if (Array.isArray(numbers) && numbers.length === LOTTERY_CONFIG.selectionCount) {
        return numbers.filter(n => typeof n === 'number' && n >= LOTTERY_CONFIG.minNumber && n <= LOTTERY_CONFIG.maxNumber);
    }
    return [];

  } catch (error) {
    console.error("Gemini Lucky Number Error:", error);
    // Fallback to random if AI fails
    const fallback: number[] = [];
    while(fallback.length < LOTTERY_CONFIG.selectionCount) {
        const n = Math.floor(Math.random() * LOTTERY_CONFIG.maxNumber) + 1;
        if(!fallback.includes(n)) fallback.push(n);
    }
    return fallback;
  }
};

export const getLotteryPrediction = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Write a short, mystical, and exciting 2-sentence fortune cookie style prediction about luck and wealth for a lottery player.",
        });
        return response.text || "The stars align for those who dare to dream.";
    } catch (e) {
        return "Luck favors the bold.";
    }
}