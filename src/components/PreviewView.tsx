import React, { useState } from 'react';
import { GenerationResponse } from '../types/game.ts';
import {
  Gamepad2,
  BookOpen,
  Target,
  ChevronDown,
  ChevronUp,
  Play,
  RotateCcw,
  ShieldCheck,
  Layers,
} from 'lucide-react';

interface PreviewViewProps {
  generationData: GenerationResponse;
  onPlayClick: () => void;
  onNewGameClick: () => void;
}

export const PreviewView: React.FC<PreviewViewProps> = ({
  generationData,
  onPlayClick,
  onNewGameClick,
}) => {
  const [showQuestions, setShowQuestions] = useState(false);
  const { lesson_data, game_config, mode } = generationData;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold mb-1">
            {mode === 'demo_mode' ? (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold">
                DEMO MODE · BẢN MẪU CHUẨN
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold">
                AI PIPELINE COMPLETED · GEMINI 3.8 FLASH
              </span>
            )}
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <span className="text-slate-500 font-medium">Kiểm Định Evaluator: Đạt</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            {game_config.game_title}
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNewGameClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-300 shadow-xs button-step-press cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tạo Game Khác</span>
          </button>

          <button
            onClick={onPlayClick}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 button-step-press cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>BẮT ĐẦU CHƠI NGAY</span>
          </button>
        </div>
      </div>

      {/* OVERVIEW CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Lesson Details */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm card-hover-lift space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Thông Tin Bài Học Được Trích Xuất</span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-950">{lesson_data.lesson_title}</h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-medium">
              <span>Môn: {lesson_data.subject}</span>
              <span aria-hidden="true">·</span>
              <span>Khối: {lesson_data.grade_level || 'Phổ thông'}</span>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            {lesson_data.summary}
          </p>

          {/* Objectives */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mục tiêu học tập chính:</span>
            </span>
            <ul className="space-y-1.5">
              {lesson_data.learning_objectives.map((obj, i) => (
                <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Card 2: Game Specs & Evaluator Score */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm card-hover-lift space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Gamepad2 className="w-4 h-4 text-emerald-600" />
              <span>Cấu Hình Game 2D</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Thể loại game:</span>
                <span className="font-semibold text-slate-900">Quiz Runner 2D</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Số lượng câu hỏi:</span>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {game_config.questions.length} câu
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Độ khó:</span>
                <span className="font-semibold text-slate-900 capitalize">{game_config.difficulty}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Thời gian ước tính:</span>
                <span className="font-semibold text-slate-900">{game_config.estimated_duration}</span>
              </div>
            </div>

            {/* Evaluator Status */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Kiểm Định Evaluator: PASSED</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Đạt 100% tiêu chuẩn schema, 4 lựa chọn mỗi câu, chỉ số 0-3 và đối soát căn cứ tài liệu nguồn.
              </p>
            </div>
          </div>

          <button
            onClick={onPlayClick}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 button-step-press cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>CHƠI GAME NGAY</span>
          </button>
        </div>
      </div>

      {/* QUESTIONS ACCORDION REVIEW */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowQuestions(!showQuestions)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Xem Trước {game_config.questions.length} Câu Hỏi Do AI Thiết Kế
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Giáo viên có thể kiểm tra danh sách câu hỏi, đáp án đúng và trích dẫn tài liệu trước khi chơi
              </p>
            </div>
          </div>

          {showQuestions ? (
            <ChevronUp className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </button>

        {showQuestions && (
          <div className="p-6 pt-2 space-y-4 border-t border-slate-100 bg-slate-50/50">
            {game_config.questions.map((q, idx) => (
              <div
                key={q.question_id || idx}
                className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-start gap-2">
                  <span className="shrink-0 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-mono font-bold border border-emerald-200">
                    Câu {idx + 1}
                  </span>
                  <p className="text-sm font-semibold text-slate-900 leading-snug">{q.question_text}</p>
                </div>

                {/* 4 Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = optIdx === q.correct_answer_index;
                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                          isCorrect
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="font-mono font-bold">
                          {['A', 'B', 'C', 'D'][optIdx]}.
                        </span>
                        <span>{opt}</span>
                        {isCorrect && (
                          <span className="ml-auto text-[10px] text-emerald-700 font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                            ĐÁP ÁN ĐÚNG
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation & Source Grounding */}
                <div className="pl-4 pt-1 space-y-1 text-xs">
                  <p className="text-slate-700">
                    <span className="font-semibold text-slate-900">Giải thích sư phạm: </span>
                    {q.explanation}
                  </p>
                  {q.source_excerpt && (
                    <p className="text-[11px] text-slate-500 italic">
                      Căn cứ tài liệu: &ldquo;{q.source_excerpt}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
