import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MODEL_NAME, SYSTEM_INSTRUCTION } from "../constants";
import { AnalysisResult } from "../types";

// Initialize Gemini Client with Environment Variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeContent = async (
  text: string,
  imageBase64?: string
): Promise<AnalysisResult> => {
  try {
    const parts: any[] = [];

    if (imageBase64) {
      const cleanBase64 = imageBase64.split(',')[1];
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: cleanBase64,
        },
      });
    }

    if (text) {
      parts.push({ text: text });
    }

    if (parts.length === 0) {
      throw new Error("বিশ্লেষণ করার জন্য কোনো তথ্য বা ছবি দেওয়া হয়নি।");
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: parts,
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        // Google Search is enabled for grounding
        // Note: responseSchema/MimeType must NOT be used when tools are active
        tools: [{ googleSearch: {} }],
      },
    });

    // Manual JSON Parsing with robust cleanup
    let analysisData;
    try {
        let textResponse = response.text;
        if (!textResponse) throw new Error("Empty response from AI");

        // 1. Remove markdown code blocks if present
        textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '');

        // 2. Extract the first valid JSON object using regex
        // This looks for the first '{' and the last '}' and takes everything in between
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
            textResponse = jsonMatch[0];
        } else {
            // If no brackets found, it's a pure text failure
            throw new Error("Invalid JSON structure");
        }

        analysisData = JSON.parse(textResponse);
    } catch (e) {
        console.error("JSON Parse Error", e);
        console.log("Raw Response:", response.text);
        throw new Error("AI এর উত্তর সঠিকভাবে পড়া যাচ্ছে না (JSON Error)। দয়া করে আবার চেষ্টা করুন।");
    }
    
    // Extract grounding URLs from metadata
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const urls: string[] = [];
    
    groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
            urls.push(chunk.web.uri);
        }
    });

    return {
      verdict: analysisData.verdict || "UNSURE",
      title: analysisData.title || "বিশ্লেষণ সম্পন্ন",
      reason: analysisData.reason || "বিস্তারিত তথ্য পাওয়া যায়নি।",
      confidenceScore: analysisData.confidenceScore || 0,
      groundingUrls: Array.from(new Set(urls)),
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const errorMessage = error.message || error.toString();
    
    if (errorMessage.includes("404") || errorMessage.includes("not found")) {
        throw new Error("মডেল সার্ভিসে সমস্যা হচ্ছে (Model not found)। কিছুক্ষণ পর চেষ্টা করুন।");
    } else if (errorMessage.includes("API key")) {
        throw new Error("API Key সঠিক নয়।");
    } else {
        throw new Error(`সমস্যা হয়েছে: ${errorMessage}`);
    }
  }
};