import { Type } from '@google/genai';
import { generateContentWithRetry, GEMINI_MODEL } from '../geminiClient.ts';
import { LessonData, GameConfig, GameConfigSchema } from '../../src/types/game.ts';

export async function designGameNode(
  lessonData: LessonData,
  feedback?: string[]
): Promise<GameConfig> {
  const systemInstruction = `Bạn là một Nhà Thiết Kế Sư Phạm và Trò Chơi Giáo Dục (Pedagogical Designer Agent).
Nhiệm vụ của bạn là chuyển đổi cấu trúc bài học (Lesson JSON) thành kịch bản trò chơi tương tác (Game Config JSON) cho thể loại Quiz Runner 2D.
Quy tắc bắt buộc:
1. game_type: Bắt buộc là "quiz_runner".
2. Tạo từ 5 đến 8 câu hỏi trắc nghiệm chất lượng cao, bám sát các khái niệm trọng tâm trong bài học.
3. Mỗi câu hỏi BẮT BUỘC có CHÍNH XÁC 4 lựa chọn đáp án (options: mảng 4 phần tử).
4. correct_answer_index BẮT BUỘC là số nguyên từ 0 đến 3, tương ứng với vị trí của đáp án đúng trong mảng options.
5. Mỗi câu hỏi phải liên kết trực tiếp với một concept_id từ danh sách key_concepts của bài học.
6. source_excerpt phải trích lại câu căn cứ từ bài học chứng minh cho đáp án đúng.
7. explanation phải đưa ra lời giải thích sư phạm súc tích, khuyến khích học sinh khi vượt qua chướng ngại vật trong game runner.
8. game_title: Tên trò chơi hấp dẫn, có yếu tố phiêu lưu (ví dụ: "Thử Thách Lục Lạp: Cuộc Đua Quang Hợp").`;

  let prompt = `Thông tin bài học đã được phân tích:
${JSON.stringify(lessonData, null, 2)}
`;

  if (feedback && feedback.length > 0) {
    prompt += `\nLƯU Ý: Lần sinh trước bị lỗi kiểm định bởi Evaluator với các lỗi sau, bạn PHẢI sửa triệt để:\n- ${feedback.join('\n- ')}\n`;
  }

  prompt += `\nHãy tạo cấu hình Game Config JSON hoàn chỉnh theo đúng schema.`;

  const response = await generateContentWithRetry({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          game_id: { type: Type.STRING },
          game_title: { type: Type.STRING },
          game_type: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ['easy', 'medium', 'hard'] },
          estimated_duration: { type: Type.STRING },
          learning_objectives: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question_id: { type: Type.STRING },
                question_text: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                correct_answer_index: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
                related_concept_id: { type: Type.STRING },
                source_excerpt: { type: Type.STRING },
              },
              required: [
                'question_id',
                'question_text',
                'options',
                'correct_answer_index',
                'explanation',
                'related_concept_id',
                'source_excerpt',
              ],
            },
          },
        },
        required: [
          'game_id',
          'game_title',
          'game_type',
          'difficulty',
          'estimated_duration',
          'learning_objectives',
          'questions',
        ],
      },
    },
  });

  const rawJson = response.text?.trim() || '{}';
  const parsed = JSON.parse(rawJson);

  // Force game_type to quiz_runner
  parsed.game_type = 'quiz_runner';
  if (!parsed.game_id) {
    parsed.game_id = `game_${Date.now()}`;
  }

  // Validate with Zod
  const validated = GameConfigSchema.parse(parsed);
  return validated;
}
