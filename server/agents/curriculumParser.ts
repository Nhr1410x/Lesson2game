import { Type } from '@google/genai';
import { generateContentWithRetry, GEMINI_MODEL } from '../geminiClient.ts';
import { LessonData, LessonDataSchema } from '../../src/types/game.ts';

export async function parseCurriculumNode(documentText: string): Promise<LessonData> {
  const systemInstruction = `Bạn là một Chuyên gia Thẩm định và Phân tích Chương trình Giáo dục (Curriculum Parser Agent).
Nhiệm vụ của bạn là tiếp nhận tài liệu giáo án/bài học, phân tích chuyên sâu cấu trúc tri thức và trích xuất thông tin có cấu trúc.
Các yêu cầu cụ thể:
1. Xác định tên bài học chính xác (lesson_title).
2. Xác định môn học (subject) và khối lớp (grade_level) nếu có.
3. Viết bản tóm tắt súc tích, mạch lạc về bài học (summary, 2-4 câu).
4. Liệt kê từ 3-6 mục tiêu học tập cụ thể theo thang nhận thức (learning_objectives).
5. Trích xuất từ 4-8 khái niệm/kiến thức trọng tâm (key_concepts). Mỗi khái niệm gồm:
   - concept_id: mã định danh duy nhất (ví dụ: "c1_ten_khai_niem")
   - concept_name: tên khái niệm ngắn gọn
   - explanation: giải thích khoa học dễ hiểu
   - source_excerpt: câu trích dẫn nguyên văn từ tài liệu nguồn chứng minh cho khái niệm.
Chỉ trích xuất dựa trên thông tin thực sự có trong văn bản, không bịa đặt nội dung.`;

  const prompt = `Dưới đây là nội dung tài liệu bài học cần trích xuất:

---
${documentText}
---

Hãy phân tích và xuất dữ liệu JSON theo schema quy định.`;

  const response = await generateContentWithRetry({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          lesson_title: { type: Type.STRING },
          subject: { type: Type.STRING },
          grade_level: { type: Type.STRING },
          summary: { type: Type.STRING },
          learning_objectives: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          key_concepts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                concept_id: { type: Type.STRING },
                concept_name: { type: Type.STRING },
                explanation: { type: Type.STRING },
                source_excerpt: { type: Type.STRING },
              },
              required: ['concept_id', 'concept_name', 'explanation', 'source_excerpt'],
            },
          },
        },
        required: [
          'lesson_title',
          'subject',
          'grade_level',
          'summary',
          'learning_objectives',
          'key_concepts',
        ],
      },
    },
  });

  const rawJson = response.text?.trim() || '{}';
  const parsed = JSON.parse(rawJson);

  // Validate strictly with Zod
  const validated = LessonDataSchema.parse(parsed);
  return validated;
}
