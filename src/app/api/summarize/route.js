import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request) {
 const { text } = await request.json();

 const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: `
Summarize the following campus notice in 50 words max.

Do NOT use Markdown.
Do NOT use **, *, or headings.
Return plain text bullet points only.

Notice:
${text}
`,
});
const summary = response.text;

return NextResponse.json({
  summary,
});
}