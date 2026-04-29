import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { groq, GROQ_MODEL } from "@/lib/groq";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { moduleId } = await req.json();
    if (!moduleId) {
      return NextResponse.json({ error: "moduleId is required" }, { status: 400 });
    }

    const mod = await prisma.module.findUnique({ where: { id: moduleId } });
    if (!mod) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    const prompt = `You are an educational quiz generator. Based on the following course module content, generate exactly 5 multiple-choice questions.

Module Title: ${mod.title}
Content: ${mod.content.slice(0, 3000)}

Return ONLY a valid JSON array with this exact structure (no markdown, no explanation):
[
  {
    "id": "q1",
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Brief explanation of the correct answer"
  }
]

Rules:
- Generate exactly 5 questions
- Each question must have exactly 4 options
- correctIndex must be 0-3 (index of the correct option)
- Questions should test genuine understanding, not just memorization
- Make distractors plausible but clearly wrong`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const raw = completion.choices[0]?.message?.content || "[]";

    // Parse the JSON response
    let questions;
    try {
      // Strip markdown code fences if present
      const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      questions = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Failed to parse quiz questions" }, { status: 500 });
    }

    return NextResponse.json({ questions, moduleTitle: mod.title });
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
  }
}
