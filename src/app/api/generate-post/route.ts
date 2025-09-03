// // import { NextRequest, NextResponse } from 'next/server';
// // import OpenAI from 'openai';

// // const openai = new OpenAI({
// //   apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
// //   baseURL: process.env.OPENROUTER_API_KEY
// //     ? 'https://openrouter.ai/api/v1'
// //     : undefined,
// // });

// // const hasEmojis = (text: string): boolean => {
// //   const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
// //   return emojiRegex.test(text);
// // };

// // function generateImageUrl(prompt: string, size: string = 'medium'): string {
// //   const sizes = {
// //     small: { width: 512, height: 512 },
// //     medium: { width: 768, height: 768 },
// //     large: { width: 1024, height: 1024 },
// //     wide: { width: 1024, height: 576 },
// //     tall: { width: 576, height: 1024 }
// //   };

// //   const sizeConfig = sizes[size as keyof typeof sizes] || sizes.medium;
// //   const cleanPrompt = prompt.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
// //   const seed = Math.floor(Math.random() * 1000000);

// //   return `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=${sizeConfig.width}&height=${sizeConfig.height}&seed=${seed}&nologo=true`;
// // }

// // export async function POST(request: NextRequest) {
// //   try {
// //     const body = await request.json();
// //     const {
// //       prompt,
// //       length = 'medium',
// //       style = 'professional',
// //       includeImage = false,
// //       imageSize = 'medium'
// //     } = body;

// //     if (!prompt) {
// //       return NextResponse.json(
// //         { error: 'Missing required field: prompt' },
// //         { status: 400 }
// //       );
// //     }

// //     const lengthInstructions = {
// //       short: "Keep it concise, 1-2 sentences, under 100 characters.",
// //       medium: "Make it engaging, 2-4 sentences, around 100-200 characters.",
// //       long: "Create a detailed post, 3-6 sentences, around 200-400 characters.",
// //       extended: "Write a comprehensive post, multiple paragraphs, 400+ characters."
// //     };

// //     const styleInstructions = {
// //       professional: "Use professional tone, business-appropriate language, and industry insights.",
// //       casual: "Use conversational tone, informal language, and relatable content.",
// //       creative: "Use creative language, storytelling, and imaginative expressions.",
// //       marketing: "Use persuasive language, call-to-actions, and marketing techniques."
// //     };

// //     const postPrompt = `Create a ${style} social media post about: ${prompt}.
// //     Length: ${lengthInstructions[length as keyof typeof lengthInstructions]}
// //     Style: ${styleInstructions[style as keyof typeof styleInstructions]}
// //     Include relevant hashtags and emojis where appropriate.`;

// //     const response = await openai.chat.completions.create({
// //       model: process.env.OPENROUTER_API_KEY
// //         ? 'mistralai/mistral-7b-instruct'
// //         : 'gpt-3.5-turbo',
// //       messages: [
// //         {
// //           role: 'system',
// //           content: hasEmojis(prompt)
// //             ? "Generate a social media post with emojis and hashtags. Keep it engaging, fun, and use emojis throughout the content."
// //             : "Generate a professional social media post with hashtags. Keep it engaging and professional."
// //         },
// //         {
// //           role: 'user',
// //           content: postPrompt
// //         }
// //       ],
// //       temperature: 0.7,
// //       max_tokens: 300
// //     });

// //     const content = response.choices[0]?.message?.content?.trim() || '';

// //     let imageUrl: string | undefined;
// //     if (includeImage) {
// //       try {
// //         imageUrl = generateImageUrl(`Social media post about ${prompt}`, imageSize);
// //       } catch (error) {
// //         console.warn('Post image generation failed');
// //       }
// //     }

// //     // Calculate metadata
// //     const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
// //     const characterCount = content.length;
// //     const estimatedReadTime = `${Math.ceil(wordCount / 200)} min read`;
// //     const hasEmojisResult = hasEmojis(content);
// //     const hashtags = content.match(/#\w+/g) || [];

// //     return NextResponse.json({
// //       content,
// //       imageUrl,
// //       metadata: {
// //         wordCount,
// //         characterCount,
// //         estimatedReadTime,
// //         hasEmojis: hasEmojisResult,
// //         hashtags
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Post generation error:', error);
// //     return NextResponse.json(
// //       { error: `Failed to generate post: ${error instanceof Error ? error.message : 'Unknown error'}` },
// //       { status: 500 }
// //     );
// //   }
// // }
// import { NextRequest, NextResponse } from "next/server";
// import OpenAI from "openai";

