import { Question, GameConfig } from '../../types/game.ts';

export interface AnsweredQuestionRecord {
  question: Question;
  selectedOptionIndex: number;
  isCorrect: boolean;
  timeSpent: number;
}

export interface GameResult {
  gameConfig: GameConfig;
  totalScore: number;
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
  heartsLeft: number;
  maxCombo: number;
  durationSeconds: number;
  answeredQuestions: AnsweredQuestionRecord[];
}
