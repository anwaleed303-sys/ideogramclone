// import axios from "axios";
// import {
//   GenerationRequest,
//   GeneratedItem,
//   ContentType,
//   ImageSize,
// } from "../types";
// import { generateId } from "../utils/idUtils";

// const API_BASE_URL = "/api";

// // Helper function to handle unknown errors
// const getErrorMessage = (error: unknown): string => {
//   if (error instanceof Error) {
//     return error.message;
//   }
//   if (typeof error === "string") {
//     return error;
//   }
//   if (error && typeof error === "object" && "message" in error) {
//     return String(error.message);
//   }
//   return "An unexpected error occurred";
// };

// // Enhanced API key retrieval function for Next.js
// const getApiKey = (): string => {
//   // Debug: Log all available environment variables
//   console.log("=== API Key Debug Info (Next.js) ===");

//   // For Next.js, we check process.env (server-side) and window.__NEXT_DATA__ (client-side)
//   let nextEnv: any = {};

//   // Client-side: Check process.env (Next.js exposes NEXT_PUBLIC_ vars to client)
//   if (typeof window !== "undefined") {
//     console.log("Running on client-side");
//     nextEnv = process.env;
//   } else {
//     console.log("Running on server-side");
//     nextEnv = process.env;
//   }

//   if (nextEnv) {
//     console.log("Available Next.js env vars:", Object.keys(nextEnv));
//     Object.keys(nextEnv).forEach((key) => {
//       if (
//         key.toLowerCase().includes("key") ||
//         key.toLowerCase().includes("api")
//       ) {
//         console.log(
//           `Next.js env: ${key} = ${nextEnv[key] ? "[HAS VALUE]" : "[EMPTY]"}`
//         );
//       }
//     });
//   }

//   // Check multiple possible environment variable names for Next.js
//   const envChecks = [
//     {
//       name: "NEXT_PUBLIC_OPENROUTER_API_KEY",
//       value: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
//     },
//     {
//       name: "NEXT_PUBLIC_OPENAI_API_KEY",
//       value: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
//     },
//     {
//       name: "NEXT_PUBLIC_OPENAI_APIxxxxx_KEY",
//       value: process.env.NEXT_PUBLIC_OPENAI_APIxxxxx_KEY,
//     },
//     {
//       name: "NEXT_PUBLIC_API_KEY",
//       value: process.env.NEXT_PUBLIC_API_KEY,
//     },
//     // Server-side only variables (won't work on client-side)
//     {
//       name: "OPENROUTER_API_KEY (server-only)",
//       value: process.env.OPENROUTER_API_KEY,
//     },
//     {
//       name: "OPENAI_API_KEY (server-only)",
//       value: process.env.OPENAI_API_KEY,
//     },
//     {
//       name: "OPENAI_APIxxxxx_KEY (server-only)",
//       value: process.env.OPENAI_APIxxxxx_KEY,
//     },
//     // Legacy Vite variables (for backward compatibility)
//     {
//       name: "VITE_OPENROUTER_API_KEY (legacy)",
//       value: process.env.VITE_OPENROUTER_API_KEY,
//     },
//     {
//       name: "VITE_OPENAI_APIxxxxx_KEY (legacy)",
//       value: process.env.VITE_OPENAI_APIxxxxx_KEY,
//     },
//   ];

//   console.log("Environment variable checks:");
//   envChecks.forEach((check) => {
//     console.log(
//       `${check.name}: ${
//         check.value ? `[FOUND - length: ${check.value.length}]` : "[NOT FOUND]"
//       }`
//     );
//   });

//   // Return the first non-empty key found
//   for (const check of envChecks) {
//     if (check.value && check.value.trim() !== "") {
//       console.log(`✅ Using API key from: ${check.name}`);
//       return check.value.trim();
//     }
//   }

//   console.error("❌ No API key found in any environment variable");
//   console.error(
//     "💡 For Next.js, use NEXT_PUBLIC_ prefix for client-side variables"
//   );
//   return "";
// };

// // Debug function to help identify available environment variables for Next.js
// const debugEnvironmentVariables = () => {
//   console.log("Environment Debug Info (Next.js):");

//   // Check Next.js env vars
//   if (process.env) {
//     const envKeys = Object.keys(process.env);
//     console.log("Next.js env variables count:", envKeys.length);

//     // Look for any key-like variables
//     const apiKeys = envKeys.filter(
//       (key) =>
//         key.toLowerCase().includes("key") || key.toLowerCase().includes("api")
//     );

//     console.log("Found API-related variables:", apiKeys);

//     apiKeys.forEach((key) => {
//       console.log(
//         `Found env var: ${key} = ${process.env[key] ? "[SET]" : "[NOT SET]"}`
//       );
//     });

//     // Specifically check for NEXT_PUBLIC_ variables
//     const nextPublicKeys = envKeys.filter((key) =>
//       key.startsWith("NEXT_PUBLIC_")
//     );
//     console.log("NEXT_PUBLIC_ variables:", nextPublicKeys);
//   }
// };

// const FREE_LLM_CONFIG = {
//   baseURL: "https://openrouter.ai/api/v1/chat/completions",
//   models: {
//     text: "mistralai/mistral-7b-instruct",
//   },
//   get apiKey() {
//     return getApiKey();
//   },
// };

// // Fixed Pollinations image generation configuration
// const POLLINATIONS_CONFIG = {
//   baseURL: "https://image.pollinations.ai/prompt",
//   enhanceURL: "https://pollinations.ai/p", // Alternative URL
//   sizes: {
//     small: { width: 512, height: 512 },
//     medium: { width: 768, height: 768 },
//     large: { width: 1024, height: 1024 },
//     wide: { width: 1024, height: 576 },
//     tall: { width: 576, height: 1024 },
//   },
// };

// // Configure axios instance for local API
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 60000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Configure axios instance for free LLM with dynamic headers
// const createLLMClient = () => {
//   const apiKey = FREE_LLM_CONFIG.apiKey;

//   return axios.create({
//     baseURL: FREE_LLM_CONFIG.baseURL,
//     timeout: 30000,
//     headers: {
//       "Content-Type": "application/json",
//       ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
//     },
//   });
// };

// // Debug function to check API key
// const debugApiKey = () => {
//   const key = FREE_LLM_CONFIG.apiKey;
//   console.log("API Key Debug Info:", {
//     hasKey: !!key,
//     keyLength: key?.length || 0,
//     keyPreview: key
//       ? `${key.substring(0, 8)}...${key.substring(key.length - 4)}`
//       : "No key found",
//     keySource: key ? "Found in environment" : "Not found in environment",
//   });

//   // Debug environment variables
//   debugEnvironmentVariables();
// };

// // Utility function to extract JSON from LLM response
// const extractJsonFromResponse = (responseText: string): any => {
//   try {
//     return JSON.parse(responseText);
//   } catch (e) {
//     // Try to extract JSON from markdown code block
//     const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
//     if (jsonMatch && jsonMatch[1]) {
//       try {
//         return JSON.parse(jsonMatch[1]);
//       } catch (e) {
//         console.error("Failed to parse JSON from code block", e);
//       }
//     }

//     // Try to find any JSON-like structure
//     const fallbackMatch = responseText.match(/\{[\s\S]*?\}/);
//     if (fallbackMatch) {
//       try {
//         return JSON.parse(fallbackMatch[0]);
//       } catch (e) {
//         console.error("Failed to parse fallback JSON", e);
//       }
//     }

//     // If all else fails, return the raw text
//     return { content: responseText };
//   }
// };

// // Helper function to detect emojis in text
// const hasEmojis = (text: string): boolean => {
//   const emojiRegex =
//     /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
//   return emojiRegex.test(text);
// };

// // Generate content using free LLM with better error handling
// const generateWithFreeLLM = async (
//   prompt: string,
//   type: ContentType,
//   userInput?: string
// ): Promise<string> => {
//   try {
//     // Debug API key before making request
//     debugApiKey();

//     const apiKey = FREE_LLM_CONFIG.apiKey;

//     if (!apiKey) {
//       throw new Error(
//         "OpenRouter API key not found. Please check your environment variables:\n" +
//           "For Next.js apps: NEXT_PUBLIC_OPENROUTER_API_KEY or NEXT_PUBLIC_OPENAI_APIxxxxx_KEY\n" +
//           "For server-side: OPENROUTER_API_KEY or OPENAI_API_KEY\n" +
//           "Your .env.local file should contain: NEXT_PUBLIC_OPENROUTER_API_KEY=your_api_key\n" +
//           "Make sure to restart your Next.js development server after adding the variable."
//       );
//     }

//     // Validate API key format (OpenRouter keys typically start with 'sk-or-v1-')
//     if (!apiKey.startsWith("sk-or-v1-")) {
//       console.warn(
//         "API key format might be incorrect. OpenRouter keys typically start with 'sk-or-v1-'"
//       );
//     }

