import React, { useState } from 'react';
import { GameResult } from '../games/quiz-runner/types.ts';
import {
  Trophy,
  RotateCcw,
  PlusCircle,
  Download,
  CheckCircle2,
  XCircle,
  Flame,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ResultViewProps {
  result: GameResult;
  onPlayAgain: () => void;
  onNewGame: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  onPlayAgain,
  onNewGame,
}) => {
  const [showDetailList, setShowDetailList] = useState(false);
  const {
    totalScore,
    correctCount,
    totalQuestions,
    accuracy,
    maxCombo,
    answeredQuestions,
    gameConfig,
  } = result;

  const handleDownloadJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(gameConfig, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `${gameConfig.game_id || 'game_config'}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getEvaluationRemark = (acc: number) => {
    if (acc >= 90) return 'Xuất Sắc! Bạn đã nắm vững toàn bộ kiến thức trọng tâm của bài học.';
    if (acc >= 70) return 'Rất Tốt! Bạn đã vượt qua hầu hết các chướng ngại vật tri thức.';
    if (acc >= 50) return 'Khá! Bạn đã vượt qua các câu hỏi cơ bản, cần ôn tập thêm các khái niệm nâng cao.';
    return 'Cần Cố Gắng! Hãy xem lại các giải thích sư phạm bên dưới và thử lại nhé.';
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      {/* RESULT HERO CARD */}
      <div className="p-8 md:p-10 rounded-3xl bg-white border border-slate-200 text-center relative overflow-hidden shadow-xl card-hover-lift">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto mb-4 shadow-sm shadow-emerald-500/20">
          <Trophy className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-black text-slate-950 tracking-tight mb-2">
          Kết Quả Hoàn Thành Thử Thách
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto mb-8 font-medium">
          {gameConfig.game_title}
        </p>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
              Tổng Điểm
            </span>
            <span className="text-2xl font-mono font-extrabold text-emerald-700">
              {totalScore.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
              Độ Chính Xác
            </span>
            <span className="text-2xl font-mono font-extrabold text-slate-950">
              {accuracy}%
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
              Số Câu Đúng
            </span>
            <span className="text-2xl font-mono font-extrabold text-emerald-700">
              {correctCount} / {totalQuestions}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
              Combo Cao Nhất
            </span>
            <span className="text-2xl font-mono font-extrabold text-amber-600 flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
              <span>x{maxCombo}</span>
            </span>
          </div>
        </div>

        {/* Pedagogical Summary Remark */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 max-w-xl mx-auto text-xs text-slate-800">
          <span className="font-bold text-emerald-950">Đánh giá sư phạm: </span>
          {getEvaluationRemark(accuracy)}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <button
            onClick={onPlayAgain}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/20 button-step-press cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi Lại Trò Chơi</span>
          </button>

          <button
            onClick={onNewGame}
            className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs rounded-xl border border-slate-300 shadow-xs button-step-press cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>Tạo Game Từ Giáo Án Khác</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 shadow-xs button-step-press cursor-pointer"
            title="Tải cấu hình Game Config JSON"
          >
            <Download className="w-4 h-4" />
            <span>Tải JSON</span>
          </button>
        </div>
      </div>

      {/* QUESTION-BY-QUESTION REVIEW */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowDetailList(!showDetailList)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Chi Tiết Từng Câu Hỏi & Căn Cứ Sư Phạm
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Kiểm tra xem câu nào trả lời đúng, câu nào cần ôn tập lại kiến thức nguồn
            </p>
          </div>

          {showDetailList ? (
            <ChevronUp className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </button>

        {showDetailList && (
          <div className="p-6 pt-2 space-y-4 border-t border-slate-100 bg-slate-50/50">
            {answeredQuestions.map((item, idx) => {
              const { question, isCorrect, selectedOptionIndex } = item;
              return (
                <div
                  key={question.question_id || idx}
                  className={`p-4 rounded-xl border space-y-3 ${
                    isCorrect
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-rose-50/50 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <span className="shrink-0 px-2 py-0.5 rounded bg-white text-slate-800 text-xs font-mono font-bold border border-slate-200 shadow-xs">
                        Câu {idx + 1}
                      </span>
                      <p className="text-sm font-semibold text-slate-900 leading-snug">
                        {question.question_text}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold">
                      {isCorrect ? (
                        <span className="text-emerald-700 flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Đúng
                        </span>
                      ) : (
                        <span className="text-rose-700 flex items-center gap-1 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                          <XCircle className="w-4 h-4 text-rose-600" /> Sai
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {question.options.map((opt, oIdx) => {
                      const wasSelected = selectedOptionIndex === oIdx;
                      const isTargetCorrect = oIdx === question.correct_answer_index;

                      let optClass = 'bg-white border-slate-200 text-slate-700';
                      if (isTargetCorrect) {
                        optClass = 'bg-emerald-100 border-emerald-300 text-emerald-950 font-semibold shadow-xs';
                      } else if (wasSelected && !isTargetCorrect) {
                        optClass = 'bg-rose-100 border-rose-300 text-rose-950 font-semibold shadow-xs';
                      }

                      return (
                        <div key={oIdx} className={`p-2.5 rounded-lg border flex items-center gap-2 ${optClass}`}>
                          <span className="font-mono font-bold">{['A', 'B', 'C', 'D'][oIdx]}.</span>
                          <span>{opt}</span>
                          {isTargetCorrect && (
                            <span className="ml-auto text-[10px] text-emerald-800 font-bold bg-white px-1.5 py-0.2 rounded border border-emerald-200">
                              ĐÚNG
                            </span>
                          )}
                          {wasSelected && !isTargetCorrect && (
                            <span className="ml-auto text-[10px] text-rose-800 font-bold bg-white px-1.5 py-0.2 rounded border border-rose-200">
                              BẠN CHỌN
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-1 text-xs space-y-1 text-slate-600">
                    <p>
                      <span className="font-semibold text-slate-900">Giải thích sư phạm: </span>
                      {question.explanation}
                    </p>
                    {question.source_excerpt && (
                      <p className="text-[11px] text-slate-500 italic">
                        Căn cứ tài liệu: &ldquo;{question.source_excerpt}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
