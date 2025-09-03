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
// //       postLength = 'medium',
// //       postStyle = 'professional',
// //       imageCount = 1,
// //       imageVariations = ['modern', 'artistic', 'professional'],
// //       imageSize = 'medium'
// //     } = body;

// //     if (!prompt) {
// //       return NextResponse.json(
// //         { error: 'Missing required field: prompt' },
// //         { status: 400 }
// //       );
// //     }

// //     // Generate the post
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

// //     const postPrompt = `Create a ${postStyle} social media post about: ${prompt}.
// //     Length: ${lengthInstructions[postLength as keyof typeof lengthInstructions]}
// //     Style: ${styleInstructions[postStyle as keyof typeof styleInstructions]}
// //     Include relevant hashtags and emojis where appropriate.`;

// //     const postResponse = await openai.chat.completions.create({
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

// //     const content = postResponse.choices[0]?.message?.content?.trim() || '';

// //     // Calculate post metadata
// //     const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
// //     const characterCount = content.length;
// //     const estimatedReadTime = `${Math.ceil(wordCount / 200)} min read`;
// //     const hasEmojisResult = hasEmojis(content);
// //     const hashtags = content.match(/#\w+/g) || [];

// //     // Generate multiple images if requested
// //     const images: Array<{ url: string; style: string; prompt: string }> = [];

// //     if (imageCount > 0) {
// //       const stylesToUse = imageVariations.slice(0, imageCount);
// //       while (stylesToUse.length < imageCount) {
// //         stylesToUse.push(...imageVariations.slice(0, imageCount - stylesToUse.length));
// //       }

// //       for (let i = 0; i < imageCount; i++) {
// //         try {
// //           const style = stylesToUse[i] || 'modern';
// //           const imagePrompt = `${prompt}, ${style} style, social media friendly, eye-catching, high quality, professional`;
// //           const imageUrl = generateImageUrl(imagePrompt, imageSize);

// //           images.push({
// //             url: imageUrl,
// //             style,
// //             prompt: imagePrompt
// //           });
// //         } catch (imageError) {
// //           console.warn(`Image ${i + 1} generation failed:`, imageError);
// //         }
// //       }
// //     }

// //     return NextResponse.json({
// //       post: {
// //         content,
// //         metadata: {
// //           wordCount,
// //           characterCount,
// //           estimatedReadTime,
// //           hasEmojis: hasEmojisResult,
// //           hashtags
// //         }
// //       },
// //       images
// //     });

// //   } catch (error) {
// //     console.error('Social media package generation error:', error);
// //     return NextResponse.json(
// //       { error: `Failed to generate social media package: ${error instanceof Error ? error.message : 'Unknown error'}` },
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
//       postLength = "medium",
//       postStyle = "professional",
//       imageCount = 1,
//       imageVariations = ["modern", "artistic", "professional"],
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

//     // Generate the post
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

//     const postPrompt = `Create a ${postStyle} social media post about: ${prompt}.
//     Length: ${lengthInstructions[postLength as keyof typeof lengthInstructions]}
//     Style: ${styleInstructions[postStyle as keyof typeof styleInstructions]}
//     Include relevant hashtags and emojis where appropriate.`;

//     const postResponse = await openai.chat.completions.create({
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

//     const content = postResponse.choices[0]?.message?.content?.trim() || "";

//     // Calculate post metadata
//     const wordCount = content
//       .split(/\s+/)
//       .filter((word) => word.length > 0).length;
//     const characterCount = content.length;
//     const estimatedReadTime = `${Math.ceil(wordCount / 200)} min read`;
//     const hasEmojisResult = hasEmojis(content);
//     const hashtags = content.match(/#\w+/g) || [];

//     // Generate multiple images if requested
//     const images: Array<{ url: string; style: string; prompt: string }> = [];

//     if (imageCount > 0) {
//       const stylesToUse = imageVariations.slice(0, imageCount);
//       while (stylesToUse.length < imageCount) {
//         stylesToUse.push(
//           ...imageVariations.slice(0, imageCount - stylesToUse.length)
//         );
//       }

//       for (let i = 0; i < imageCount; i++) {
//         try {
//           const style = stylesToUse[i] || "modern";
//           const imagePrompt = `${prompt}, ${style} style, social media friendly, eye-catching, high quality, professional`;
//           const imageUrl = generateImageUrl(imagePrompt, imageSize);

//           images.push({
//             url: imageUrl,
//             style,
//             prompt: imagePrompt,
//           });
//         } catch (imageError) {
//           console.warn(`Image ${i + 1} generation failed:`, imageError);
//         }
//       }
//     }

//     return NextResponse.json({
//       post: {
//         content,
//         metadata: {
//           wordCount,
//           characterCount,
//           estimatedReadTime,
//           hasEmojis: hasEmojisResult,
//           hashtags,
//         },
//       },
//       images,
//     });
//   } catch (error) {
//     console.error("Social media package generation error:", error);
//     return NextResponse.json(
//       {
//         error: `Failed to generate social media package: ${
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
      postLength = "medium",
      postStyle = "professional",
      imageCount = 1,
      imageVariations = ["modern", "artistic", "professional"],
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

    // Generate the post
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

    const postPrompt = `Create a ${postStyle} social media post about: ${prompt}. 
    Length: ${lengthInstructions[postLength as keyof typeof lengthInstructions]}
    Style: ${styleInstructions[postStyle as keyof typeof styleInstructions]}
    Include relevant hashtags and emojis where appropriate.`;

    const postResponse = await openai.chat.completions.create({
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

    const content = postResponse.choices[0]?.message?.content?.trim() || "";

    // Calculate post metadata
    const wordCount = content
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const characterCount = content.length;
    const estimatedReadTime = `${Math.ceil(wordCount / 200)} min read`;
    const hasEmojisResult = hasEmojis(content);
    const hashtags = content.match(/#\w+/g) || [];

    // Generate multiple images if requested
    const images: Array<{ url: string; style: string; prompt: string }> = [];

    if (imageCount > 0) {
      const stylesToUse = imageVariations.slice(0, imageCount);
      while (stylesToUse.length < imageCount) {
        stylesToUse.push(
          ...imageVariations.slice(0, imageCount - stylesToUse.length)
        );
      }

      for (let i = 0; i < imageCount; i++) {
        try {
          const style = stylesToUse[i] || "modern";
          const imagePrompt = `${prompt}, ${style} style, social media friendly, eye-catching, high quality, professional`;
          const imageUrl = generateImageUrl(imagePrompt, imageSize);

          images.push({
            url: imageUrl,
            style,
            prompt: imagePrompt,
          });
        } catch (imageError) {
          console.warn(`Image ${i + 1} generation failed:`, imageError);
        }
      }
    }

    return NextResponse.json({
      post: {
        content,
        metadata: {
          wordCount,
          characterCount,
          estimatedReadTime,
          hasEmojis: hasEmojisResult,
          hashtags,
        },
      },
      images,
    });
  } catch (error) {
    console.error("Social media package generation error:", error);
    return NextResponse.json(
      {
        error: `Failed to generate social media package: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