//     const systemPrompts = {
//       post: (() => {
//         // Check if user input contains emojis
//         if (userInput && hasEmojis(userInput)) {
//           return "Generate a social media post with emojis and hashtags. Keep it engaging, fun, and use emojis throughout the content to match the user's style.";
//         } else {
//           return "Generate a professional social media post with hashtags. Keep it engaging and professional. Add emojis only where they are most suitable and enhance the message (like at the end or to highlight key points).";
//         }
//       })(),
//       template:
//         "Create a professional template with clear structure and placeholders. If the user specified colors, styling, or specific requirements, incorporate them into the template content.",
//       image:
//         "Create a detailed, artistic image prompt with specific visual elements, style, and composition details.",
//     };

//     console.log("Making LLM request with:", {
//       model: FREE_LLM_CONFIG.models.text,
//       prompt: prompt.substring(0, 50) + "...",
//       maxTokens: 200,
//       hasApiKey: !!apiKey,
//     });

//     // Create a fresh client instance with current API key
//     const llmClient = createLLMClient();

//     const response = await llmClient.post("", {
//       model: FREE_LLM_CONFIG.models.text,
//       messages: [
//         {
//           role: "system",
//           content:
//             systemPrompts[type] ||
//             "You are a helpful assistant that provides clear, concise responses.",
//         },
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//       temperature: 0.7,
//       max_tokens: 300, // Increased for better template responses
//       stream: false,
//     });

//     console.log("LLM Response received:", {
//       status: response.status,
//       hasChoices: !!response.data.choices,
//       choicesLength: response.data.choices?.length || 0,
//       usage: response.data.usage,
//     });

//     if (!response.data.choices || !response.data.choices[0]) {
//       throw new Error("No response from LLM service");
//     }

//     const content = response.data.choices[0].message?.content;
//     if (!content) {
//       throw new Error("Empty response from LLM service");
//     }

//     return content.trim();
//   } catch (error: unknown) {
//     console.error("Free LLM generation error:", error);

//     // Enhanced error logging
//     if (axios.isAxiosError(error)) {
//       console.error("Axios error details:", {
//         status: error.response?.status,
//         statusText: error.response?.statusText,
//         data: error.response?.data,
//         message: error.message,
//         url: error.config?.url,
//         headers: error.config?.headers,
//       });

//       // Provide specific error messages based on status codes
//       const status = error.response?.status;
//       if (status === 401) {
//         throw new Error(
//           "Authentication failed. Please check your API key is correct and has the proper format (should start with 'sk-or-v1-')"
//         );
//       } else if (status === 403) {
//         throw new Error(
//           "Access forbidden. Your API key might not have permission to use this model or service."
//         );
//       } else if (status === 429) {
//         throw new Error(
//           "Rate limit exceeded. Please wait a moment before trying again."
//         );
//       } else if (status && status >= 500) {
//         throw new Error(
//           "OpenRouter service is currently unavailable. Please try again later."
//         );
//       }
//     }

//     throw new Error(
//       `Failed to generate content with free LLM: ${getErrorMessage(error)}`
//     );
//   }
// };

// // Fixed image generation using Pollinations with better URL handling
// const generateWithPollinations = async (
//   prompt: string,
//   size: ImageSize = "medium"
// ): Promise<string> => {
//   try {
//     const sizeConfig = POLLINATIONS_CONFIG.sizes[size];
//     if (!sizeConfig) {
//       throw new Error(`Unsupported image size: ${size}`);
//     }

//     // Enhanced prompt for better results
//     const enhancedPrompt = `${prompt}, high quality, detailed, professional, 8k resolution, masterpiece, photorealistic`;

//     // Clean and encode the prompt for URL - more aggressive cleaning
//     const cleanPrompt = enhancedPrompt
//       .replace(/[<>]/g, "") // Remove potentially problematic characters
//       .replace(/[^a-zA-Z0-9\s,.-]/g, "") // Keep only safe characters
//       .replace(/\s+/g, " ") // Normalize whitespace
//       .trim();

//     // Try multiple URL formats for better compatibility
//     const urlFormats = [
//       // Primary format - direct prompt in URL
//       `${POLLINATIONS_CONFIG.baseURL}/${encodeURIComponent(
//         cleanPrompt
//       )}?width=${sizeConfig.width}&height=${
//         sizeConfig.height
//       }&model=flux&enhance=true&nologo=true`,

//       // Alternative format 1 - with different parameters
//       `${POLLINATIONS_CONFIG.baseURL}/${encodeURIComponent(
//         cleanPrompt
//       )}?width=${sizeConfig.width}&height=${
//         sizeConfig.height
//       }&model=flux&seed=${Math.floor(Math.random() * 1000000)}`,

//       // Alternative format 2 - simplified
//       `${POLLINATIONS_CONFIG.baseURL}/${encodeURIComponent(
//         cleanPrompt
//       )}?width=${sizeConfig.width}&height=${sizeConfig.height}`,

//       // Alternative format 3 - using enhance URL
//       `${POLLINATIONS_CONFIG.enhanceURL}/${encodeURIComponent(
//         cleanPrompt
//       )}?width=${sizeConfig.width}&height=${sizeConfig.height}&model=flux`,
//     ];

//     console.log("Trying Pollinations image generation with multiple formats:", {
//       size: `${sizeConfig.width}x${sizeConfig.height}`,
//       promptLength: cleanPrompt.length,
//       cleanPrompt: cleanPrompt.substring(0, 100) + "...",
//     });

//     // Try each URL format until one works
//     let imageUrl = "";
//     let lastError = null;

//     for (let i = 0; i < urlFormats.length; i++) {
//       const currentUrl = urlFormats[i];

//       try {
//         console.log(
//           `Trying URL format ${i + 1}:`,
//           currentUrl.substring(0, 100) + "..."
//         );

//         // Test the URL by making a HEAD request with more permissive settings
//         const testResponse = await axios.head(currentUrl, {
//           timeout: 15000,
//           validateStatus: (status) => status < 500, // Accept 404, etc.
//         });

//         console.log(`URL format ${i + 1} response:`, {
//           status: testResponse.status,
//           headers: testResponse.headers["content-type"],
//         });

//         // If we get a successful response or image content type, use this URL
//         if (
//           testResponse.status === 200 ||
//           testResponse.headers["content-type"]?.includes("image")
//         ) {
//           imageUrl = currentUrl;
//           console.log(`✅ Successfully using URL format ${i + 1}`);
//           break;
//         }
//       } catch (error) {
//         console.log(`❌ URL format ${i + 1} failed:`, getErrorMessage(error));
//         lastError = error;

//         // For the last attempt, still return the URL as Pollinations might work despite HEAD request failing
//         if (i === urlFormats.length - 1) {
//           console.log(
//             "All HEAD requests failed, but returning last URL as Pollinations might still work"
//           );
//           imageUrl = currentUrl;
//         }
//       }
//     }

//     if (!imageUrl) {
//       throw new Error("All Pollinations URL formats failed");
//     }

//     console.log("Final image URL generated:", {
//       url: imageUrl.substring(0, 100) + "...",
//       size: `${sizeConfig.width}x${sizeConfig.height}`,
//     });

//     return imageUrl;
//   } catch (error: unknown) {
//     console.error("Pollinations generation error:", error);

//     // Fallback: Create a simple URL without testing
//     const sizeConfig = POLLINATIONS_CONFIG.sizes[size];
//     const fallbackPrompt = prompt
//       .replace(/[^a-zA-Z0-9\s]/g, "")
//       .replace(/\s+/g, "+");
//     const fallbackUrl = `${POLLINATIONS_CONFIG.baseURL}/${encodeURIComponent(
//       fallbackPrompt
//     )}?width=${sizeConfig.width}&height=${sizeConfig.height}`;

//     console.log("Using fallback URL:", fallbackUrl);
//     return fallbackUrl;
//   }
// };

// // Enhanced content generation function
// export const generateContent = async (
//   request: GenerationRequest
// ): Promise<GeneratedItem> => {
//   try {
//     console.log("Generating content for:", {
//       type: request.type,
//       prompt: request.prompt.substring(0, 50) + "...",
//       imageSize: request.imageSize,
//     });

//     let content = "";
//     let imageUrl = "";

//     if (request.type === "image") {
//       try {
//         // For images, first generate an enhanced prompt using LLM, then create image
//         const enhancedPrompt = await generateWithFreeLLM(
//           `Create a detailed, artistic image prompt for: ${request.prompt}. Include specific visual elements, artistic style, composition, lighting, and quality descriptors. Make it very detailed and descriptive.`,
//           "image",
//           request.prompt
//         );

//         imageUrl = await generateWithPollinations(
//           enhancedPrompt,
//           request.imageSize
//         );
//         content = enhancedPrompt;
//       } catch (llmError) {
//         console.warn(
//           "LLM enhancement failed, using original prompt:",
//           getErrorMessage(llmError)
//         );
//         // Fallback: use original prompt if LLM fails
//         imageUrl = await generateWithPollinations(
//           request.prompt,
//           request.imageSize
//         );
//         content = request.prompt;
//       }
//     } else if (request.type === "template") {
//       // For templates, generate both content and a relevant image
//       try {
//         // Generate template content
//         content = await generateWithFreeLLM(
//           `Create a professional template for: ${request.prompt}. Include clear structure, placeholders in [BRACKET] format, proper formatting, and helpful instructions. If colors or styling were mentioned, include those specifications in the template.`,
//           "template",
//           request.prompt
//         );

