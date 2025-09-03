// // import { NextRequest, NextResponse } from "next/server";
// // import OpenAI from "openai";

// // const openai = new OpenAI({
// //   apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
// //   baseURL: process.env.OPENROUTER_API_KEY
// //     ? "https://openrouter.ai/api/v1"
// //     : undefined,
// // });

// // function generateImageUrl(prompt: string, size: string = "medium"): string {
// //   const sizes = {
// //     small: { width: 512, height: 512 },
// //     medium: { width: 768, height: 768 },
// //     large: { width: 1024, height: 1024 },
// //   };

// //   const sizeConfig = sizes[size as keyof typeof sizes] || sizes.medium;
// //   const cleanPrompt = prompt.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
// //   const seed = Math.floor(Math.random() * 1000000);

// //   return `https://image.pollinations.ai/prompt/${encodeURIComponent(
// //     cleanPrompt
// //   )}?width=${sizeConfig.width}&height=${
// //     sizeConfig.height
// //   }&seed=${seed}&nologo=true`;
// // }

// // export async function POST(request: NextRequest) {
// //   try {
// //     const body = await request.json();
// //     const { prompt } = body;

// //     if (!prompt) {
// //       return NextResponse.json(
// //         { error: "Missing required field: prompt" },
// //         { status: 400 }
// //       );
// //     }

// //     const response = await openai.chat.completions.create({
// //       model: process.env.OPENROUTER_API_KEY
// //         ? "mistralai/mistral-7b-instruct"
// //         : "gpt-3.5-turbo",
// //       messages: [
// //         {
// //           role: "system",
// //           content:
// //             "Create a professional template with clear structure and placeholders. Use [BRACKET] format for placeholders, include proper formatting, and provide helpful instructions.",
// //         },
// //         {
// //           role: "user",
// //           content: `Create a professional template for: ${prompt}. Include clear structure, placeholders in [BRACKET] format, proper formatting, and helpful instructions. If colors or styling were mentioned, include those specifications.`,
// //         },
// //       ],
// //       temperature: 0.7,
// //       max_tokens: 400,
// //     });

// //     const content = response.choices[0]?.message?.content?.trim() || "";

// //     let imageUrl: string | undefined;
// //     try {
// //       const imagePrompt = `Professional template design, ${prompt}, clean modern layout, business design, minimalist, professional appearance`;
// //       imageUrl = generateImageUrl(imagePrompt, "medium");
// //     } catch (error) {
// //       console.warn("Template image generation failed");
// //     }

// //     return NextResponse.json({
// //       content,
// //       imageUrl,
// //     });
// //   } catch (error) {
// //     console.error("Template generation error:", error);
// //     return NextResponse.json(
// //       {
// //         error: `Failed to generate template: ${
// //           error instanceof Error ? error.message : "Unknown error"
// //         }`,
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }

// import { NextRequest, NextResponse } from "next/server";
// import OpenAI from "openai";

// // Helper function to handle errors
// const getErrorMessage = (error: unknown): string => {
//   if (error instanceof Error) return error.message;
//   if (typeof error === "string") return error;
//   return "An unexpected error occurred";
// };

// // Helper function to check for emojis
// const hasEmojis = (text: string): boolean => {
//   const emojiRegex =
//     /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
//   return emojiRegex.test(text);
// };

// // Generate content with LLM
// async function generateWithLLM(
//   openai: OpenAI,
//   prompt: string,
//   type: "post" | "template" | "image",
//   userInput?: string
// ): Promise<string> {
//   const systemPrompts = {
//     post: (() => {
//       if (userInput && hasEmojis(userInput)) {
//         return "Generate a social media post with emojis and hashtags. Keep it engaging, fun, and use emojis throughout the content to match the user's style.";
//       } else {
//         return "Generate a professional social media post with hashtags. Keep it engaging and professional. Add emojis only where they are most suitable and enhance the message.";
//       }
//     })(),
//     template:
//       "Create a professional template with clear structure and placeholders. If the user specified colors, styling, or specific requirements, incorporate them into the template content.",
//     image:
//       "Create a detailed, artistic image prompt with specific visual elements, style, and composition details.",
//   };

//   const response = await openai.chat.completions.create({
//     model: process.env.OPENROUTER_API_KEY
//       ? "mistralai/mistral-7b-instruct"
//       : "gpt-3.5-turbo",
//     messages: [
//       {
//         role: "system",
//         content:
//           systemPrompts[type] ||
//           "You are a helpful assistant that provides clear, concise responses.",
//       },
//       {
//         role: "user",
//         content: prompt,
//       },
//     ],
//     temperature: 0.7,
//     max_tokens: 300,
//   });

//   return response.choices[0]?.message?.content?.trim() || "";
// }

// // Generate image with Pollinations
// function generateImageUrl(prompt: string, size: string = "medium"): string {
//   const sizes = {
//     small: { width: 512, height: 512 },
//     medium: { width: 768, height: 768 },
//     large: { width: 1024, height: 1024 },
//     wide: { width: 1024, height: 576 },
//     tall: { width: 576, height: 1024 },
//   };

//   const sizeConfig = sizes[size as keyof typeof sizes] || sizes.medium;
//   const cleanPrompt = prompt.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
//   const seed = Math.floor(Math.random() * 1000000);

//   return `https://image.pollinations.ai/prompt/${encodeURIComponent(
//     cleanPrompt
//   )}?width=${sizeConfig.width}&height=${
//     sizeConfig.height
//   }&seed=${seed}&nologo=true&enhance=true`;
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { type, prompt, imageSize } = body;

//     if (!prompt || !type) {
//       return NextResponse.json(
//         { error: "Missing required fields: prompt and type" },
//         { status: 400 }
//       );
//     }

//     // Initialize OpenAI client inside the request handler
//     const openai = new OpenAI({
//       apiKey: process.env.OPENROUTER_API_KEY,
//       baseURL: process.env.OPENROUTER_API_KEY
//         ? "https://openrouter.ai/api/v1"
//         : undefined,
//     });

//     let content = "";
//     let imageUrl = "";

//     if (type === "image") {
//       // Generate enhanced prompt for image
//       try {
//         const enhancedPrompt = await generateWithLLM(
//           openai,
//           `Create a detailed, artistic image prompt for: ${prompt}. Include specific visual elements, artistic style, composition, lighting, and quality descriptors.`,
//           "image",
//           prompt
//         );
//         content = enhancedPrompt;
//         imageUrl = generateImageUrl(enhancedPrompt, imageSize);
//       } catch (error) {
//         console.warn("LLM enhancement failed, using original prompt");
//         content = `${prompt}, high quality, detailed, professional, artistic, masterpiece`;
//         imageUrl = generateImageUrl(content, imageSize);
//       }
//     } else {
//       content = await generateWithLLM(openai, prompt, type, prompt);

//       if (type === "template") {
//         try {
//           const imagePrompt = `Professional template design for ${prompt}, clean layout, modern design, business template`;
//           imageUrl = generateImageUrl(imagePrompt, imageSize || "medium");
//         } catch (error) {
//           console.warn("Template image generation failed");
//         }
//       }
//     }

//     return NextResponse.json({
//       id: Date.now().toString(),
//       type,
//       prompt,
//       content,
//       imageUrl,
//       imageSize,
//       createdAt: new Date().toISOString(),
//     });
//   } catch (error) {
//     console.error("Content generation error:", error);
//     return NextResponse.json(
//       { error: `Failed to generate content: ${getErrorMessage(error)}` },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

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
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
      baseURL: process.env.OPENROUTER_API_KEY
        ? "https://openrouter.ai/api/v1"
        : undefined,
    });

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
