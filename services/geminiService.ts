import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PlannerResult, Category } from "../types";

// Helper to get enum values for schema
const categoryValues = Object.values(Category);

export const generatePlanFromIntent = async (userPrompt: string): Promise<PlannerResult[]> => {
  if (!process.env.API_KEY) {
    console.error("API Key not found");
    throw new Error("API Key is missing. Please set it in your environment.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        stepName: { type: Type.STRING, description: "Title of the planning step (e.g., 'Mekan Seçimi')" },
        description: { type: Type.STRING, description: "Why this step is important for the user's goal." },
        recommendedCategories: {
          type: Type.ARRAY,
          items: { type: Type.STRING, enum: categoryValues },
          description: "List of business categories relevant to this step."
        },
        searchKeywords: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Keywords to filter businesses (e.g., 'düğün', 'gelinlik', 'fotoğraf')."
        }
      },
      required: ["stepName", "description", "recommendedCategories", "searchKeywords"],
      propertyOrdering: ["stepName", "description", "recommendedCategories", "searchKeywords"]
    }
  };

  const prompt = `
    Sen yararlı bir yerel rehber asistanısın. Kullanıcının bir hedefini gerçekleştirmesi için adım adım bir plan oluştur.
    Kullanıcı: "${userPrompt}"
    
    Kullanıcının bu isteğini gerçekleştirmesi için yerel işletmelerden hizmet alması gereken adımları belirle.
    Örneğin "Düğün yapacağım" derse, "Mekan", "Organizasyon", "Güzellik", "Fotoğraf" gibi adımlar oluştur.
    "Yemek yiyeceğim" derse, sadece yemek seçenekleri sun.
    
    Mevcut Kategorilerimiz: ${categoryValues.join(", ")}.
    Yalnızca bu kategorileri kullan.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as PlannerResult[];
    }
    return [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