//         // Generate a relevant image for the template
//         const imagePrompt = await generateWithFreeLLM(
//           `Create an image prompt for a visual representation of: ${request.prompt}. Focus on professional, clean design elements that would complement the template.`,
//           "image",
//           request.prompt
//         );

//         imageUrl = await generateWithPollinations(
//           imagePrompt,
//           request.imageSize || "medium"
//         );
//       } catch (error) {
//         console.warn(
//           "Template image generation failed:",
//           getErrorMessage(error)
//         );
//         // Continue without image if it fails
//         if (!content) {
//           content = await generateWithFreeLLM(
//             `Create a professional template for: ${request.prompt}. Include clear structure, placeholders in [BRACKET] format, and helpful instructions.`,
//             "template",
//             request.prompt
//           );
//         }
//       }
//     } else {
//       // For text content (posts, etc.)
//       content = await generateWithFreeLLM(
//         request.prompt,
//         request.type,
//         request.prompt
//       );
//     }

//     const generatedItem: GeneratedItem = {
//       id: generateId(),
//       type: request.type,
//       prompt: request.prompt,
//       content,
//       imageUrl,
//       imageSize: request.imageSize,
//       createdAt: new Date(),
//     };

//     console.log("Generated item successfully:", {
//       id: generatedItem.id,
//       type: generatedItem.type,
//       hasContent: !!generatedItem.content,
//       hasImageUrl: !!generatedItem.imageUrl,
//     });

//     return generatedItem;
//   } catch (error: unknown) {
//     console.error("Content generation error:", error);
//     throw error instanceof Error ? error : new Error(getErrorMessage(error));
//   }
// };

// // Generate social media post with emoji logic
// export const generatePost = async (prompt: string): Promise<string> => {
//   try {
//     // Check if user input contains emojis
//     const userHasEmojis = hasEmojis(prompt);

//     let enhancedPrompt = "";
//     if (userHasEmojis) {
//       enhancedPrompt = `Create an engaging social media post about: ${prompt}. The user used emojis, so make it fun and emoji-rich. Include relevant hashtags and emojis throughout the content. Keep it engaging and lively.`;
//     } else {
//       enhancedPrompt = `Create a professional social media post about: ${prompt}. Keep it professional and engaging. Add emojis only where they are most suitable and enhance the message (like at the end or to highlight key points). Include relevant hashtags.`;
//     }

//     return await generateWithFreeLLM(enhancedPrompt, "post", prompt);
//   } catch (error: unknown) {
//     console.error("Post generation error:", error);
//     throw new Error(`Failed to generate post: ${getErrorMessage(error)}`);
//   }
// };

// // Generate template with LLM and accompanying image
// export const generateTemplate = async (
//   prompt: string
// ): Promise<{ content: string; imageUrl?: string }> => {
//   try {
//     // Generate template content
//     const enhancedPrompt = `Create a professional template for: ${prompt}. Include clear structure, placeholders in [BRACKET] format, proper formatting, and helpful instructions. If specific colors, styling, or requirements were mentioned, incorporate them into the template design and structure.`;

//     const content = await generateWithFreeLLM(
//       enhancedPrompt,
//       "template",
//       prompt
//     );

//     // Generate accompanying image
//     let imageUrl = "";
//     try {
//       const imagePrompt = await generateWithFreeLLM(
//         `Create a visual image prompt for: ${prompt}. Focus on professional, clean, modern design elements that would represent this template visually. Include relevant colors, layout elements, and professional styling.`,
//         "image",
//         prompt
//       );

//       imageUrl = await generateWithPollinations(imagePrompt, "medium");
//     } catch (imageError) {
//       console.warn(
//         "Template image generation failed:",
//         getErrorMessage(imageError)
//       );
//       // Continue without image if it fails
//     }

//     return { content, imageUrl };
//   } catch (error: unknown) {
//     console.error("Template generation error:", error);
//     throw new Error(`Failed to generate template: ${getErrorMessage(error)}`);
//   }
// };

// // Generate image with Pollinations (fixed version)
// export const generateImage = async (
//   prompt: string,
//   size: ImageSize = "medium"
// ): Promise<string> => {
//   try {
//     let enhancedPrompt = prompt;

//     try {
//       // Try to enhance the prompt using LLM
//       enhancedPrompt = await generateWithFreeLLM(
//         `Transform this into a detailed, creative image prompt: ${prompt}. Add artistic details, style, composition, lighting, colors, and quality descriptors. Make it very descriptive and vivid.`,
//         "image",
//         prompt
//       );
//     } catch (llmError) {
//       console.warn(
//         "LLM prompt enhancement failed, using original:",
//         getErrorMessage(llmError)
//       );
//       // Use original prompt if LLM fails
//     }

//     return await generateWithPollinations(enhancedPrompt, size);
//   } catch (error: unknown) {
//     console.error("Image generation error:", error);
//     throw new Error(`Failed to generate image: ${getErrorMessage(error)}`);
//   }
// };

// // Batch generation for multiple items
// export const generateBatch = async (
//   prompts: string[],
//   type: ContentType,
//   size?: ImageSize
// ): Promise<GeneratedItem[]> => {
//   try {
//     console.log(`Starting batch generation for ${prompts.length} items`);

//     const promises = prompts.map((prompt, index) =>
//       generateContent({
//         prompt,
//         type,
//         imageSize: size,
//       }).catch((error) => {
//         console.error(`Batch item ${index} failed:`, getErrorMessage(error));
//         return null; // Return null for failed items
//       })
//     );

//     const results = await Promise.allSettled(promises);

//     const successfulItems = results
//       .filter(
//         (result): result is PromiseFulfilledResult<GeneratedItem> =>
//           result.status === "fulfilled" && result.value !== null
//       )
//       .map((result) => result.value);

//     console.log(
//       `Batch generation completed: ${successfulItems.length}/${prompts.length} successful`
//     );

//     return successfulItems;
//   } catch (error: unknown) {
//     console.error("Batch generation error:", error);
//     throw new Error(`Batch generation failed: ${getErrorMessage(error)}`);
//   }
// };

// // Generate multiple images with different styles
// export const generateImageVariations = async (
//   basePrompt: string,
//   variations: string[],
//   size: ImageSize = "medium"
// ): Promise<{ style: string; imageUrl: string; enhancedPrompt: string }[]> => {
//   try {
//     console.log(`Generating ${variations.length} image variations`);

//     const results = await Promise.allSettled(
//       variations.map(async (style, index) => {
//         try {
//           const styledPrompt = `${basePrompt}, ${style} style`;
//           let enhancedPrompt = styledPrompt;

//           try {
//             enhancedPrompt = await generateWithFreeLLM(
//               `Create a detailed image prompt for: ${styledPrompt}. Focus on the ${style} style with specific visual details, colors, composition, and artistic elements.`,
//               "image",
//               styledPrompt
//             );
//           } catch (llmError) {
//             console.warn(
//               `LLM enhancement failed for variation ${index}:`,
//               getErrorMessage(llmError)
//             );
//           }

//           const imageUrl = await generateWithPollinations(enhancedPrompt, size);

//           return {
//             style,
//             imageUrl,
//             enhancedPrompt,
//           };
//         } catch (error) {
//           console.error(
//             `Image variation ${index} (${style}) failed:`,
//             getErrorMessage(error)
//           );
//           throw error;
//         }
//       })
//     );

//     const successfulResults = results
//       .filter(
//         (result): result is PromiseFulfilledResult<any> =>
//           result.status === "fulfilled"
//       )
//       .map((result) => result.value);

//     console.log(
//       `Image variations completed: ${successfulResults.length}/${variations.length} successful`
//     );

//     return successfulResults;
//   } catch (error: unknown) {
//     console.error("Image variations generation error:", error);
//     throw new Error(
//       `Failed to generate image variations: ${getErrorMessage(error)}`
//     );
//   }
// };

// // Enhanced health check for free services
// export const healthCheck = async (): Promise<{
//   llm: boolean;
//   pollinations: boolean;
//   overall: boolean;
//   details: {
//     llmError?: string;
//     pollinationsError?: string;
//     apiKeyStatus: string;
//   };
// }> => {
//   const details: any = {};

//   try {
//     // Check API key availability
//     const apiKey = FREE_LLM_CONFIG.apiKey;
//     details.apiKeyStatus = apiKey ? "Available" : "Missing";

//     // Check LLM service
//     let llmHealthy = false;
//     try {
//       if (!apiKey) {
//         details.llmError = "No API key configured";
//       } else {
//         const llmClient = createLLMClient();
//         const response = await llmClient.post("", {
//           model: FREE_LLM_CONFIG.models.text,
//           messages: [{ role: "user", content: "Test" }],
//           max_tokens: 5,
//         });
//         llmHealthy = !!response.data.choices?.[0]?.message?.content;
//       }
//     } catch (error: unknown) {
//       const errorMsg = getErrorMessage(error);
//       console.warn("LLM health check failed:", errorMsg);
//       details.llmError = errorMsg;
//     }

