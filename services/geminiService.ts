import { GoogleGenAI, Modality } from "@google/genai";
import { ImageData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY 环境变量未设置。");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function editImageWithGemini(
  images: ImageData[],
  prompt: string
): Promise<ImageData | null> {
  try {
    const imageParts = images.map(image => ({
      inlineData: {
        data: image.base64,
        mimeType: image.mimeType,
      },
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          ...imageParts,
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return {
            base64: part.inlineData.data,
            mimeType: part.inlineData.mimeType,
          };
        }
      }
    }
    return null;
  } catch (error) {
    console.error("调用 Gemini API 时出错:", error);
    let errorMessage = "与 AI 服务通信失败，请检查网络连接。";
    if (error instanceof Error) {
        // Provide more specific feedback for API key errors.
        if (error.message.toLowerCase().includes('api key')) {
             errorMessage = "AI 服务认证失败：API 密钥无效或未正确配置。请检查环境设置。";
        } else {
             errorMessage = `与 AI 服务通信时发生错误: ${error.message}`;
        }
    }
    throw new Error(errorMessage);
  }
}
