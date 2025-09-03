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
// type PostVariation = {
//   length: string;
//   style: string;
//   includeImage: boolean;
// };
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const {
//       basePrompt,
//       variations = ["modern", "artistic", "professional"],
//       size = "medium",
//       type = "image", // 'image' or 'post'
//     } = body;

//     if (!basePrompt) {
//       return NextResponse.json(
//         { error: "Missing required field: basePrompt" },
//         { status: 400 }
//       );
//     }

//     if (type === "image") {
//       // Generate image variations
//       const results = await Promise.allSettled(
//         variations.map(async (style: string, index: number) => {
//           try {
//             const styledPrompt = `${basePrompt}, ${style} style`;
//             let enhancedPrompt = styledPrompt;

//             try {
//               const response = await openai.chat.completions.create({
//                 model: process.env.OPENROUTER_API_KEY
//                   ? "mistralai/mistral-7b-instruct"
//                   : "gpt-3.5-turbo",
//                 messages: [
//                   {
//                     role: "system",
//                     content: `Create a detailed image prompt focusing on the ${style} style with specific visual details, colors, composition, and artistic elements.`,
//                   },
//                   {
//                     role: "user",
//                     content: `Create a detailed image prompt for: ${styledPrompt}`,
//                   },
//                 ],
//                 temperature: 0.7,
//                 max_tokens: 200,
//               });

//               enhancedPrompt =
//                 response.choices[0]?.message?.content?.trim() || styledPrompt;
//             } catch (llmError) {
//               console.warn(`LLM enhancement failed for variation ${index}`);
//               enhancedPrompt = `${styledPrompt}, high quality, detailed, artistic, ${style} style, professional, masterpiece`;
//             }

//             const imageUrl = generateImageUrl(enhancedPrompt, size);

//             return {
//               style,
//               imageUrl,
//               enhancedPrompt,
//             };
//           } catch (error) {
//             console.error(`Image variation ${index} (${style}) failed:`, error);
//             throw error;
//           }
//         })
//       );

//       const successfulResults = results
//         .filter(
//           (result): result is PromiseFulfilledResult<any> =>
//             result.status === "fulfilled"
//         )
//         .map((result) => result.value);

//       return NextResponse.json({
//         variations: successfulResults,
//         summary: {
//           total: variations.length,
//           successful: successfulResults.length,
//           failed: variations.length - successfulResults.length,
//         },
//       });
//     } else if (type === "post") {
//       // Generate post variations
//       const postVariations: PostVariation[] = variations.map(
//         (variation: string) => {
//           const [length, style] = variation.split(" ");
//           return {
//             length: length || "medium",
//             style: style || "professional",
//             includeImage: true,
//           };
//         }
//       );

//       const results = await Promise.allSettled(
//         postVariations.map(async (variation: PostVariation, index: number) => {
//           try {
//             const lengthInstructions = {
//               short: "Keep it concise, 1-2 sentences, under 100 characters.",
//               medium:
//                 "Make it engaging, 2-4 sentences, around 100-200 characters.",
//               long: "Create a detailed post, 3-6 sentences, around 200-400 characters.",
//               extended:
//                 "Write a comprehensive post, multiple paragraphs, 400+ characters.",
//             };

//             const styleInstructions = {
//               professional:
//                 "Use professional tone, business-appropriate language, and industry insights.",
//               casual:
//                 "Use conversational tone, informal language, and relatable content.",
//               creative:
//                 "Use creative language, storytelling, and imaginative expressions.",
//               marketing:
//                 "Use persuasive language, call-to-actions, and marketing techniques.",
//             };

//             const postPrompt = `Create a ${
//               variation.style
//             } social media post about: ${basePrompt}.
//             Length: ${
//               lengthInstructions[
//                 variation.length as keyof typeof lengthInstructions
//               ]
//             }
//             Style: ${
//               styleInstructions[
//                 variation.style as keyof typeof styleInstructions
//               ]
//             }
//             Include relevant hashtags and emojis where appropriate.`;

//             const response = await openai.chat.completions.create({
//               model: process.env.OPENROUTER_API_KEY
//                 ? "mistralai/mistral-7b-instruct"
//                 : "gpt-3.5-turbo",
//               messages: [
//                 {
//                   role: "system",
//                   content:
//                     "Generate a social media post with hashtags. Keep it engaging and match the specified style.",
//                 },
//                 {
//                   role: "user",
//                   content: postPrompt,
//                 },
//               ],
//               temperature: 0.7,
//               max_tokens: 300,
//             });

//             const content = response.choices[0]?.message?.content?.trim() || "";

//             let imageUrl: string | undefined;
//             if (variation.includeImage) {
//               try {
//                 imageUrl = generateImageUrl(
//                   `${basePrompt}, social media post, ${variation.style} style`,
//                   size
//                 );
//               } catch (imageError) {
//                 console.warn("Post image generation failed");
//               }
//             }

//             // Calculate metadata
//             const wordCount = content
//               .split(/\s+/)
//               .filter((word) => word.length > 0).length;
//             const hashtags = content.match(/#\w+/g) || [];

//             return {
//               variation: `${variation.length} ${variation.style}`,
//               content,
//               imageUrl,
//               metadata: {
//                 wordCount,
//                 characterCount: content.length,
//                 estimatedReadTime: `${Math.ceil(wordCount / 200)} min read`,
//                 hasEmojis:
//                   /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
//                     content
//                   ),
//                 hashtags,
//               },
//             };
//           } catch (error) {
//             console.error(`Post variation ${index} failed:`, error);
//             throw error;
//           }
//         })
//       );

//       const successfulResults = results
//         .filter(
//           (result): result is PromiseFulfilledResult<any> =>
//             result.status === "fulfilled"
//         )
//         .map((result) => result.value);

//       return NextResponse.json({
//         variations: successfulResults,
//         summary: {
//           total: postVariations.length,
//           successful: successfulResults.length,
//           failed: postVariations.length - successfulResults.length,
//         },
//       });
//     } else {
//       return NextResponse.json(
//         { error: 'Invalid type. Must be "image" or "post"' },
//         { status: 400 }
//       );
//     }
//   } catch (error) {
//     console.error("Variations generation error:", error);
//     return NextResponse.json(
//       {
//         error: `Failed to generate variations: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`,
//       },
//       { status: 500 }
//     );
//   }
// // }
// import { NextRequest, NextResponse } from "next/server";
// import OpenAI from "openai";

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
//   }&seed=${seed}&nologo=true`;
// }

// type PostVariation = {
//   length: string;
//   style: string;
//   includeImage: boolean;
// };

// export async function POST(request: NextRequest) {
//   try {
//     // Initialize OpenAI client
//     const openai = new OpenAI({
//       apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
//       baseURL: process.env.OPENROUTER_API_KEY
//         ? "https://openrouter.ai/api/v1"
//         : undefined,
//     });

//     const body = await request.json();
//     const {
//       basePrompt,
//       variations = ["modern", "artistic", "professional"],
//       size = "medium",
//       type = "image", // 'image' or 'post'
//     } = body;

//     if (!basePrompt) {
//       return NextResponse.json(
//         { error: "Missing required field: basePrompt" },
//         { status: 400 }
//       );
//     }

//     if (type === "image") {
//       // Generate image variations
//       const results = await Promise.allSettled(
//         variations.map(async (style: string, index: number) => {
//           try {
//             const styledPrompt = `${basePrompt}, ${style} style`;
//             let enhancedPrompt = styledPrompt;

//             try {
//               const response = await openai.chat.completions.create({
//                 model: process.env.OPENROUTER_API_KEY
//                   ? "mistralai/mistral-7b-instruct"
//                   : "gpt-3.5-turbo",
//                 messages: [
//                   {
//                     role: "system",
//                     content: `Create a detailed image prompt focusing on the ${style} style with specific visual details, colors, composition, and artistic elements.`,
//                   },
//                   {
//                     role: "user",
//                     content: `Create a detailed image prompt for: ${styledPrompt}`,
//                   },
//                 ],
//                 temperature: 0.7,
//                 max_tokens: 200,
//               });

//               enhancedPrompt =
//                 response.choices[0]?.message?.content?.trim() || styledPrompt;
//             } catch (llmError) {
//               console.warn(`LLM enhancement failed for variation ${index}`);
//               enhancedPrompt = `${styledPrompt}, high quality, detailed, artistic, ${style} style, professional, masterpiece`;
//             }

//             const imageUrl = generateImageUrl(enhancedPrompt, size);

//             return {
//               style,
//               imageUrl,
//               enhancedPrompt,
//             };
//           } catch (error) {
//             console.error(`Image variation ${index} (${style}) failed:`, error);
//             throw error;
//           }
//         })
//       );

//       const successfulResults = results
//         .filter(
//           (result): result is PromiseFulfilledResult<any> =>
//             result.status === "fulfilled"
//         )
//         .map((result) => result.value);

//       return NextResponse.json({
//         variations: successfulResults,
//         summary: {
//           total: variations.length,
//           successful: successfulResults.length,
//           failed: variations.length - successfulResults.length,
//         },
//       });
//     } else if (type === "post") {
//       // Generate post variations
//       const postVariations: PostVariation[] = variations.map(
//         (variation: string) => {
//           const [length, style] = variation.split(" ");
//           return {
//             length: length || "medium",
//             style: style || "professional",
//             includeImage: true,
//           };
//         }
//       );

//       const results = await Promise.allSettled(
//         postVariations.map(async (variation: PostVariation, index: number) => {
//           try {
//             const lengthInstructions = {
//               short: "Keep it concise, 1-2 sentences, under 100 characters.",
//               medium:
//                 "Make it engaging, 2-4 sentences, around 100-200 characters.",
//               long: "Create a detailed post, 3-6 sentences, around 200-400 characters.",
//               extended:
//                 "Write a comprehensive post, multiple paragraphs, 400+ characters.",
//             };

//             const styleInstructions = {
//               professional:
//                 "Use professional tone, business-appropriate language, and industry insights.",
//               casual:
//                 "Use conversational tone, informal language, and relatable content.",
//               creative:
//                 "Use creative language, storytelling, and imaginative expressions.",
//               marketing:
//                 "Use persuasive language, call-to-actions, and marketing techniques.",
//             };

//             const postPrompt = `Create a ${
//               variation.style
//             } social media post about: ${basePrompt}.
//             Length: ${
//               lengthInstructions[
//                 variation.length as keyof typeof lengthInstructions
//               ]
//             }
//             Style: ${
//               styleInstructions[
//                 variation.style as keyof typeof styleInstructions
//               ]
//             }
//             Include relevant hashtags and emojis where appropriate.`;

//             const response = await openai.chat.completions.create({
//               model: process.env.OPENROUTER_API_KEY
//                 ? "mistralai/mistral-7b-instruct"
//                 : "gpt-3.5-turbo",
//               messages: [
//                 {
//                   role: "system",
//                   content:
//                     "Generate a social media post with hashtags. Keep it engaging and match the specified style.",
//                 },
//                 {
//                   role: "user",
//                   content: postPrompt,
//                 },
//               ],
//               temperature: 0.7,
//               max_tokens: 300,
//             });

//             const content = response.choices[0]?.message?.content?.trim() || "";

//             let imageUrl: string | undefined;
//             if (variation.includeImage) {
//               try {
//                 imageUrl = generateImageUrl(
//                   `${basePrompt}, social media post, ${variation.style} style`,
//                   size
//                 );
//               } catch (imageError) {
//                 console.warn("Post image generation failed");
//               }
//             }

//             // Calculate metadata
//             const wordCount = content
//               .split(/\s+/)
//               .filter((word) => word.length > 0).length;
//             const hashtags = content.match(/#\w+/g) || [];

//             return {
//               variation: `${variation.length} ${variation.style}`,
//               content,
//               imageUrl,
//               metadata: {
//                 wordCount,
//                 characterCount: content.length,
//                 estimatedReadTime: `${Math.ceil(wordCount / 200)} min read`,
//                 hasEmojis:
//                   /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
//                     content
//                   ),
//                 hashtags,
//               },
//             };
//           } catch (error) {
//             console.error(`Post variation ${index} failed:`, error);
//             throw error;
//           }
//         })
//       );

//       const successfulResults = results
//         .filter(
//           (result): result is PromiseFulfilledResult<any> =>
//             result.status === "fulfilled"
//         )
//         .map((result) => result.value);

//       return NextResponse.json({
//         variations: successfulResults,
//         summary: {
//           total: postVariations.length,
//           successful: successfulResults.length,
//           failed: postVariations.length - successfulResults.length,
//         },
//       });
//     } else {
//       return NextResponse.json(
//         { error: 'Invalid type. Must be "image" or "post"' },
//         { status: 400 }
//       );
//     }
//   } catch (error) {
//     console.error("Variations generation error:", error);
//     return NextResponse.json(
//       {
//         error: `Failed to generate variations: ${
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

type PostVariation = {
  length: string;
  style: string;
  includeImage: boolean;
};

export async function POST(request: NextRequest) {
  try {
    // Initialize OpenAI client inside the request handler
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
      baseURL: process.env.OPENROUTER_API_KEY
        ? "https://openrouter.ai/api/v1"
        : undefined,
    });

    const body = await request.json();
    const {
      basePrompt,
      variations = ["modern", "artistic", "professional"],
      size = "medium",
      type = "image", // 'image' or 'post'
    } = body;

    if (!basePrompt) {
      return NextResponse.json(
        { error: "Missing required field: basePrompt" },
        { status: 400 }
      );
    }

    if (type === "image") {
      // Generate image variations
      const results = await Promise.allSettled(
        variations.map(async (style: string, index: number) => {
          try {
            const styledPrompt = `${basePrompt}, ${style} style`;
            let enhancedPrompt = styledPrompt;

            try {
              const response = await openai.chat.completions.create({
                model: process.env.OPENROUTER_API_KEY
                  ? "mistralai/mistral-7b-instruct"
                  : "gpt-3.5-turbo",
                messages: [
                  {
                    role: "system",
                    content: `Create a detailed image prompt focusing on the ${style} style with specific visual details, colors, composition, and artistic elements.`,
                  },
                  {
                    role: "user",
                    content: `Create a detailed image prompt for: ${styledPrompt}`,
                  },
                ],
                temperature: 0.7,
                max_tokens: 200,
              });

              enhancedPrompt =
                response.choices[0]?.message?.content?.trim() || styledPrompt;
            } catch (llmError) {
              console.warn(`LLM enhancement failed for variation ${index}`);
              enhancedPrompt = `${styledPrompt}, high quality, detailed, artistic, ${style} style, professional, masterpiece`;
            }

            const imageUrl = generateImageUrl(enhancedPrompt, size);

            return {
              style,
              imageUrl,
              enhancedPrompt,
            };
          } catch (error) {
            console.error(`Image variation ${index} (${style}) failed:`, error);
            throw error;
          }
        })
      );

      const successfulResults = results
        .filter(
          (result): result is PromiseFulfilledResult<any> =>
            result.status === "fulfilled"
        )
        .map((result) => result.value);

      return NextResponse.json({
        variations: successfulResults,
        summary: {
          total: variations.length,
          successful: successfulResults.length,
          failed: variations.length - successfulResults.length,
        },
      });
    } else if (type === "post") {
      // Generate post variations
      const postVariations: PostVariation[] = variations.map(
        (variation: string) => {
          const [length, style] = variation.split(" ");
          return {
            length: length || "medium",
            style: style || "professional",
            includeImage: true,
          };
        }
      );

      const results = await Promise.allSettled(
        postVariations.map(async (variation: PostVariation, index: number) => {
          try {
            const lengthInstructions = {
              short: "Keep it concise, 1-2 sentences, under 100 characters.",
              medium:
                "Make it engaging, 2-4 sentences, around 100-200 characters.",
              long: "Create a detailed post, 3-6 sentences, around 200-400 characters.",
              extended:
                "Write a comprehensive post, multiple paragraphs, 400+ characters.",
            };

            const styleInstructions = {
              professional:
                "Use professional tone, business-appropriate language, and industry insights.",
              casual:
                "Use conversational tone, informal language, and relatable content.",
              creative:
                "Use creative language, storytelling, and imaginative expressions.",
              marketing:
                "Use persuasive language, call-to-actions, and marketing techniques.",
            };

            const postPrompt = `Create a ${
              variation.style
            } social media post about: ${basePrompt}. 
            Length: ${
              lengthInstructions[
                variation.length as keyof typeof lengthInstructions
              ]
            }
            Style: ${
              styleInstructions[
                variation.style as keyof typeof styleInstructions
              ]
            }
            Include relevant hashtags and emojis where appropriate.`;

            const response = await openai.chat.completions.create({
              model: process.env.OPENROUTER_API_KEY
                ? "mistralai/mistral-7b-instruct"
                : "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content:
                    "Generate a social media post with hashtags. Keep it engaging and match the specified style.",
                },
                {
                  role: "user",
                  content: postPrompt,
                },
              ],
              temperature: 0.7,
              max_tokens: 300,
            });

            const content = response.choices[0]?.message?.content?.trim() || "";

            let imageUrl: string | undefined;
            if (variation.includeImage) {
              try {
                imageUrl = generateImageUrl(
                  `${basePrompt}, social media post, ${variation.style} style`,
                  size
                );
              } catch (imageError) {
                console.warn("Post image generation failed");
              }
            }

            // Calculate metadata
            const wordCount = content
              .split(/\s+/)
              .filter((word) => word.length > 0).length;
            const hashtags = content.match(/#\w+/g) || [];

            return {
              variation: `${variation.length} ${variation.style}`,
              content,
              imageUrl,
              metadata: {
                wordCount,
                characterCount: content.length,
                estimatedReadTime: `${Math.ceil(wordCount / 200)} min read`,
                hasEmojis:
                  /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                    content
                  ),
                hashtags,
              },
            };
          } catch (error) {
            console.error(`Post variation ${index} failed:`, error);
            throw error;
          }
        })
      );

      const successfulResults = results
        .filter(
          (result): result is PromiseFulfilledResult<any> =>
            result.status === "fulfilled"
        )
        .map((result) => result.value);

      return NextResponse.json({
        variations: successfulResults,
        summary: {
          total: postVariations.length,
          successful: successfulResults.length,
          failed: postVariations.length - successfulResults.length,
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "image" or "post"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Variations generation error:", error);
    return NextResponse.json(
      {
        error: `Failed to generate variations: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