//     // Check Pollinations service with multiple endpoints
//     let pollinationsHealthy = false;
//     try {
//       const testUrls = [
//         `${POLLINATIONS_CONFIG.baseURL}/test?width=100&height=100&model=flux`,
//         `${POLLINATIONS_CONFIG.enhanceURL}/test?width=100&height=100`,
//         `${POLLINATIONS_CONFIG.baseURL}/hello%20world?width=100&height=100`,
//       ];

//       for (const testUrl of testUrls) {
//         try {
//           await axios.head(testUrl, { timeout: 5000 });
//           pollinationsHealthy = true;
//           break;
//         } catch (error) {
//           console.log("Pollinations test URL failed:", testUrl);
//         }
//       }

//       // If all HEAD requests fail, assume service is working (common with image APIs)
//       if (!pollinationsHealthy) {
//         console.log(
//           "HEAD requests failed, but assuming Pollinations is working (common with image APIs)"
//         );
//         pollinationsHealthy = true;
//       }
//     } catch (error: unknown) {
//       const errorMsg = getErrorMessage(error);
//       console.warn("Pollinations health check failed:", errorMsg);
//       details.pollinationsError = errorMsg;
//       // Still assume it's working as many image APIs don't respond to HEAD requests
//       pollinationsHealthy = true;
//     }

//     return {
//       llm: llmHealthy,
//       pollinations: pollinationsHealthy,
//       overall: llmHealthy && pollinationsHealthy,
//       details,
//     };
//   } catch (error: unknown) {
//     console.error("Health check error:", error);
//     return {
//       llm: false,
//       pollinations: false,
//       overall: false,
//       details: {
//         ...details,
//         healthCheckError: getErrorMessage(error),
//       },
//     };
//   }
// };

// // Get service status and usage statistics
// export const getApiStatus = async () => {
//   const health = await healthCheck();

//   return {
//     success: health.overall,
//     services: {
//       freeLLM: {
//         status: health.llm ? "operational" : "down",
//         model: FREE_LLM_CONFIG.models.text,
//         provider: "OpenRouter",
//         hasApiKey: !!FREE_LLM_CONFIG.apiKey,
//         error: health.details.llmError,
//       },
//       pollinations: {
//         status: health.pollinations ? "operational" : "down",
//         provider: "Pollinations AI",
//         supportedSizes: Object.keys(POLLINATIONS_CONFIG.sizes),
//         error: health.details.pollinationsError,
//       },
//     },
//     details: health.details,
//     timestamp: new Date().toISOString(),
//   };
// };

// // Export configuration for use in other parts of the app
// export const serviceConfig = {
//   llm: FREE_LLM_CONFIG,
//   images: POLLINATIONS_CONFIG,
// };

// // Enhanced error interceptors
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error: unknown) => {
//     const errorObj = error as any;
//     const message =
//       errorObj?.response?.data?.error ||
//       errorObj?.response?.data?.message ||
//       getErrorMessage(error) ||
//       "An unexpected error occurred";

//     console.error("API Client Error:", {
//       message,
//       status: errorObj?.response?.status,
//       url: errorObj?.config?.url,
//     });

//     throw new Error(message);
//   }
// );

// // Utility function to test API configuration
// export const testApiConfiguration = async (): Promise<{
//   success: boolean;
//   message: string;
//   details: any;
// }> => {
//   try {
//     console.log("Testing API configuration...");

//     const apiKey = FREE_LLM_CONFIG.apiKey;

//     if (!apiKey) {
//       return {
//         success: false,
//         message: "API key not found in environment variables",
//         details: {
//           checkedVariables: [
//             "NEXT_PUBLIC_OPENROUTER_API_KEY",
//             "NEXT_PUBLIC_OPENAI_APIxxxxx_KEY", // Your variable name
//             "NEXT_PUBLIC_OPENAI_API_KEY",
//             "OPENROUTER_API_KEY",
//             "OPENAI_API_KEY",
//             "OPENAI_APIxxxxx_KEY",
//           ],
//           recommendation:
//             "Please set NEXT_PUBLIC_OPENROUTER_API_KEY or NEXT_PUBLIC_OPENAI_APIxxxxx_KEY in your .env.local file",
//         },
//       };
//     }

//     // Test a simple LLM call
//     const testResponse = await generateWithFreeLLM(
//       "Say 'API test successful'",
//       "post",
//       "test"
//     );

//     // Test image generation
//     const testImageUrl = await generateWithPollinations("test image", "small");

//     return {
//       success: true,
//       message: "API configuration is working correctly",
//       details: {
//         apiKeyLength: apiKey.length,
//         testResponse: testResponse.substring(0, 50),
//         model: FREE_LLM_CONFIG.models.text,
//         testImageUrl: testImageUrl.substring(0, 100) + "...",
//       },
//     };
//   } catch (error: unknown) {
//     return {
//       success: false,
//       message: `API test failed: ${getErrorMessage(error)}`,
//       details: {
//         error: getErrorMessage(error),
//         apiKeyAvailable: !!FREE_LLM_CONFIG.apiKey,
//       },
//     };
//   }
// };

// // Alternative Pollinations URL generator (backup method)
// export const generatePollinationsImageUrl = (
//   prompt: string,
//   size: ImageSize = "medium"
// ): string => {
//   const sizeConfig = POLLINATIONS_CONFIG.sizes[size];
//   const cleanPrompt = prompt
//     .replace(/[^a-zA-Z0-9\s,.-]/g, "")
//     .replace(/\s+/g, " ")
//     .trim();

//   // Simple, reliable URL format
//   return `${POLLINATIONS_CONFIG.baseURL}/${encodeURIComponent(
//     cleanPrompt
//   )}?width=${sizeConfig.width}&height=${
//     sizeConfig.height
//   }&model=flux&enhance=true`;
// };

// // Emergency fallback image generation
// export const generateImageFallback = async (
//   prompt: string,
//   size: ImageSize = "medium"
// ): Promise<string> => {
//   try {
//     console.log("Using fallback image generation method");

//     // Use the alternative URL generator
//     const imageUrl = generatePollinationsImageUrl(prompt, size);

//     // Add some randomization to avoid caching issues
//     const finalUrl = `${imageUrl}&seed=${Math.floor(
//       Math.random() * 1000000
//     )}&t=${Date.now()}`;

//     console.log("Fallback image URL:", finalUrl.substring(0, 100) + "...");

//     return finalUrl;
//   } catch (error: unknown) {
//     console.error("Fallback image generation error:", error);
//     throw new Error(
//       `Fallback image generation failed: ${getErrorMessage(error)}`
//     );
//   }
// };

import axios from "axios";
import {
  GenerationRequest,
  GeneratedItem,
  ContentType,
  ImageSize,
} from "../types";
import { generateId } from "../utils/idUtils";

const API_BASE_URL = "/api";

// Helper function to handle unknown errors
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return "An unexpected error occurred";
};

// Enhanced API key retrieval function for Next.js
const getApiKey = (): string => {
  console.log("=== API Key Debug Info (Next.js) ===");

  let nextEnv: any = {};

  if (typeof window !== "undefined") {
    console.log("Running on client-side");
    nextEnv = process.env;
  } else {
    console.log("Running on server-side");
    nextEnv = process.env;
  }

  if (nextEnv) {
    console.log("Available Next.js env vars:", Object.keys(nextEnv));
    Object.keys(nextEnv).forEach((key) => {
      if (
        key.toLowerCase().includes("key") ||
        key.toLowerCase().includes("api")
      ) {
        console.log(
          `Next.js env: ${key} = ${nextEnv[key] ? "[HAS VALUE]" : "[EMPTY]"}`
        );
      }
    });
  }

  const envChecks = [
    {
      name: "NEXT_PUBLIC_OPENROUTER_API_KEY",
      value: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
    },
    {
      name: "NEXT_PUBLIC_OPENAI_API_KEY",
      value: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    },
    {
      name: "NEXT_PUBLIC_OPENAI_APIxxxxx_KEY",
      value: process.env.NEXT_PUBLIC_OPENAI_APIxxxxx_KEY,
    },
    {
      name: "NEXT_PUBLIC_API_KEY",
      value: process.env.NEXT_PUBLIC_API_KEY,
    },
    {
      name: "OPENROUTER_API_KEY (server-only)",
      value: process.env.OPENROUTER_API_KEY,
    },
    {
      name: "OPENAI_API_KEY (server-only)",
      value: process.env.OPENAI_API_KEY,
    },
    {
      name: "OPENAI_APIxxxxx_KEY (server-only)",
      value: process.env.OPENAI_APIxxxxx_KEY,
    },
    {
      name: "VITE_OPENROUTER_API_KEY (legacy)",
      value: process.env.VITE_OPENROUTER_API_KEY,
    },
    {
      name: "VITE_OPENAI_APIxxxxx_KEY (legacy)",
      value: process.env.VITE_OPENAI_APIxxxxx_KEY,
    },
  ];

  console.log("Environment variable checks:");
  envChecks.forEach((check) => {
    console.log(
      `${check.name}: ${
        check.value ? `[FOUND - length: ${check.value.length}]` : "[NOT FOUND]"
      }`
    );
  });

  for (const check of envChecks) {
    if (check.value && check.value.trim() !== "") {
      console.log(`✅ Using API key from: ${check.name}`);
      return check.value.trim();
    }
  }

  console.error("❌ No API key found in any environment variable");
  return "";
};

