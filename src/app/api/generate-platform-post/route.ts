import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_API_KEY
    ? "https://openrouter.ai/api/v1"
    : undefined,
});

const hasEmojis = (text: string): boolean => {
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  return emojiRegex.test(text);
};

function generateImageUrl(prompt: string, size: string): string {
  const sizes = {
    small: { width: 512, height: 512 },
    medium: { width: 768, height: 768 },
    large: { width: 1024, height: 1024 },
    wide: { width: 1024, height: 576 },
    tall: { width: 576, height: 1024 },
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
    const { prompt, platform, includeImage = true } = body;

    if (!prompt || !platform) {
      return NextResponse.json(
        { error: "Missing required fields: prompt and platform" },
        { status: 400 }
      );
    }

    const platformConfigs = {
      twitter: {
        characterLimit: 280,
        systemPrompt:
          "Create a Twitter/X post. Keep it under 280 characters, punchy, and engaging.",
        recommendedHashtags: 2,
        bestImageSize: "wide",
        notes: [
          "Keep it concise",
          "Use trending hashtags",
          "Engage with questions",
        ],
      },
      instagram: {
        characterLimit: 2200,
        systemPrompt:
          "Create an Instagram post. Focus on visual storytelling and use relevant hashtags.",
        recommendedHashtags: 10,
        bestImageSize: "medium",
        notes: [
          "Visual-first platform",
          "Use many relevant hashtags",
          "Tell a story",
        ],
      },
      linkedin: {
        characterLimit: 3000,
        systemPrompt:
          "Create a LinkedIn post. Be professional, insightful, and business-focused.",
        recommendedHashtags: 5,
        bestImageSize: "wide",
        notes: ["Professional tone", "Share insights", "Network-friendly"],
      },
      facebook: {
        characterLimit: 63206,
        systemPrompt:
          "Create a Facebook post. Be engaging, community-focused, and encourage interaction.",
        recommendedHashtags: 3,
        bestImageSize: "wide",
        notes: [
          "Community-focused",
          "Encourage engagement",
          "Share personal stories",
        ],
      },
      tiktok: {
        characterLimit: 4000,
        systemPrompt:
          "Create a TikTok caption. Be trendy, fun, and appeal to a younger audience.",
        recommendedHashtags: 5,
        bestImageSize: "tall",
        notes: [
          "Trend-focused",
          "Use popular hashtags",
          "Appeal to younger audience",
        ],
      },
      youtube: {
        characterLimit: 5000,
        systemPrompt:
          "Create a YouTube description. Be detailed, SEO-friendly, and include a call-to-action.",
        recommendedHashtags: 5,
        bestImageSize: "wide",
        notes: ["Detailed descriptions", "SEO-friendly", "Call-to-action"],
      },
    };

    const config = platformConfigs[platform as keyof typeof platformConfigs];
    if (!config) {
      return NextResponse.json(
        { error: "Unsupported platform" },
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
          content: config.systemPrompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    let content = response.choices[0]?.message?.content?.trim() || "";

    // Truncate if exceeds platform limits
    if (content.length > config.characterLimit) {
      content = content.substring(0, config.characterLimit - 3) + "...";
    }

    let imageUrl: string | undefined;
    if (includeImage) {
      try {
        imageUrl = generateImageUrl(
          `${platform} post about ${prompt}`,
          config.bestImageSize
        );
      } catch (error) {
        console.warn("Platform post image generation failed");
      }
    }

    // Calculate metadata
    const wordCount = content
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const hashtags = content.match(/#\w+/g) || [];

    return NextResponse.json({
      content,
      imageUrl,
      platformGuidelines: {
        characterLimit: config.characterLimit,
        recommendedHashtags: config.recommendedHashtags,
        bestImageSize: config.bestImageSize,
        notes: config.notes,
      },
      metadata: {
        wordCount,
        characterCount: content.length,
        estimatedReadTime: `${Math.ceil(wordCount / 200)} min read`,
        hasEmojis: hasEmojis(content),
        hashtags,
      },
    });
  } catch (error) {
    console.error(`Platform-specific post generation error:`, error);
    return NextResponse.json(
      {
        error: `Failed to generate ${platform} post: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
