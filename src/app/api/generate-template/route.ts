import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_API_KEY
    ? "https://openrouter.ai/api/v1"
    : undefined,
});

function generateImageUrl(prompt: string, size: string = "medium"): string {
  const sizes = {
    small: { width: 512, height: 512 },
    medium: { width: 768, height: 768 },
    large: { width: 1024, height: 1024 },
  };

  const sizeConfig = sizes[size as keyof typeof sizes] || sizes.medium;
  const cleanPrompt = prompt.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
  const seed = Math.floor(Math.random() * 1000000);

  return `https://image.pollinations.ai/prompt/${encodeURIComponent(
    cleanPrompt
  )}?width=${sizeConfig.width}&height=${
    sizeConfig.height
  }&seed=${seed}&nologo=true`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing required field: prompt" },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: process.env.OPENROUTER_API_KEY
        ? "mistralai/mistral-7b-instruct"
        : "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Create a professional template with clear structure and placeholders. Use [BRACKET] format for placeholders, include proper formatting, and provide helpful instructions.",
        },
        {
          role: "user",
          content: `Create a professional template for: ${prompt}. Include clear structure, placeholders in [BRACKET] format, proper formatting, and helpful instructions. If colors or styling were mentioned, include those specifications.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    const content = response.choices[0]?.message?.content?.trim() || "";

    let imageUrl: string | undefined;
    try {
      const imagePrompt = `Professional template design, ${prompt}, clean modern layout, business design, minimalist, professional appearance`;
      imageUrl = generateImageUrl(imagePrompt, "medium");
    } catch (error) {
      console.warn("Template image generation failed");
    }

    return NextResponse.json({
      content,
      imageUrl,
    });
  } catch (error) {
    console.error("Template generation error:", error);
    return NextResponse.json(
      {
        error: `Failed to generate template: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