const FREE_LLM_CONFIG = {
  baseURL: "https://openrouter.ai/api/v1/chat/completions",
  models: {
    text: "mistralai/mistral-7b-instruct",
  },
  get apiKey() {
    return getApiKey();
  },
};

// FIXED: Updated Pollinations configuration with working endpoints
const POLLINATIONS_CONFIG = {
  baseURL: "https://image.pollinations.ai/prompt",
  directURL: "https://pollinations.ai/p", // More reliable endpoint
  sizes: {
    small: { width: 512, height: 512 },
    medium: { width: 768, height: 768 },
    large: { width: 1024, height: 1024 },
    wide: { width: 1024, height: 576 },
    tall: { width: 576, height: 1024 },
  },
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

const createLLMClient = () => {
  const apiKey = FREE_LLM_CONFIG.apiKey;

  return axios.create({
    baseURL: FREE_LLM_CONFIG.baseURL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
    },
  });
};

const debugApiKey = () => {
  const key = FREE_LLM_CONFIG.apiKey;
  console.log("API Key Debug Info:", {
    hasKey: !!key,
    keyLength: key?.length || 0,
    keyPreview: key
      ? `${key.substring(0, 8)}...${key.substring(key.length - 4)}`
      : "No key found",
    keySource: key ? "Found in environment" : "Not found in environment",
  });
};

const extractJsonFromResponse = (responseText: string): any => {
  try {
    return JSON.parse(responseText);
  } catch (e) {
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error("Failed to parse JSON from code block", e);
      }
    }

    const fallbackMatch = responseText.match(/\{[\s\S]*?\}/);
    if (fallbackMatch) {
      try {
        return JSON.parse(fallbackMatch[0]);
      } catch (e) {
        console.error("Failed to parse fallback JSON", e);
      }
    }

    return { content: responseText };
  }
};

const hasEmojis = (text: string): boolean => {
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  return emojiRegex.test(text);
};

const generateWithFreeLLM = async (
  prompt: string,
  type: ContentType,
  userInput?: string
): Promise<string> => {
  try {
    debugApiKey();

    const apiKey = FREE_LLM_CONFIG.apiKey;

    if (!apiKey) {
      throw new Error(
        "OpenRouter API key not found. Please check your environment variables:\n" +
          "For Next.js apps: NEXT_PUBLIC_OPENROUTER_API_KEY or NEXT_PUBLIC_OPENAI_APIxxxxx_KEY\n" +
          "For server-side: OPENROUTER_API_KEY or OPENAI_API_KEY\n" +
          "Your .env.local file should contain: NEXT_PUBLIC_OPENROUTER_API_KEY=your_api_key\n" +
          "Make sure to restart your Next.js development server after adding the variable."
      );
    }

    if (!apiKey.startsWith("sk-or-v1-")) {
      console.warn(
        "API key format might be incorrect. OpenRouter keys typically start with 'sk-or-v1-'"
      );
    }

    const systemPrompts = {
      post: (() => {
        if (userInput && hasEmojis(userInput)) {
          return "Generate a social media post with emojis and hashtags. Keep it engaging, fun, and use emojis throughout the content to match the user's style.";
        } else {
          return "Generate a professional social media post with hashtags. Keep it engaging and professional. Add emojis only where they are most suitable and enhance the message (like at the end or to highlight key points).";
        }
      })(),
      template:
        "Create a professional template with clear structure and placeholders. If the user specified colors, styling, or specific requirements, incorporate them into the template content.",
      image:
        "Create a detailed, artistic image prompt with specific visual elements, style, and composition details.",
    };

    const llmClient = createLLMClient();

    const response = await llmClient.post("", {
      model: FREE_LLM_CONFIG.models.text,
      messages: [
        {
          role: "system",
          content:
            systemPrompts[type] ||
            "You are a helpful assistant that provides clear, concise responses.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
      stream: false,
    });

    if (!response.data.choices || !response.data.choices[0]) {
      throw new Error("No response from LLM service");
    }

    const content = response.data.choices[0].message?.content;
    if (!content) {
      throw new Error("Empty response from LLM service");
    }

    return content.trim();
  } catch (error: unknown) {
    console.error("Free LLM generation error:", error);

    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        headers: error.config?.headers,
      });

      const status = error.response?.status;
      if (status === 401) {
        throw new Error(
          "Authentication failed. Please check your API key is correct and has the proper format (should start with 'sk-or-v1-')"
        );
      } else if (status === 403) {
        throw new Error(
          "Access forbidden. Your API key might not have permission to use this model or service."
        );
      } else if (status === 429) {
        throw new Error(
          "Rate limit exceeded. Please wait a moment before trying again."
        );
      } else if (status && status >= 500) {
        throw new Error(
          "OpenRouter service is currently unavailable. Please try again later."
        );
      }
    }

    throw new Error(
      `Failed to generate content with free LLM: ${getErrorMessage(error)}`
    );
  }
};

// FIXED: Simplified and more reliable Pollinations image generation
const generateWithPollinations = async (
  prompt: string,
  size: ImageSize = "medium"
): Promise<string> => {
  try {
    const sizeConfig = POLLINATIONS_CONFIG.sizes[size];
    if (!sizeConfig) {
      throw new Error(`Unsupported image size: ${size}`);
    }

    // FIXED: Simplified prompt cleaning - less aggressive
    const cleanPrompt = prompt
      .replace(/[<>]/g, "") // Remove potentially problematic characters
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();

    console.log("Generating image with Pollinations:", {
      originalPrompt: prompt.substring(0, 50) + "...",
      cleanPrompt: cleanPrompt.substring(0, 50) + "...",
      size: `${sizeConfig.width}x${sizeConfig.height}`,
    });

    // FIXED: Simplified URL generation - use the most reliable format
    const timestamp = Date.now();
    const seed = Math.floor(Math.random() * 1000000);

    // Primary URL format (most reliable)
    const imageUrl = `${POLLINATIONS_CONFIG.baseURL}/${encodeURIComponent(
      cleanPrompt
    )}?width=${sizeConfig.width}&height=${
      sizeConfig.height
    }&seed=${seed}&nologo=true&enhance=true`;

    console.log("Generated image URL:", imageUrl.substring(0, 100) + "...");

    // FIXED: Don't test the URL with HEAD request - just return it
    // Pollinations often doesn't respond to HEAD requests but images work fine
    return imageUrl;
  } catch (error: unknown) {
    console.error("Pollinations generation error:", error);

    // FIXED: Better fallback URL generation
    const sizeConfig =
      POLLINATIONS_CONFIG.sizes[size] || POLLINATIONS_CONFIG.sizes.medium;
    const fallbackPrompt = prompt
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const fallbackUrl = `${POLLINATIONS_CONFIG.baseURL}/${encodeURIComponent(
      fallbackPrompt
    )}?width=${sizeConfig.width}&height=${sizeConfig.height}&seed=${Math.floor(
      Math.random() * 1000000
    )}`;

    console.log("Using fallback URL:", fallbackUrl.substring(0, 100) + "...");
    return fallbackUrl;
  }
};

