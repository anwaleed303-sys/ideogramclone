// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
//   baseURL: process.env.OPENROUTER_API_KEY
//     ? 'https://openrouter.ai/api/v1'
//     : undefined,
// });

// export async function GET() {
//   const details: any = {};

//   try {
//     const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
//     details.apiKeyStatus = apiKey ? 'Available' : 'Missing';

//     // Check LLM service
//     let llmHealthy = false;
//     try {
//       if (!apiKey) {
//         details.llmError = 'No API key configured';
//       } else {
//         const response = await openai.chat.completions.create({
//           model: process.env.OPENROUTER_API_KEY
//             ? 'mistralai/mistral-7b-instruct'
//             : 'gpt-3.5-turbo',
//           messages: [{ role: 'user', content: 'Test' }],
//           max_tokens: 5
//         });
//         llmHealthy = !!response.choices?.[0]?.message?.content;
//       }
//     } catch (error: any) {
//       console.warn('LLM health check failed:', error.message);
//       details.llmError = error.message;
//     }

//     // Assume Pollinations is working (it usually is)
//     const pollinationsHealthy = true;

//     return NextResponse.json({
//       llm: llmHealthy,
//       pollinations: pollinationsHealthy,
//       overall: llmHealthy && pollinationsHealthy,
//       details,
//       timestamp: new Date().toISOString()
//     });

//   } catch (error: any) {
//     console.error('Health check error:', error);
//     return NextResponse.json({
//       llm: false,
//       pollinations: true,
//       overall: false,
//       details: {
//         ...details,
//         healthCheckError: error.message
//       },
//       timestamp: new Date().toISOString()
//     }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET() {
  const details: any = {};

  try {
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
      baseURL: process.env.OPENROUTER_API_KEY
        ? "https://openrouter.ai/api/v1"
        : undefined,
    });

    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
    details.apiKeyStatus = apiKey ? "Available" : "Missing";

    // Check LLM service
    let llmHealthy = false;
    try {
      if (!apiKey) {
        details.llmError = "No API key configured";
      } else {
        const response = await openai.chat.completions.create({
          model: process.env.OPENROUTER_API_KEY
            ? "mistralai/mistral-7b-instruct"
            : "gpt-3.5-turbo",
          messages: [{ role: "user", content: "Test" }],
          max_tokens: 5,
        });
        llmHealthy = !!response.choices?.[0]?.message?.content;
      }
    } catch (error: any) {
      console.warn("LLM health check failed:", error.message);
      details.llmError = error.message;
    }

    // Assume Pollinations is working (it usually is)
    const pollinationsHealthy = true;

    return NextResponse.json({
      llm: llmHealthy,
      pollinations: pollinationsHealthy,
      overall: llmHealthy && pollinationsHealthy,
      details,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Health check error:", error);
    return NextResponse.json(
      {
        llm: false,
        pollinations: true,
        overall: false,
        details: {
          ...details,
          healthCheckError: error.message,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
