import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client with the API key from environment variables.
// This allows the client to be reused across function invocations for better performance.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// The main serverless function handler
export default async (req: Request) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // Allow requests from any origin
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers,
    });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert wildlife biologist and game ranch management consultant based in Southern Africa. Your advice should be clear, concise, and actionable for game ranchers in this region. Reference common Southern African species (like Kudu, Impala, Blue Wildebeest), local challenges (like specific parasites, drought cycles, bush encroachment), and regional best practices. Your tone should be professional, helpful, and supportive.",
      }
    });

    const text = response.text;

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error("Error in Gemini function:", error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers,
    });
  }
};