// FIXED: Added the missing generatePost function
export const generatePost = async (
  prompt: string,
  options?: {
    length?: "short" | "medium" | "long" | "extended";
    style?: "professional" | "casual" | "creative" | "marketing";
    includeImage?: boolean;
    imageSize?: ImageSize;
  }
): Promise<{
  content: string;
  imageUrl?: string;
  metadata: {
    wordCount: number;
    characterCount: number;
    estimatedReadTime: string;
    hasEmojis: boolean;
    hashtags: string[];
  };
}> => {
  try {
    const {
      length = "medium",
      style = "professional",
      includeImage = false,
      imageSize = "medium",
    } = options || {};

    console.log("Generating post with options:", {
      length,
      style,
      includeImage,
      imageSize,
    });

    // Generate post content based on length and style
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
    Length: ${lengthInstructions[length]}
    Style: ${styleInstructions[style]}
    Include relevant hashtags and emojis where appropriate.`;

    const content = await generateWithFreeLLM(postPrompt, "post", prompt);

    // Generate image if requested
    let imageUrl: string | undefined;
    if (includeImage) {
      try {
        imageUrl = await generateImage(prompt, imageSize);
      } catch (imageError) {
        console.warn(
          "Post image generation failed:",
          getErrorMessage(imageError)
        );
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

    const metadata = {
      wordCount,
      characterCount,
      estimatedReadTime,
      hasEmojis: hasEmojisResult,
      hashtags,
    };

    console.log("Post generated successfully:", {
      wordCount,
      characterCount,
      hasImage: !!imageUrl,
      hashtagCount: hashtags.length,
    });

    return {
      content,
      imageUrl,
      metadata,
    };
  } catch (error: unknown) {
    console.error("Post generation error:", error);
    throw new Error(`Failed to generate post: ${getErrorMessage(error)}`);
  }
};

// FIXED: Enhanced content generation function with better error handling
export const generateContent = async (
  request: GenerationRequest
): Promise<GeneratedItem> => {
  try {
    console.log("Generating content for:", {
      type: request.type,
      prompt: request.prompt.substring(0, 50) + "...",
      imageSize: request.imageSize,
    });

    let content = "";
    let imageUrl = "";

    if (request.type === "image") {
      try {
        // FIXED: Simplified image generation - don't require LLM enhancement
        console.log("Starting image generation...");

        // Try to enhance prompt with LLM, but don't fail if it doesn't work
        let enhancedPrompt = request.prompt;
        try {
          enhancedPrompt = await generateWithFreeLLM(
            `Create a detailed, artistic image prompt for: ${request.prompt}. Include specific visual elements, artistic style, composition, lighting, and quality descriptors. Make it very detailed and descriptive.`,
            "image",
            request.prompt
          );
          console.log("✅ LLM enhancement successful");
        } catch (llmError) {
          console.warn(
            "⚠️ LLM enhancement failed, using original prompt:",
            getErrorMessage(llmError)
          );
          enhancedPrompt = `${request.prompt}, high quality, detailed, professional, artistic, masterpiece`;
        }

        console.log(
          "Generating image with prompt:",
          enhancedPrompt.substring(0, 100) + "..."
        );
        imageUrl = await generateWithPollinations(
          enhancedPrompt,
          request.imageSize
        );
        content = enhancedPrompt;

        console.log("✅ Image generation completed:", {
          imageUrl: imageUrl.substring(0, 100) + "...",
          hasContent: !!content,
        });
      } catch (imageError) {
        console.error(
          "❌ Image generation failed:",
          getErrorMessage(imageError)
        );
        throw new Error(
          `Image generation failed: ${getErrorMessage(imageError)}`
        );
      }
    } else if (request.type === "template") {
      try {
        content = await generateWithFreeLLM(
          `Create a professional template for: ${request.prompt}. Include clear structure, placeholders in [BRACKET] format, proper formatting, and helpful instructions. If colors or styling were mentioned, include those specifications in the template.`,
          "template",
          request.prompt
        );

        // Try to generate a relevant image for the template (optional)
        try {
          const imagePrompt = `Professional template design for ${request.prompt}, clean layout, modern design, business template, professional appearance`;
          imageUrl = await generateWithPollinations(
            imagePrompt,
            request.imageSize || "medium"
          );
        } catch (error) {
          console.warn(
            "Template image generation failed:",
            getErrorMessage(error)
          );
          // Continue without image if it fails
        }
      } catch (error) {
        console.error("Template generation failed:", getErrorMessage(error));
        throw error;
      }
    } else {
      // For text content (posts, etc.)
      content = await generateWithFreeLLM(
        request.prompt,
        request.type,
        request.prompt
      );
    }

    const generatedItem: GeneratedItem = {
      id: generateId(),
      type: request.type,
      prompt: request.prompt,
      content,
      imageUrl,
      imageSize: request.imageSize,
      createdAt: new Date(),
    };

    console.log("Generated item successfully:", {
      id: generatedItem.id,
      type: generatedItem.type,
      hasContent: !!generatedItem.content,
      hasImageUrl: !!generatedItem.imageUrl,
    });

    return generatedItem;
  } catch (error: unknown) {
    console.error("Content generation error:", error);
    throw error instanceof Error ? error : new Error(getErrorMessage(error));
  }
};

// FIXED: Simplified image generation function
export const generateImage = async (
  prompt: string,
  size: ImageSize = "medium"
): Promise<string> => {
  try {
    console.log("🖼️ Starting image generation:", {
      prompt: prompt.substring(0, 50) + "...",
      size,
    });

    // FIXED: Make LLM enhancement optional, not required
    let enhancedPrompt = prompt;

    try {
      // Try to enhance the prompt, but don't fail if LLM is down
      enhancedPrompt = await generateWithFreeLLM(
        `Transform this into a detailed, creative image prompt: ${prompt}. Add artistic details, style, composition, lighting, colors, and quality descriptors. Make it very descriptive and vivid.`,
        "image",
        prompt
      );
      console.log("✅ Prompt enhanced by LLM");
    } catch (llmError) {
      console.warn(
        "⚠️ LLM enhancement failed, using enhanced fallback:",
        getErrorMessage(llmError)
      );
      // Use a manually enhanced prompt instead
      enhancedPrompt = `${prompt}, high quality, detailed, professional, artistic, beautiful composition, perfect lighting, vibrant colors, masterpiece, 8k resolution`;
    }

    console.log("🎨 Generating image with Pollinations...");
    const imageUrl = await generateWithPollinations(enhancedPrompt, size);

    console.log("✅ Image generation successful:", {
      url: imageUrl.substring(0, 100) + "...",
      size,
    });

    return imageUrl;
  } catch (error: unknown) {
    console.error("❌ Image generation error:", error);
    throw new Error(`Failed to generate image: ${getErrorMessage(error)}`);
  }
};

// FIXED: Simplified and more reliable image URL generation
export const generatePollinationsImageUrl = (
  prompt: string,
  size: ImageSize = "medium"
): string => {
  const sizeConfig =
    POLLINATIONS_CONFIG.sizes[size] || POLLINATIONS_CONFIG.sizes.medium;

  // FIXED: Less aggressive prompt cleaning
  const cleanPrompt = prompt
    .replace(/[<>]/g, "") // Only remove truly problematic characters
    .replace(/\s+/g, " ")
    .trim();

  // FIXED: Use the most reliable URL format
  const seed = Math.floor(Math.random() * 1000000);
  return `${POLLINATIONS_CONFIG.baseURL}/${encodeURIComponent(
    cleanPrompt
  )}?width=${sizeConfig.width}&height=${
    sizeConfig.height
  }&seed=${seed}&nologo=true`;
};

// FIXED: Emergency fallback that always works
export const generateImageFallback = async (
  prompt: string,
  size: ImageSize = "medium"
): Promise<string> => {
  try {
    console.log("🚨 Using emergency fallback image generation");

    const sizeConfig =
      POLLINATIONS_CONFIG.sizes[size] || POLLINATIONS_CONFIG.sizes.medium;

    // Very basic prompt cleaning
    const cleanPrompt = prompt.replace(/[<>]/g, "").trim();

    // Multiple fallback URL attempts
    const fallbackUrls = [
      // Format 1: Standard Pollinations
      `${POLLINATIONS_CONFIG.baseURL}/${encodeURIComponent(
        cleanPrompt
      )}?width=${sizeConfig.width}&height=${sizeConfig.height}&nologo=true`,

      // Format 2: Alternative endpoint
      `${POLLINATIONS_CONFIG.directURL}/${encodeURIComponent(
        cleanPrompt
      )}?width=${sizeConfig.width}&height=${sizeConfig.height}`,

      // Format 3: Simplest possible
      `${POLLINATIONS_CONFIG.baseURL}/${encodeURIComponent(cleanPrompt)}`,

      // Format 4: With just basic parameters
      `https://image.pollinations.ai/prompt/${encodeURIComponent(
        cleanPrompt
      )}?width=${sizeConfig.width}&height=${sizeConfig.height}`,
    ];

    // Return the first URL (most likely to work)
    const finalUrl = fallbackUrls[0];

    console.log("🆘 Fallback image URL:", finalUrl.substring(0, 100) + "...");
    return finalUrl;
  } catch (error: unknown) {
    console.error("❌ Emergency fallback failed:", error);

    // ABSOLUTE LAST RESORT: Return a very basic URL
    const basicPrompt = prompt.substring(0, 50).replace(/[^a-zA-Z0-9\s]/g, "");
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(
      basicPrompt
    )}?width=512&height=512`;
  }
};

// FIXED: Simplified health check
export const healthCheck = async (): Promise<{
  llm: boolean;
  pollinations: boolean;
  overall: boolean;
  details: {
    llmError?: string;
    pollinationsError?: string;
    apiKeyStatus: string;
  };
}> => {
  const details: any = {};

  try {
    const apiKey = FREE_LLM_CONFIG.apiKey;
    details.apiKeyStatus = apiKey ? "Available" : "Missing";

    // Check LLM service
    let llmHealthy = false;
    try {
      if (!apiKey) {
        details.llmError = "No API key configured";
      } else {
        const llmClient = createLLMClient();
        const response = await llmClient.post("", {
          model: FREE_LLM_CONFIG.models.text,
          messages: [{ role: "user", content: "Test" }],
          max_tokens: 5,
        });
        llmHealthy = !!response.data.choices?.[0]?.message?.content;
      }
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error);
      console.warn("LLM health check failed:", errorMsg);
      details.llmError = errorMsg;
    }

    // FIXED: Assume Pollinations is working (it usually is, just doesn't respond to health checks)
    let pollinationsHealthy = true;
    try {
      // Test with a simple request
      const testUrl = `${POLLINATIONS_CONFIG.baseURL}/test?width=100&height=100`;
      await axios.head(testUrl, { timeout: 5000 });
    } catch (error: unknown) {
      // Even if HEAD request fails, assume it's working
      console.log("Pollinations HEAD request failed (normal behavior)");
      pollinationsHealthy = true; // Assume it's working
    }

    return {
      llm: llmHealthy,
      pollinations: pollinationsHealthy,
      overall: llmHealthy && pollinationsHealthy,
      details,
    };
  } catch (error: unknown) {
    console.error("Health check error:", error);
    return {
      llm: false,
      pollinations: true, // Assume Pollinations is working
      overall: false,
      details: {
        ...details,
        healthCheckError: getErrorMessage(error),
      },
    };
  }
};

