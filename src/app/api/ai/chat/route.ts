import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { groq, GROQ_MODEL } from "@/lib/groq";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages, courseTitle, moduleTitle } = await req.json();

  const systemPrompt = `You are EduFlow AI, an intelligent study assistant helping students learn effectively.
${courseTitle ? `The student is studying: "${courseTitle}".` : ""}
${moduleTitle ? `Currently on module: "${moduleTitle}".` : ""}

Your role:
- Answer questions clearly and pedagogically
- Break down complex concepts into digestible parts
- Provide examples and analogies when helpful
- Encourage the student and keep them motivated
- If asked about unrelated topics, gently redirect to the course material
- Keep responses concise but complete (aim for 150-300 words per response)`;

  try {
    const stream = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 1024,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content || "";
          if (delta) {
            controller.enqueue(encoder.encode(delta));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response("Failed to generate response", { status: 500 });
  }
}
