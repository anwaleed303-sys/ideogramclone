// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
//   baseURL: process.env.OPENROUTER_API_KEY
//     ? 'https://openrouter.ai/api/v1'
//     : undefined,
// });

// function generateImageUrl(prompt: string = 'beautiful sunset landscape', size: string = 'medium'): string {
//   const sizes = {
//     small: { width: 512, height: 512 },
//     medium: { width: 768, height: 768 },
//     large: { width: 1024, height: 1024 }
//   };

//   const sizeConfig = sizes[size as keyof typeof sizes] || sizes.medium;
//   const cleanPrompt = prompt.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
//   const seed = Math.floor(Math.random() * 1000000);

//   return `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=${sizeConfig.width}&height=${sizeConfig.height}&seed=${seed}&nologo=true`;
// }

// export async function GET() {
//   try {
//     const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;

//     if (!apiKey) {
//       return NextResponse.json({
//         success: false,
//         message: 'API key not found in environment variables',
//         details: {
//           checkedVariables: [
//             'OPENAI_API_KEY',
//             'OPENROUTER_API_KEY',
//             'NEXT_PUBLIC_OPENROUTER_API_KEY',
//             'NEXT_PUBLIC_OPENAI_API_KEY'
//           ],
//           recommendation: 'Please set OPENAI_API_KEY or OPENROUTER_API_KEY in your environment variables'
//         }
//       }, { status: 500 });
//     }

//     // Test LLM
//     const testResponse = await openai.chat.completions.create({
//       model: process.env.OPENROUTER_API_KEY
//         ? 'mistralai/mistral-7b-instruct'
//         : 'gpt-3.5-turbo',
//       messages: [
//         {
//           role: 'user',
//           content: 'Say "API test successful"'
//         }
//       ],
//       max_tokens: 10
//     });

//     const llmResponse = testResponse.choices[0]?.message?.content?.trim() || '';

//     // Test image generation
//     const testImageUrl = generateImageUrl('test image', 'small');

//     return NextResponse.json({
//       success: true,
//       message: 'API configuration is working correctly',
//       details: {
//         apiKeyLength: apiKey.length,
//         apiKeyPrefix: apiKey.substring(0, 8) + '...',
//         model: process.env.OPENROUTER_API_KEY
//           ? 'mistralai/mistral-7b-instruct'
//           : 'gpt-3.5-turbo',
//         testResponse: llmResponse,
//         testImageUrl,
//         timestamp: new Date().toISOString()
//       }
//     });

//   } catch (error: any) {
//     console.error('API test failed:', error);
//     return NextResponse.json({
//       success: false,
//       message: `API test failed: ${error.message}`,
//       details: {
//         error: error.message,
//         apiKeyAvailable: !!(process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY),
//         timestamp: new Date().toISOString()
//       }
//     }, { status: 500 });
//   }
// }

// export async function POST() {
//   return GET(); // Same functionality for POST requests
// }

import { NextResponse } from "next/server";
import OpenAI from "openai";

function generateImageUrl(
  prompt: string = "beautiful sunset landscape",
  size: string = "medium"
): string {
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

export async function GET() {
  try {
    console.log("DEBUG ENV", {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
      NEXT_PUBLIC_OPENROUTER_API_KEY:
        process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
    });
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
      baseURL: process.env.OPENROUTER_API_KEY
        ? "https://openrouter.ai/api/v1"
        : undefined,
    });

    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message: "API key not found in environment variables",
          details: {
            checkedVariables: [
              "OPENAI_API_KEY",
              "OPENROUTER_API_KEY",
              "NEXT_PUBLIC_OPENROUTER_API_KEY",
              "NEXT_PUBLIC_OPENAI_API_KEY",
            ],
            recommendation:
              "Please set OPENAI_API_KEY or OPENROUTER_API_KEY in your environment variables",
          },
        },
        { status: 500 }
      );
    }

    // Test LLM
    const testResponse = await openai.chat.completions.create({
      model: process.env.OPENROUTER_API_KEY
        ? "mistralai/mistral-7b-instruct"
        : "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: 'Say "API test successful"',
        },
      ],
      max_tokens: 10,
    });

    const llmResponse = testResponse.choices[0]?.message?.content?.trim() || "";

    // Test image generation
    const testImageUrl = generateImageUrl("test image", "small");

    return NextResponse.json({
      success: true,
      message: "API configuration is working correctly",
      details: {
        apiKeyLength: apiKey.length,
        apiKeyPrefix: apiKey.substring(0, 8) + "...",
        model: process.env.OPENROUTER_API_KEY
          ? "mistralai/mistral-7b-instruct"
          : "gpt-3.5-turbo",
        testResponse: llmResponse,
        testImageUrl,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("API test failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: `API test failed: ${error.message}`,
        details: {
          error: error.message,
          apiKeyAvailable: !!(
            process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY
          ),
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET(); // Same functionality for POST requests
}