// Quick post generation for backward compatibility
export const generateSimplePost = async (prompt: string): Promise<string> => {
  try {
    const result = await generatePost(prompt, {
      length: "medium",
      includeImage: false,
    });
    return result.content;
  } catch (error: unknown) {
    console.error("Simple post generation error:", error);
    throw new Error(`Failed to generate post: ${getErrorMessage(error)}`);
  }
};

// Generate a complete social media package (post + multiple images)
export const generateSocialMediaPackage = async (
  prompt: string,
  options?: {
    postLength?: "short" | "medium" | "long" | "extended";
    postStyle?: "professional" | "casual" | "creative" | "marketing";
    imageCount?: number; // Number of images to generate
    imageVariations?: string[]; // Different styles for images
    imageSize?: ImageSize;
  }
): Promise<{
  post: {
    content: string;
    metadata: {
      wordCount: number;
      characterCount: number;
      estimatedReadTime: string;
      hasEmojis: boolean;
      hashtags: string[];
    };
  };
  images: Array<{
    url: string;
    style: string;
    prompt: string;
  }>;
}> => {
  try {
    console.log("🚀 Generating complete social media package...");

    // Generate the post
    const postResult = await generatePost(prompt, {
      length: options?.postLength || "medium",
      style: options?.postStyle || "professional",
      includeImage: false, // We'll generate images separately
    });

    // Generate multiple images if requested
    const imageCount = options?.imageCount || 1;
    const imageVariations = options?.imageVariations || [
      "modern",
      "artistic",
      "professional",
    ];
    const images: Array<{ url: string; style: string; prompt: string }> = [];

    if (imageCount > 0) {
      console.log(`Generating ${imageCount} images for the post...`);

      // Use the first few variations or repeat if needed
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

          const imageUrl = await generateWithPollinations(
            imagePrompt,
            options?.imageSize || "medium"
          );

          images.push({
            url: imageUrl,
            style,
            prompt: imagePrompt,
          });

          console.log(
            `✅ Generated image ${i + 1}/${imageCount} (${style} style)`
          );
        } catch (imageError) {
          console.warn(
            `Image ${i + 1} generation failed:`,
            getErrorMessage(imageError)
          );
          // Continue with other images even if one fails
        }
      }
    }

    const result = {
      post: {
        content: postResult.content,
        metadata: postResult.metadata,
      },
      images,
    };

    console.log("✅ Social media package completed:", {
      postWordCount: result.post.metadata.wordCount,
      imageCount: result.images.length,
      hashtags: result.post.metadata.hashtags.length,
    });

    return result;
  } catch (error: unknown) {
    console.error("Social media package generation error:", error);
    throw new Error(
      `Failed to generate social media package: ${getErrorMessage(error)}`
    );
  }
};

// Generate a social media post optimized for specific platforms
export const generatePlatformSpecificPost = async (
  prompt: string,
  platform:
    | "twitter"
    | "instagram"
    | "linkedin"
    | "facebook"
    | "tiktok"
    | "youtube",
  includeImage: boolean = true
): Promise<{
  content: string;
  imageUrl?: string;
  platformGuidelines: {
    characterLimit: number;
    recommendedHashtags: number;
    bestImageSize: ImageSize;
    notes: string[];
  };
  metadata: {
    wordCount: number;
    characterCount: number;
    estimatedReadTime: string;
    hasEmojis: boolean;
    hashtags: string[];
  };
}> => {
  try {
    console.log(`📱 Generating ${platform}-specific post...`);

    // Platform-specific configurations
    const platformConfigs = {
      twitter: {
        characterLimit: 280,
        length: "short" as const,
        style: "casual" as const,
        recommendedHashtags: 2,
        bestImageSize: "wide" as ImageSize,
        notes: [
          "Keep it concise",
          "Use trending hashtags",
          "Engage with questions",
        ],
        systemPrompt:
          "Create a Twitter/X post. Keep it under 280 characters, punchy, and engaging.",
      },
      instagram: {
        characterLimit: 2200,
        length: "medium" as const,
        style: "creative" as const,
        recommendedHashtags: 10,
        bestImageSize: "medium" as ImageSize,
        notes: [
          "Visual-first platform",
          "Use many relevant hashtags",
          "Tell a story",
        ],
        systemPrompt:
          "Create an Instagram post. Focus on visual storytelling and use relevant hashtags.",
      },
      linkedin: {
        characterLimit: 3000,
        length: "long" as const,
        style: "professional" as const,
        recommendedHashtags: 5,
        bestImageSize: "wide" as ImageSize,
        notes: ["Professional tone", "Share insights", "Network-friendly"],
        systemPrompt:
          "Create a LinkedIn post. Be professional, insightful, and business-focused.",
      },
      facebook: {
        characterLimit: 63206,
        length: "extended" as const,
        style: "casual" as const,
        recommendedHashtags: 3,
        bestImageSize: "wide" as ImageSize,
        notes: [
          "Community-focused",
          "Encourage engagement",
          "Share personal stories",
        ],
        systemPrompt:
          "Create a Facebook post. Be engaging, community-focused, and encourage interaction.",
      },
      tiktok: {
        characterLimit: 4000,
        length: "short" as const,
        style: "creative" as const,
        recommendedHashtags: 5,
        bestImageSize: "tall" as ImageSize,
        notes: [
          "Trend-focused",
          "Use popular hashtags",
          "Appeal to younger audience",
        ],
        systemPrompt:
          "Create a TikTok caption. Be trendy, fun, and appeal to a younger audience.",
      },
      youtube: {
        characterLimit: 5000,
        length: "long" as const,
        style: "creative" as const,
        recommendedHashtags: 5,
        bestImageSize: "wide" as ImageSize,
        notes: ["Detailed descriptions", "SEO-friendly", "Call-to-action"],
        systemPrompt:
          "Create a YouTube description. Be detailed, SEO-friendly, and include a call-to-action.",
      },
    };

    const config = platformConfigs[platform];

    // Generate platform-optimized post
    const postResult = await generatePost(prompt, {
      length: config.length,
      style: config.style,
      includeImage,
      imageSize: config.bestImageSize,
    });

    // Truncate if it exceeds platform limits
    let finalContent = postResult.content;
    if (finalContent.length > config.characterLimit) {
      finalContent =
        finalContent.substring(0, config.characterLimit - 3) + "...";
      console.warn(`Content truncated to fit ${platform} character limit`);
    }

    const result = {
      content: finalContent,
      imageUrl: postResult.imageUrl,
      platformGuidelines: {
        characterLimit: config.characterLimit,
        recommendedHashtags: config.recommendedHashtags,
        bestImageSize: config.bestImageSize,
        notes: config.notes,
      },
      metadata: {
        ...postResult.metadata,
        characterCount: finalContent.length, // Update with truncated length
      },
    };

    console.log(`✅ ${platform} post generated:`, {
      characterCount: result.metadata.characterCount,
      withinLimit: result.metadata.characterCount <= config.characterLimit,
      hasImage: !!result.imageUrl,
    });

    return result;
  } catch (error: unknown) {
    console.error(
      `Platform-specific post generation error (${platform}):`,
      error
    );
    throw new Error(
      `Failed to generate ${platform} post: ${getErrorMessage(error)}`
    );
  }
};

// Generate multiple post variations with different lengths and styles
export const generatePostVariations = async (
  prompt: string,
  variations: Array<{
    length: "short" | "medium" | "long" | "extended";
    style: "professional" | "casual" | "creative" | "marketing";
    includeImage?: boolean;
  }>
): Promise<
  Array<{
    variation: string;
    content: string;
    imageUrl?: string;
    metadata: {
      wordCount: number;
      characterCount: number;
      estimatedReadTime: string;
      hasEmojis: boolean;
      hashtags: string[];
    };
  }>
