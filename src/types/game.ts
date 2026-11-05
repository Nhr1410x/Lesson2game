import { z } from 'zod';

export const ConceptSchema = z.object({
  concept_id: z.string(),
  concept_name: z.string(),
  explanation: z.string(),
  source_excerpt: z.string(),
});

export type Concept = z.infer<typeof ConceptSchema>;

export const LessonDataSchema = z.object({
  lesson_title: z.string(),
  subject: z.string(),
  grade_level: z.string().optional().default('Phổ thông'),
  summary: z.string(),
  learning_objectives: z.array(z.string()).min(1),
  key_concepts: z.array(ConceptSchema).min(1),
});

export type LessonData = z.infer<typeof LessonDataSchema>;

export const QuestionSchema = z.object({
  question_id: z.string(),
  question_text: z.string(),
  options: z.array(z.string()).length(4),
  correct_answer_index: z.number().int().min(0).max(3),
  explanation: z.string(),
  related_concept_id: z.string(),
  source_excerpt: z.string(),
});

export type Question = z.infer<typeof QuestionSchema>;

export const GameConfigSchema = z.object({
  game_id: z.string(),
  game_title: z.string(),
  game_type: z.literal('quiz_runner'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  estimated_duration: z.string().default('5-7 phút'),
  learning_objectives: z.array(z.string()),
  questions: z.array(QuestionSchema).min(5),
});

export type GameConfig = z.infer<typeof GameConfigSchema>;

export const EvaluationReportSchema = z.object({
  schema_valid: z.boolean(),
  question_count_valid: z.boolean(),
  answer_index_valid: z.boolean(),
  source_grounding_valid: z.boolean(),
  validation_errors: z.array(z.string()),
  retry_count: z.number().default(0),
  overall_status: z.enum(['passed', 'failed']),
});

export type EvaluationReport = z.infer<typeof EvaluationReportSchema>;

export interface GenerationResponse {
  generation_id: string;
  processing_status: 'completed' | 'failed' | 'processing';
  mode: 'ai_pipeline' | 'demo_mode';
  lesson_data: LessonData;
  game_config: GameConfig;
  evaluation_report: EvaluationReport;
  error_message?: string;
}
