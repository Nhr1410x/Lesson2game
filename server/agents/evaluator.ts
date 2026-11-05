import { LessonData, GameConfig, EvaluationReport, GameConfigSchema } from '../../src/types/game.ts';

export function evaluateGameNode(
  lessonData: LessonData,
  gameConfig: GameConfig,
  retryCount: number = 0
): EvaluationReport {
  const errors: string[] = [];

  // 1. Schema Validation
  let schemaValid = true;
  try {
    GameConfigSchema.parse(gameConfig);
  } catch (err: any) {
    schemaValid = false;
    errors.push(`Lỗi cấu trúc dữ liệu Game Config: ${err.message || 'Không khớp schema quy định'}`);
  }

  // 2. Question Count Validation (Must have at least 5 questions)
  const questionCount = gameConfig.questions?.length || 0;
  const questionCountValid = questionCount >= 5;
  if (!questionCountValid) {
    errors.push(`Số lượng câu hỏi không đạt yêu cầu tối thiểu (hiện có: ${questionCount}, yêu cầu: >= 5).`);
  }

  // 3. Answer Index & Options Count Validation
  let answerIndexValid = true;
  gameConfig.questions?.forEach((q, idx) => {
    if (!q.options || q.options.length !== 4) {
      answerIndexValid = false;
      errors.push(`Câu hỏi số ${idx + 1} (${q.question_id}) phải có chính xác 4 lựa chọn, hiện có ${q.options?.length || 0}.`);
    }

    if (
      typeof q.correct_answer_index !== 'number' ||
      !Number.isInteger(q.correct_answer_index) ||
      q.correct_answer_index < 0 ||
      q.correct_answer_index > 3
    ) {
      answerIndexValid = false;
      errors.push(`Câu hỏi số ${idx + 1} (${q.question_id}) có chỉ số đáp án đúng '${q.correct_answer_index}' không hợp lệ (phải từ 0 đến 3).`);
    }

    if (!q.explanation || q.explanation.trim().length < 5) {
      errors.push(`Câu hỏi số ${idx + 1} (${q.question_id}) thiếu lời giải thích sư phạm chi tiết.`);
    }
  });

  // 4. Source Grounding Validation
  let sourceGroundingValid = true;
  const conceptIds = new Set(lessonData.key_concepts.map((c) => c.concept_id));

  gameConfig.questions?.forEach((q, idx) => {
    if (!q.related_concept_id || !conceptIds.has(q.related_concept_id)) {
      sourceGroundingValid = false;
      errors.push(
        `Câu hỏi số ${idx + 1} (${q.question_id}) gán với concept_id '${q.related_concept_id}' không tồn tại trong danh sách khái niệm bài học.`
      );
    }

    if (!q.source_excerpt || q.source_excerpt.trim().length < 5) {
      sourceGroundingValid = false;
      errors.push(`Câu hỏi số ${idx + 1} (${q.question_id}) thiếu câu trích dẫn căn cứ từ tài liệu nguồn.`);
    }
  });

  // Overall Status
  const isAllValid = schemaValid && questionCountValid && answerIndexValid && sourceGroundingValid && errors.length === 0;

  return {
    schema_valid: schemaValid,
    question_count_valid: questionCountValid,
    answer_index_valid: answerIndexValid,
    source_grounding_valid: sourceGroundingValid,
    validation_errors: errors,
    retry_count: retryCount,
    overall_status: isAllValid ? 'passed' : 'failed',
  };
}