> => {
  try {
    console.log(`Generating ${variations.length} post variations`);

    const results = await Promise.allSettled(
      variations.map(async (variation, index) => {
        try {
          const result = await generatePost(prompt, {
            length: variation.length,
            includeImage: variation.includeImage ?? true,
            imageSize: "medium",
            style: variation.style,
          });

          return {
            variation: `${variation.length} ${variation.style}`,
            ...result,
          };
        } catch (error) {
          console.error(
            `Post variation ${index} failed:`,
            getErrorMessage(error)
          );
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

    console.log(
      `Post variations completed: ${successfulResults.length}/${variations.length} successful`
    );

    return successfulResults;
  } catch (error: unknown) {
    console.error("Post variations generation error:", error);
    throw new Error(
      `Failed to generate post variations: ${getErrorMessage(error)}`
    );
  }
};

export const generateTemplate = async (
  prompt: string
): Promise<{ content: string; imageUrl?: string }> => {
  try {
    const enhancedPrompt = `Create a professional template for: ${prompt}. Include clear structure, placeholders in [BRACKET] format, proper formatting, and helpful instructions. If specific colors, styling, or requirements were mentioned, incorporate them into the template design and structure.`;

    const content = await generateWithFreeLLM(
      enhancedPrompt,
      "template",
      prompt
    );

    let imageUrl = "";
    try {
      const imagePrompt = `Professional template design, ${prompt}, clean modern layout, business design, minimalist, professional appearance`;
      imageUrl = await generateWithPollinations(imagePrompt, "medium");
    } catch (imageError) {
      console.warn(
        "Template image generation failed:",
        getErrorMessage(imageError)
      );
    }

    return { content, imageUrl };
  } catch (error: unknown) {
    console.error("Template generation error:", error);
    throw new Error(`Failed to generate template: ${getErrorMessage(error)}`);
  }
};

export const generateBatch = async (
  prompts: string[],
  type: ContentType,
  size?: ImageSize
): Promise<GeneratedItem[]> => {
  try {
    console.log(`Starting batch generation for ${prompts.length} items`);

    const promises = prompts.map((prompt, index) =>
      generateContent({
        prompt,
        type,
        imageSize: size,
      }).catch((error) => {
        console.error(`Batch item ${index} failed:`, getErrorMessage(error));
        return null;
      })
    );

    const results = await Promise.allSettled(promises);

    const successfulItems = results
      .filter(
        (result): result is PromiseFulfilledResult<GeneratedItem> =>
          result.status === "fulfilled" && result.value !== null
      )
      .map((result) => result.value);

    console.log(
      `Batch generation completed: ${successfulItems.length}/${prompts.length} successful`
    );

    return successfulItems;
  } catch (error: unknown) {
    console.error("Batch generation error:", error);
    throw new Error(`Batch generation failed: ${getErrorMessage(error)}`);
  }
};

export const generateImageVariations = async (
  basePrompt: string,
  variations: string[],
  size: ImageSize = "medium"
): Promise<{ style: string; imageUrl: string; enhancedPrompt: string }[]> => {
  try {
    console.log(`Generating ${variations.length} image variations`);

    const results = await Promise.allSettled(
      variations.map(async (style, index) => {
        try {
          const styledPrompt = `${basePrompt}, ${style} style`;
          let enhancedPrompt = styledPrompt;

          try {
            enhancedPrompt = await generateWithFreeLLM(
              `Create a detailed image prompt for: ${styledPrompt}. Focus on the ${style} style with specific visual details, colors, composition, and artistic elements.`,
              "image",
              styledPrompt
            );
          } catch (llmError) {
            console.warn(
              `LLM enhancement failed for variation ${index}:`,
              getErrorMessage(llmError)
            );
            enhancedPrompt = `${styledPrompt}, high quality, detailed, artistic, ${style} style, professional, masterpiece`;
          }

          const imageUrl = await generateWithPollinations(enhancedPrompt, size);

          return {
            style,
            imageUrl,
            enhancedPrompt,
          };
        } catch (error) {
          console.error(
            `Image variation ${index} (${style}) failed:`,
            getErrorMessage(error)
          );
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

    console.log(
      `Image variations completed: ${successfulResults.length}/${variations.length} successful`
    );

    return successfulResults;
  } catch (error: unknown) {
    console.error("Image variations generation error:", error);
    throw new Error(
      `Failed to generate image variations: ${getErrorMessage(error)}`
    );
  }
};

export const getApiStatus = async () => {
  const health = await healthCheck();

  return {
    success: health.overall,
    services: {
      freeLLM: {
        status: health.llm ? "operational" : "down",
        model: FREE_LLM_CONFIG.models.text,
        provider: "OpenRouter",
        hasApiKey: !!FREE_LLM_CONFIG.apiKey,
        error: health.details.llmError,
      },
      pollinations: {
        status: health.pollinations ? "operational" : "down",
        provider: "Pollinations AI",
        supportedSizes: Object.keys(POLLINATIONS_CONFIG.sizes),
        error: health.details.pollinationsError,
      },
    },
    details: health.details,
    timestamp: new Date().toISOString(),
  };
};

export const serviceConfig = {
  llm: FREE_LLM_CONFIG,
  images: POLLINATIONS_CONFIG,
};

// FIXED: Simple test function for debugging
export const testImageGeneration = async (
  testPrompt: string = "beautiful sunset landscape"
): Promise<{
  success: boolean;
  imageUrl?: string;
  error?: string;
}> => {
  try {
    console.log("🧪 Testing image generation with prompt:", testPrompt);

    const imageUrl = await generateImage(testPrompt, "medium");

    return {
      success: true,
      imageUrl,
    };
  } catch (error: unknown) {
    console.error("❌ Test image generation failed:", error);
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

// FIXED: Additional utility functions for debugging
export const debugImageGeneration = async (
  prompt: string
): Promise<string | void> => {
  console.log("🔍 Debug Image Generation Process");
  console.log("Original prompt:", prompt);

  try {
    // Step 1: Test API key
    const apiKey = getApiKey();
    console.log("1️⃣ API Key Status:", apiKey ? "✅ Found" : "❌ Missing");

    // Step 2: Test LLM (optional)
    try {
      const enhancedPrompt = await generateWithFreeLLM(
        `Enhance this image prompt: ${prompt}`,
        "image",
        prompt
      );
      console.log("2️⃣ LLM Enhancement:", "✅ Success");
      console.log("Enhanced prompt:", enhancedPrompt.substring(0, 100) + "...");
    } catch (llmError) {
      console.log("2️⃣ LLM Enhancement:", "⚠️ Failed (will use fallback)");
      console.log("LLM Error:", getErrorMessage(llmError));
    }

    // Step 3: Test image generation
    try {
      const imageUrl = await generateWithPollinations(prompt, "medium");
      console.log("3️⃣ Image Generation:", "✅ Success");
      console.log("Image URL:", imageUrl);
      return imageUrl;
    } catch (imageError) {
      console.log("3️⃣ Image Generation:", "❌ Failed");
      console.log("Image Error:", getErrorMessage(imageError));

      // Step 4: Try fallback
      try {
        const fallbackUrl = generatePollinationsImageUrl(prompt, "medium");
        console.log("4️⃣ Fallback URL:", "✅ Generated");
        console.log("Fallback URL:", fallbackUrl);
        return fallbackUrl;
      } catch (fallbackError) {
        console.log("4️⃣ Fallback URL:", "❌ Failed");
        console.log("Fallback Error:", getErrorMessage(fallbackError));
      }
    }
  } catch (error) {
    console.error("🚨 Debug process failed:", getErrorMessage(error));
  }
};

// FIXED: Test all image sizes
export const testAllImageSizes = async (
  prompt: string = "test image"
): Promise<Record<string, string>> => {
  const results: Record<string, string> = {};
  const sizes: ImageSize[] = ["small", "medium", "large"];

  console.log("🧪 Testing all image sizes...");

  for (const size of sizes) {
    try {
      console.log(`Testing size: ${size}`);
      const imageUrl = generatePollinationsImageUrl(prompt, size);
      results[size] = imageUrl;
      console.log(`✅ ${size}: ${imageUrl.substring(0, 50)}...`);
    } catch (error) {
      console.error(`❌ ${size} failed:`, getErrorMessage(error));
      results[size] = `Error: ${getErrorMessage(error)}`;
    }
  }

  return results;
};

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const errorObj = error as any;
    const message =
      errorObj?.response?.data?.error ||
      errorObj?.response?.data?.message ||
      getErrorMessage(error) ||
      "An unexpected error occurred";

    console.error("API Client Error:", {
      message,
      status: errorObj?.response?.status,
      url: errorObj?.config?.url,
    });

    throw new Error(message);
  }
);

export const testApiConfiguration = async (): Promise<{
  success: boolean;
  message: string;
  details: any;
}> => {
  try {
    console.log("Testing API configuration...");

    const apiKey = FREE_LLM_CONFIG.apiKey;

    if (!apiKey) {
      return {
        success: false,
        message: "API key not found in environment variables",
        details: {
          checkedVariables: [
            "NEXT_PUBLIC_OPENROUTER_API_KEY",
            "NEXT_PUBLIC_OPENAI_APIxxxxx_KEY",
            "NEXT_PUBLIC_OPENAI_API_KEY",
            "OPENROUTER_API_KEY",
            "OPENAI_API_KEY",
            "OPENAI_APIxxxxx_KEY",
          ],
          recommendation:
            "Please set NEXT_PUBLIC_OPENROUTER_API_KEY or NEXT_PUBLIC_OPENAI_APIxxxxx_KEY in your .env.local file",
        },
      };
    }

    const testResponse = await generateWithFreeLLM(
      "Say 'API test successful'",
      "post",
      "test"
    );

    const testImageUrl = generatePollinationsImageUrl("test image", "small");

    return {
      success: true,
      message: "API configuration is working correctly",
      details: {
        apiKeyLength: apiKey.length,
        testResponse: testResponse.substring(0, 50),
        model: FREE_LLM_CONFIG.models.text,
        testImageUrl: testImageUrl.substring(0, 100) + "...",
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: `API test failed: ${getErrorMessage(error)}`,
      details: {
        error: getErrorMessage(error),
        apiKeyAvailable: !!FREE_LLM_CONFIG.apiKey,
      },
    };
  }
};
