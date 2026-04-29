import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { groq, GROQ_FAST_MODEL } from "@/lib/groq";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, tags, category } = await req.json();

  const prompt = `Generate a professional course description and suggested module outline for an online course.

Course Title: ${title}
Category: ${category}
Tags: ${tags?.join(", ") || "N/A"}

Return ONLY valid JSON (no markdown) with this exact structure:
{
  "description": "A compelling 2-3 paragraph course description that explains what students will learn, who it's for, and the value they'll get",
  "modules": [
    { "title": "Module 1: Introduction", "description": "Brief description" },
    { "title": "Module 2: Core Concepts", "description": "Brief description" }
  ]
}

Generate 5-7 modules. Make the description engaging and specific to the topic.`;

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_FAST_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 1500,
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(cleaned);

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI generate error:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}