// const hasEmojis = (text: string): boolean => {
//   const emojiRegex =
//     /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
//   return emojiRegex.test(text);
// };

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

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const {
//       prompt,
//       length = "medium",
//       style = "professional",
//       includeImage = false,
//       imageSize = "medium",
//     } = body;

//     if (!prompt) {
//       return NextResponse.json(
//         { error: "Missing required field: prompt" },
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

//     const lengthInstructions = {
//       short: "Keep it concise, 1-2 sentences, under 100 characters.",
//       medium: "Make it engaging, 2-4 sentences, around 100-200 characters.",
//       long: "Create a detailed post, 3-6 sentences, around 200-400 characters.",
//       extended:
//         "Write a comprehensive post, multiple paragraphs, 400+ characters.",
//     };

//     const styleInstructions = {
//       professional:
//         "Use professional tone, business-appropriate language, and industry insights.",
//       casual:
//         "Use conversational tone, informal language, and relatable content.",
//       creative:
//         "Use creative language, storytelling, and imaginative expressions.",
//       marketing:
//         "Use persuasive language, call-to-actions, and marketing techniques.",
//     };

//     const postPrompt = `Create a ${style} social media post about: ${prompt}.
//     Length: ${lengthInstructions[length as keyof typeof lengthInstructions]}
//     Style: ${styleInstructions[style as keyof typeof styleInstructions]}
//     Include relevant hashtags and emojis where appropriate.`;

//     const response = await openai.chat.completions.create({
//       model: process.env.OPENROUTER_API_KEY
//         ? "mistralai/mistral-7b-instruct"
//         : "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content: hasEmojis(prompt)
//             ? "Generate a social media post with emojis and hashtags. Keep it engaging, fun, and use emojis throughout the content."
//             : "Generate a professional social media post with hashtags. Keep it engaging and professional.",
//         },
//         {
//           role: "user",
//           content: postPrompt,
//         },
//       ],
//       temperature: 0.7,
//       max_tokens: 300,
//     });

//     const content = response.choices[0]?.message?.content?.trim() || "";

//     let imageUrl: string | undefined;
//     if (includeImage) {
//       try {
//         imageUrl = generateImageUrl(
//           `Social media post about ${prompt}`,
//           imageSize
//         );
//       } catch (error) {
//         console.warn("Post image generation failed");
//       }
//     }

//     // Calculate metadata
//     const wordCount = content
//       .split(/\s+/)
//       .filter((word) => word.length > 0).length;
//     const characterCount = content.length;
//     const estimatedReadTime = `${Math.ceil(wordCount / 200)} min read`;
//     const hasEmojisResult = hasEmojis(content);
//     const hashtags = content.match(/#\w+/g) || [];

//     return NextResponse.json({
//       content,
//       imageUrl,
//       metadata: {
//         wordCount,
//         characterCount,
//         estimatedReadTime,
//         hasEmojis: hasEmojisResult,
//         hashtags,
//       },
//     });
//   } catch (error) {
//     console.error("Post generation error:", error);
//     return NextResponse.json(
//       {
//         error: `Failed to generate post: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`,
//       },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const hasEmojis = (text: string): boolean => {
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  return emojiRegex.test(text);
};

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      prompt,
      length = "medium",
      style = "professional",
      includeImage = false,
      imageSize = "medium",
    } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing required field: prompt" },
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

    const lengthInstructions = {
      short: "Keep it concise, 1-2 sentences, under 100 characters.",
      medium: "Make it engaging, 2-4 sentences, around 100-200 characters.",
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

    const postPrompt = `Create a ${style} social media post about: ${prompt}. 
    Length: ${lengthInstructions[length as keyof typeof lengthInstructions]}
    Style: ${styleInstructions[style as keyof typeof styleInstructions]}
    Include relevant hashtags and emojis where appropriate.`;

    const response = await openai.chat.completions.create({
      model: process.env.OPENROUTER_API_KEY
        ? "mistralai/mistral-7b-instruct"
        : "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: hasEmojis(prompt)
            ? "Generate a social media post with emojis and hashtags. Keep it engaging, fun, and use emojis throughout the content."
            : "Generate a professional social media post with hashtags. Keep it engaging and professional.",
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
    if (includeImage) {
      try {
        imageUrl = generateImageUrl(
          `Social media post about ${prompt}`,
          imageSize
        );
      } catch (error) {
        console.warn("Post image generation failed");
      }
    }

    // Calculate metadata
    const wordCount = content
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const characterCount = content.length;
    const estimatedReadTime = `${Math.ceil(wordCount / 200)} min read`;
    const hasEmojisResult = hasEmojis(content);
    const hashtags = content.match(/#\w+/g) || [];

    return NextResponse.json({
      content,
      imageUrl,
      metadata: {
        wordCount,
        characterCount,
        estimatedReadTime,
        hasEmojis: hasEmojisResult,
        hashtags,
      },
    });
  } catch (error) {
    console.error("Post generation error:", error);
    return NextResponse.json(
      {
        error: `Failed to generate post: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
