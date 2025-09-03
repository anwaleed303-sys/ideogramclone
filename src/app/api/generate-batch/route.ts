// // import { NextRequest, NextResponse } from 'next/server';
// // import OpenAI from 'openai';

// // const openai = new OpenAI({
// //   apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
// //   baseURL: process.env.OPENROUTER_API_KEY
// //     ? 'https://openrouter.ai/api/v1'
// //     : undefined,
// // });

// // function generateImageUrl(prompt: string, size: string = 'medium'): string {
// //   const sizes = {
// //     small: { width: 512, height: 512 },
// //     medium: { width: 768, height: 768 },
// //     large: { width: 1024, height: 1024 }
// //   };

// //   const sizeConfig = sizes[size as keyof typeof sizes] || sizes.medium;
// //   const cleanPrompt = prompt.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
// //   const seed = Math.floor(Math.random() * 1000000);

// //   return `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=${sizeConfig.width}&height=${sizeConfig.height}&seed=${seed}&nologo=true`;
// // }

// // export async function POST(request: NextRequest) {
// //   try {
// //     const body = await request.json();
// //     const { prompts, type, size } = body;

// //     if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
// //       return NextResponse.json(
// //         { error: 'Missing required field: prompts (must be a non-empty array)' },
// //         { status: 400 }
// //       );
// //     }

// //     if (!type) {
// //       return NextResponse.json(
// //         { error: 'Missing required field: type' },
// //         { status: 400 }
// //       );
// //     }

// //     const results = await Promise.allSettled(
// //       prompts.map(async (prompt: string, index: number) => {
// //         try {
// //           const systemPrompts = {
// //             post: "Generate a social media post with hashtags. Keep it engaging and professional.",
// //             template: "Create a professional template with clear structure and placeholders in [BRACKET] format.",
// //             image: "Create a detailed, artistic image prompt with specific visual elements and style."
// //           };

// //           let content = '';
// //           let imageUrl = '';

// //           if (type === 'image') {
// //             try {
// //               const response = await openai.chat.completions.create({
// //                 model: process.env.OPENROUTER_API_KEY
// //                   ? 'mistralai/mistral-7b-instruct'
// //                   : 'gpt-3.5-turbo',
// //                 messages: [
// //                   {
// //                     role: 'system',
// //                     content: systemPrompts.image
// //                   },
// //                   {
// //                     role: 'user',
// //                     content: `Create a detailed image prompt for: ${prompt}`
// //                   }
// //                 ],
// //                 temperature: 0.7,
// //                 max_tokens: 200
// //               });

// //               content = response.choices[0]?.message?.content?.trim() || prompt;
// //               imageUrl = generateImageUrl(content, size);
// //             } catch (error) {
// //               content = `${prompt}, high quality, detailed, professional, artistic`;
// //               imageUrl = generateImageUrl(content, size);
// //             }
// //           } else {
// //             const response = await openai.chat.completions.create({
// //               model: process.env.OPENROUTER_API_KEY
// //                 ? 'mistralai/mistral-7b-instruct'
// //                 : 'gpt-3.5-turbo',
// //               messages: [
// //                 {
// //                   role: 'system',
// //                   content: systemPrompts[type as keyof typeof systemPrompts] || 'You are a helpful assistant.'
// //                 },
// //                 {
// //                   role: 'user',
// //                   content: prompt
// //                 }
// //               ],
// //               temperature: 0.7,
// //               max_tokens: 300
// //             });

// //             content = response.choices[0]?.message?.content?.trim() || '';
// //           }

// //           return {
// //             id: `${Date.now()}-${index}`,
// //             type,
// //             prompt,
// //             content,
// //             imageUrl,
// //             imageSize: size,
// //             createdAt: new Date().toISOString()
// //           };
// //         } catch (error) {
// //           console.error(`Batch item ${index} failed:`, error);
// //           return null;
// //         }
// //       })
// //     );

// //     const successfulItems = results
// //       .filter((result): result is PromiseFulfilledResult<any> =>
// //         result.status === 'fulfilled' && result.value !== null
// //       )
// //       .map(result => result.value);

// //     return NextResponse.json({
// //       items: successfulItems,
// //       summary: {
// //         total: prompts.length,
// //         successful: successfulItems.length,
// //         failed: prompts.length - successfulItems.length
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Batch generation error:', error);
// //     return NextResponse.json(
// //       { error: `Batch generation failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
// //       { status: 500 }
// //     );
// //   }
// // }
// import { NextRequest, NextResponse } from "next/server";
// import OpenAI from "openai";

// function generateImageUrl(prompt: string, size: string = "medium"): string {
//   const sizes = {
//     small: { width: 512, height: 512 },
//     medium: { width: 768, height: 768 },
//     large: { width: 1024, height: 1024 },
//   };

//   const sizeConfig = sizes[size as keyof typeof sizes] || sizes.medium;
//   const cleanPrompt = prompt.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
//   const seed = Math.floor(Math.random() * 1000000);

//   return `https://image.pollinations.ai/prompt/${encodeURIComponent(
//     cleanPrompt
//   )}?width=${sizeConfig.width}&height=${
//     sizeConfig.height
//   }&seed=${seed}&nologo=true`;
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { prompts, type, size } = body;

//     if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
//       return NextResponse.json(
//         {
//           error: "Missing required field: prompts (must be a non-empty array)",
//         },
//         { status: 400 }
//       );
//     }

//     if (!type) {
//       return NextResponse.json(
//         { error: "Missing required field: type" },
//         { status: 400 }
//       );
//     }

//     // Initialize OpenAI client inside the request handler
//     const openai = new OpenAI({
//       apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
//       baseURL: process.env.OPENROUTER_API_KEY
//         ? "https://openrouter.ai/api/v1"
//         : undefined,
//     });

