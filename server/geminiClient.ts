import { GoogleGenAI, GenerateContentParameters, GenerateContentResponse } from '@google/genai';

export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
export const FALLBACK_MODEL = 'gemini-2.5-flash';

let clientInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }

  if (!clientInstance) {
    clientInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  return clientInstance;
}

export function isGeminiConfigured(): boolean {
  return getGeminiClient() !== null;
}

export async function generateContentWithRetry(
  params: GenerateContentParameters,
  maxRetries: number = 2
): Promise<GenerateContentResponse> {
  const ai = getGeminiClient();
  if (!ai) {
    throw new Error('GEMINI_API_KEY chưa được cấu hình. Vui lòng chuyển sang chế độ Demo hoặc cấu hình API key.');
  }

  let lastError: any = null;
  const requestedModel = params.model || GEMINI_MODEL;
  // Always ensure gemini-2.5-flash is in the fallback chain for blazing speed and high availability
  const modelsToTry = Array.from(new Set([requestedModel, 'gemini-2.5-flash']));

  for (const currentModel of modelsToTry) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          ...params,
          model: currentModel,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || '';
        const isTransient =
          errMsg.includes('503') ||
          errMsg.includes('429') ||
          errMsg.includes('high demand') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('RESOURCE_EXHAUSTED');

        console.warn(
          `[Gemini API] Lần thử ${attempt}/${maxRetries} với model "${currentModel}" gặp lỗi: ${errMsg.slice(0, 120)}`
        );

        // If the model is experiencing high demand (503) or not found (404), and we have a fallback, switch immediately!
        const nextModelIdx = modelsToTry.indexOf(currentModel) + 1;
        if ((errMsg.includes('high demand') || errMsg.includes('503') || errMsg.includes('404')) && nextModelIdx < modelsToTry.length) {
          console.log(`[Gemini API] Model "${currentModel}" đang quá tải hoặc không khả dụng. Chuyển ngay sang "${modelsToTry[nextModelIdx]}"...`);
          break;
        }

        if (isTransient && attempt < maxRetries) {
          const waitTime = attempt * 1000;
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        } else {
          break;
        }
      }
    }
  }

  const rawMsg = lastError?.message || '';
  if (rawMsg.includes('503') || rawMsg.includes('high demand') || rawMsg.includes('UNAVAILABLE')) {
    throw new Error(
      'Mô hình AI hiện đang nhận lượng truy cập cao đột biến từ máy chủ Google (503 UNAVAILABLE). Vui lòng thử lại sau giây lát hoặc sử dụng chế độ Bản Mẫu Sinh Học để tiếp tục trải nghiệm!'
    );
  }

  if (rawMsg.includes('429') || rawMsg.includes('RESOURCE_EXHAUSTED')) {
    throw new Error(
      'Hạn ngạch API tạm thời vượt ngưỡng (429 RESOURCE_EXHAUSTED). Vui lòng thử lại sau giây lát hoặc sử dụng chế độ Bản Mẫu Sinh Học.'
    );
  }

  throw new Error(`Lỗi khi gọi Gemini AI: ${lastError?.message || 'Lỗi không xác định'}`);
}
