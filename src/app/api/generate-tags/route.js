import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request) {
  const { title, description } = await request.json();

  const prompt = `
Generate only 3-5 short comma separated tags.

Title:
${title}

Description:
${description}

Example:
wallet,black,library

Return ONLY the tags.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const tags = response.text.trim();

  return Response.json({
    tags,
  });
}