// import { NextRequest, NextResponse } from "next/server";
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
//   baseURL: process.env.OPENROUTER_API_KEY
//     ? "https://openrouter.ai/api/v1"
//     : undefined,
// });

// function generateImageUrl(prompt: string, size: string = "medium"): string {
//   const sizes = {
//     small: { width: 512, height: 512 },
//     medium: { width: 768, height: 768 },
//     large: { width: 1024, height: 1024 },
//     wide: { width: 1024, height: 576 },
//     tall: { width: 576, height: 1024 },
//     youtube: { width: 1280, height: 720 },
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
//     const { prompt, size = "medium" } = body;

//     if (!prompt) {
//       return NextResponse.json(
//         { error: "Missing required field: prompt" },
//         { status: 400 }
//       );
//     }

//     let enhancedPrompt = prompt;

//     try {
//       const response = await openai.chat.completions.create({
//         model: process.env.OPENROUTER_API_KEY
//           ? "mistralai/mistral-7b-instruct"
//           : "gpt-3.5-turbo",
//         messages: [
//           {
//             role: "system",
//             content:
//               "Transform this into a detailed, creative image prompt. Add artistic details, style, composition, lighting, colors, and quality descriptors.",
//           },
//           {
//             role: "user",
//             content: `Create a detailed image prompt for: ${prompt}`,
//           },
//         ],
//         temperature: 0.7,
//         max_tokens: 200,
//       });

//       enhancedPrompt = response.choices[0]?.message?.content?.trim() || prompt;
//     } catch (error) {
//       console.warn("LLM enhancement failed, using enhanced fallback");
//       enhancedPrompt = `${prompt}, high quality, detailed, professional, artistic, beautiful composition, perfect lighting, vibrant colors, masterpiece, 8k resolution`;
//     }

//     const imageUrl = generateImageUrl(enhancedPrompt, size);

//     return NextResponse.json({
//       imageUrl,
//       enhancedPrompt,
//       originalPrompt: prompt,
//       size,
//     });
//   } catch (error) {
//     console.error("Image generation error:", error);
//     return NextResponse.json(
//       {
//         error: `Failed to generate image: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`,
//       },
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
    wide: { width: 1024, height: 576 },
    tall: { width: 576, height: 1024 },
    youtube: { width: 1280, height: 720 },
  };

  const sizeConfig = sizes[size as keyof typeof sizes] || sizes.medium;
  const cleanPrompt = prompt.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
  const seed = Math.floor(Math.random() * 1000000);

  return `https://image.pollinations.ai/prompt/${encodeURIComponent(
    cleanPrompt
  )}?width=${sizeConfig.width}&height=${
    sizeConfig.height
  }&seed=${seed}&nologo=true&enhance=true`;
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
    const { prompt, size = "medium" } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing required field: prompt" },
        { status: 400 }
      );
    }

    let enhancedPrompt = prompt;

    try {
      const response = await openai.chat.completions.create({
        model: process.env.OPENROUTER_API_KEY
          ? "mistralai/mistral-7b-instruct"
          : "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Transform this into a detailed, creative image prompt. Add artistic details, style, composition, lighting, colors, and quality descriptors.",
          },
          {
            role: "user",
            content: `Create a detailed image prompt for: ${prompt}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      });

      enhancedPrompt = response.choices[0]?.message?.content?.trim() || prompt;
    } catch (error) {
      console.warn("LLM enhancement failed, using enhanced fallback");
      enhancedPrompt = `${prompt}, high quality, detailed, professional, artistic, beautiful composition, perfect lighting, vibrant colors, masterpiece, 8k resolution`;
    }

    const imageUrl = generateImageUrl(enhancedPrompt, size);

    return NextResponse.json({
      imageUrl,
      enhancedPrompt,
      originalPrompt: prompt,
      size,
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      {
        error: `Failed to generate image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