//     const results = await Promise.allSettled(
//       prompts.map(async (prompt: string, index: number) => {
//         try {
//           const systemPrompts = {
//             post: "Generate a social media post with hashtags. Keep it engaging and professional.",
//             template:
//               "Create a professional template with clear structure and placeholders in [BRACKET] format.",
//             image:
//               "Create a detailed, artistic image prompt with specific visual elements and style.",
//           };

//           let content = "";
//           let imageUrl = "";

//           if (type === "image") {
//             try {
//               const response = await openai.chat.completions.create({
//                 model: process.env.OPENROUTER_API_KEY
//                   ? "mistralai/mistral-7b-instruct"
//                   : "gpt-3.5-turbo",
//                 messages: [
//                   {
//                     role: "system",
//                     content: systemPrompts.image,
//                   },
//                   {
//                     role: "user",
//                     content: `Create a detailed image prompt for: ${prompt}`,
//                   },
//                 ],
//                 temperature: 0.7,
//                 max_tokens: 200,
//               });

//               content = response.choices[0]?.message?.content?.trim() || prompt;
//               imageUrl = generateImageUrl(content, size);
//             } catch (error) {
//               content = `${prompt}, high quality, detailed, professional, artistic`;
//               imageUrl = generateImageUrl(content, size);
//             }
//           } else {
//             const response = await openai.chat.completions.create({
//               model: process.env.OPENROUTER_API_KEY
//                 ? "mistralai/mistral-7b-instruct"
//                 : "gpt-3.5-turbo",
//               messages: [
//                 {
//                   role: "system",
//                   content:
//                     systemPrompts[type as keyof typeof systemPrompts] ||
//                     "You are a helpful assistant.",
//                 },
//                 {
//                   role: "user",
//                   content: prompt,
//                 },
//               ],
//               temperature: 0.7,
//               max_tokens: 300,
//             });

//             content = response.choices[0]?.message?.content?.trim() || "";
//           }

//           return {
//             id: `${Date.now()}-${index}`,
//             type,
//             prompt,
//             content,
//             imageUrl,
//             imageSize: size,
//             createdAt: new Date().toISOString(),
//           };
//         } catch (error) {
//           console.error(`Batch item ${index} failed:`, error);
//           return null;
//         }
//       })
//     );

//     const successfulItems = results
//       .filter(
//         (result): result is PromiseFulfilledResult<any> =>
//           result.status === "fulfilled" && result.value !== null
//       )
//       .map((result) => result.value);

//     return NextResponse.json({
//       items: successfulItems,
//       summary: {
//         total: prompts.length,
//         successful: successfulItems.length,
//         failed: prompts.length - successfulItems.length,
//       },
//     });
//   } catch (error) {
//     console.error("Batch generation error:", error);
//     return NextResponse.json(
//       {
//         error: `Batch generation failed: ${
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
    const { prompts, type, size } = body;

    if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
      return NextResponse.json(
        {
          error: "Missing required field: prompts (must be a non-empty array)",
        },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: "Missing required field: type" },
        { status: 400 }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
      baseURL: process.env.OPENROUTER_API_KEY
        ? "https://openrouter.ai/api/v1"
        : undefined,
    });

    const results = await Promise.allSettled(
      prompts.map(async (prompt: string, index: number) => {
        try {
          const systemPrompts = {
            post: "Generate a social media post with hashtags. Keep it engaging and professional.",
            template:
              "Create a professional template with clear structure and placeholders in [BRACKET] format.",
            image:
              "Create a detailed, artistic image prompt with specific visual elements and style.",
          };

          let content = "";
          let imageUrl = "";

          if (type === "image") {
            try {
              const response = await openai.chat.completions.create({
                model: process.env.OPENROUTER_API_KEY
                  ? "mistralai/mistral-7b-instruct"
                  : "gpt-3.5-turbo",
                messages: [
                  {
                    role: "system",
                    content: systemPrompts.image,
                  },
                  {
                    role: "user",
                    content: `Create a detailed image prompt for: ${prompt}`,
                  },
                ],
                temperature: 0.7,
                max_tokens: 200,
              });

              content = response.choices[0]?.message?.content?.trim() || prompt;
              imageUrl = generateImageUrl(content, size);
            } catch (error) {
              content = `${prompt}, high quality, detailed, professional, artistic`;
              imageUrl = generateImageUrl(content, size);
            }
          } else {
            const response = await openai.chat.completions.create({
              model: process.env.OPENROUTER_API_KEY
                ? "mistralai/mistral-7b-instruct"
                : "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content:
                    systemPrompts[type as keyof typeof systemPrompts] ||
                    "You are a helpful assistant.",
                },
                {
                  role: "user",
                  content: prompt,
                },
              ],
              temperature: 0.7,
              max_tokens: 300,
            });

            content = response.choices[0]?.message?.content?.trim() || "";
          }

          return {
            id: `${Date.now()}-${index}`,
            type,
            prompt,
            content,
            imageUrl,
            imageSize: size,
            createdAt: new Date().toISOString(),
          };
        } catch (error) {
          console.error(`Batch item ${index} failed:`, error);
          return null;
        }
      })
    );

    const successfulItems = results
      .filter(
        (result): result is PromiseFulfilledResult<any> =>
          result.status === "fulfilled" && result.value !== null
      )
      .map((result) => result.value);

    return NextResponse.json({
      items: successfulItems,
      summary: {
        total: prompts.length,
        successful: successfulItems.length,
        failed: prompts.length - successfulItems.length,
      },
    });
  } catch (error) {
    console.error("Batch generation error:", error);
    return NextResponse.json(
      {
        error: `Batch generation failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
