export type ContentType = "post" | "template" | "image";

export type ImageSize = "small" | "medium" | "large";

export interface GeneratedItem {
  id: string;
  type: ContentType;
  prompt: string;
  content: string;
  imageUrl?: string;
  imageSize?: ImageSize;
  createdAt: Date;
}

export interface GenerationRequest {
  prompt: string;
  type: ContentType;
  imageSize?: ImageSize;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface OpenAIImageResponse {
  data: Array<{
    url: string;
  }>;
}

export interface OpenAITextResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface LocalStorageData {
  items: GeneratedItem[];
  lastUpdated: string;
}
