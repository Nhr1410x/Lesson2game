import { LessonData, GameConfig, EvaluationReport, GenerationResponse } from '../../src/types/game.ts';
import { parseCurriculumNode } from './curriculumParser.ts';
import { designGameNode } from './pedagogicalDesigner.ts';
import { evaluateGameNode } from './evaluator.ts';

export interface WorkflowState {
  document_text: string;
  filename: string;
  lesson_data?: LessonData;
  game_config?: GameConfig;
  evaluation_report?: EvaluationReport;
  retry_count: number;
  processing_status: 'processing' | 'completed' | 'failed';
  error_message?: string;
  steps_log: Array<{
    step: string;
    timestamp: string;
    status: 'pending' | 'success' | 'warning' | 'error';
    message: string;
  }>;
}

export async function runAgentWorkflow(
  documentText: string,
  filename: string,
  onStepProgress?: (step: string, message: string) => void
): Promise<GenerationResponse> {
  const state: WorkflowState = {
    document_text: documentText,
    filename,
    retry_count: 0,
    processing_status: 'processing',
    steps_log: [],
  };

  const logStep = (step: string, status: 'pending' | 'success' | 'warning' | 'error', message: string) => {
    state.steps_log.push({
      step,
      timestamp: new Date().toISOString(),
      status,
      message,
    });
    if (onStepProgress) {
      onStepProgress(step, message);
    }
  };

  try {
    // -------------------------------------------------------------
    // NODE 1: Curriculum Parser
    // -------------------------------------------------------------
    logStep('parse_curriculum', 'pending', 'Bắt đầu Node 1: Curriculum Parser đang phân tích cấu trúc bài học...');
    state.lesson_data = await parseCurriculumNode(state.document_text);
    logStep(
      'parse_curriculum',
      'success',
      `Đã trích xuất bài học: "${state.lesson_data.lesson_title}" (${state.lesson_data.subject}) với ${state.lesson_data.key_concepts.length} khái niệm trọng tâm.`
    );

    // -------------------------------------------------------------
    // NODE 2 & 3: Pedagogical Designer + Evaluator with Loop (max 2 retries)
    // -------------------------------------------------------------
    const MAX_RETRIES = 2;
    let evalPassed = false;
    let lastEvaluation: EvaluationReport | null = null;

    while (state.retry_count <= MAX_RETRIES && !evalPassed) {
      const feedback = lastEvaluation?.validation_errors;

      logStep(
        'design_game',
        'pending',
        state.retry_count === 0
          ? 'Bắt đầu Node 2: Pedagogical Designer đang thiết kế câu hỏi trắc nghiệm cho Quiz Runner...'
          : `Node 2 (Lần thử ${state.retry_count + 1}): Pedagogical Designer đang tự động điều chỉnh theo phản hồi của Evaluator...`
      );

      state.game_config = await designGameNode(state.lesson_data, feedback);

      logStep(
        'design_game',
        'success',
        `Đã tạo trò chơi "${state.game_config.game_title}" với ${state.game_config.questions.length} câu hỏi trắc nghiệm.`
      );

      // NODE 3: Evaluator
      logStep('evaluate_game', 'pending', 'Bắt đầu Node 3: Evaluator đang kiểm định schema, chỉ số đáp án và tính căn cứ tài liệu...');
      const evalReport = evaluateGameNode(state.lesson_data, state.game_config, state.retry_count);
      lastEvaluation = evalReport;
      state.evaluation_report = evalReport;

      if (evalReport.overall_status === 'passed') {
        evalPassed = true;
        logStep(
          'evaluate_game',
          'success',
          `Kiểm định thành công! Đạt 100% tiêu chuẩn schema, số lượng đáp án và căn cứ tài liệu nguồn.`
        );
      } else {
        logStep(
          'evaluate_game',
          'warning',
          `Kiểm định chưa đạt: ${evalReport.validation_errors.join('; ')}`
        );
        state.retry_count++;
      }
    }

    if (!evalPassed || !state.game_config || !state.evaluation_report) {
      state.processing_status = 'failed';
      state.error_message = `Evaluator từ chối xuất bản dữ liệu game sau ${MAX_RETRIES} lần thử: ${lastEvaluation?.validation_errors.join('; ')}`;
      throw new Error(state.error_message);
    }

    state.processing_status = 'completed';

    const generationId = `gen_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    return {
      generation_id: generationId,
      processing_status: 'completed',
      mode: 'ai_pipeline',
      lesson_data: state.lesson_data,
      game_config: state.game_config,
      evaluation_report: state.evaluation_report,
    };
  } catch (error: any) {
    state.processing_status = 'failed';
    state.error_message = error.message || 'Lỗi không xác định trong agent workflow';
    logStep('workflow_error', 'error', state.error_message!);
    throw error;
  }
}
