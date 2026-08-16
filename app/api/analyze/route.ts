import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type, Schema } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { title, description, tenderValue } = await req.json();

    const prompt = `Analyze the following tender/RFP metadata and extract key insights. Write the analysis in extremely simple, clear, and easy-to-understand language. Avoid complex legal jargon or overly technical terms so that anyone can quickly grasp the requirements and risks.

Title: ${title}
Value: ${tenderValue || 'Not specified'}
Description/Details: ${description || 'Not provided'}

Identify in simple language:
1. Scope of Work (a brief, plain-English summary of what needs to be done)
2. Potential Hidden Risks (e.g., aggressive timeline, penalties - explain why it's a risk simply)
3. Compliance Requirements (e.g., specific certifications needed)
4. Payment Terms (if mentioned or typical for this type of contract)
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scope: { type: Type.STRING },
            risks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            compliance: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            paymentTerms: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["scope", "risks", "compliance", "paymentTerms"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error analyzing tender:', error);
    
    // Check for 503 or 429 quota/overloaded errors
    const errorMsg = error.message || '';
    if (errorMsg.includes('503') || errorMsg.includes('429') || errorMsg.includes('UNAVAILABLE') || errorMsg.includes('quota')) {
      return NextResponse.json({
        scope: "The AI service is currently busy or overloaded. Please review the tender description manually.",
        risks: [{ title: "AI Unavailable", description: "Could not perform risk analysis at this moment due to high demand. Please try again later." }],
        compliance: ["Could not extract compliance requirements. Please read the document."],
        paymentTerms: ["Could not extract payment terms. Please read the document."]
      });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
