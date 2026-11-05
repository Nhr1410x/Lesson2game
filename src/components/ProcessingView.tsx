import React from 'react';
import {
  FileText,
  BrainCircuit,
  Gamepad2,
  ListChecks,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface ProcessingViewProps {
  currentStage: number; // 1 to 5
  statusMessage?: string;
  error?: string | null;
  onRetry: () => void;
  onUseDemo: () => void;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({
  currentStage,
  statusMessage,
  error,
  onRetry,
  onUseDemo,
}) => {
  const steps = [
    {
      id: 1,
      title: 'Đọc và trích xuất văn bản từ tài liệu PDF',
      subtitle: 'Kiểm tra tính toàn vẹn, lọc khoảng trắng dư và trích xuất nội dung kỹ thuật số.',
      icon: FileText,
    },
    {
      id: 2,
      title: 'Hiểu bài học (Curriculum Parser Agent)',
      subtitle: 'Phân tích mục tiêu sư phạm, xác định chủ đề và trích xuất danh sách khái niệm trọng tâm.',
      icon: BrainCircuit,
    },
    {
      id: 3,
      title: 'Thiết kế cấu trúc trò chơi (Pedagogical Designer)',
      subtitle: 'Phân loại tri thức, gắn kết cơ chế tương tác và lựa chọn Quiz Runner 2D.',
      icon: Gamepad2,
    },
    {
      id: 4,
      title: 'Sinh câu hỏi trắc nghiệm 4 đáp án',
      subtitle: 'Tạo từ 5 đến 8 câu hỏi, đáp án đúng và lời giải thích có căn cứ trích dẫn nguồn.',
      icon: ListChecks,
    },
    {
      id: 5,
      title: 'Kiểm định chất lượng nội dung (Evaluator Agent)',
      subtitle: 'Xác thực schema, chỉ số đáp án đúng (0-3) và tính nhất quán với tài liệu nguồn.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="p-8 rounded-3xl bg-white/95 border border-slate-200 shadow-xl backdrop-blur-sm">
        {/* HEADER */}
        <div className="text-center mb-8 space-y-2">
          {!error ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold shadow-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>AGENTIC PIPELINE ĐANG XỬ LÝ...</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono font-bold shadow-xs">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>TIẾN TRÌNH GẶP SỰ CỐ</span>
            </div>
          )}

          <h2 className="text-2xl font-black text-slate-950 tracking-tight">
            {!error ? 'Đang Chuyển Đổi Giáo Án Thành Game' : 'Không Thể Hoàn Tất Phân Tích'}
          </h2>

          <p className="text-xs text-slate-600 font-medium">
            {statusMessage || 'Hệ thống đang điều phối các agent độc lập để thiết kế và kiểm định trò chơi.'}
          </p>
        </div>

        {/* STEP PROGRESS LIST */}
        <div className="space-y-4 mb-8">
          {steps.map((step) => {
            const isCompleted = currentStage > step.id;
            const isCurrent = currentStage === step.id && !error;
            const isFailed = currentStage === step.id && error;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
                    : isCompleted
                    ? 'bg-emerald-50/50 border-emerald-200/80'
                    : isFailed
                    ? 'bg-rose-50/70 border-rose-300'
                    : 'bg-slate-50/80 border-slate-200/80 opacity-50'
                }`}
              >
                {/* Status Indicator Icon */}
                <div className="shrink-0 mt-0.5">
                  {isCompleted ? (
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-600 shadow-xs">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  ) : isFailed ? (
                    <div className="w-7 h-7 rounded-lg bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                      <Icon className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="grow min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-sm font-bold ${
                        isCurrent ? 'text-slate-950' : isCompleted ? 'text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      {step.title}
                    </p>
                    <span className="text-[10px] font-mono font-bold text-slate-500 shrink-0">
                      Bước {step.id}/5
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{step.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ERROR STATE ACTIONS */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-4">
            <div className="text-xs text-rose-900">
              <span className="font-bold text-rose-950">Chi tiết lỗi: </span>
              <span>{error}</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={onRetry}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold border border-slate-300 shadow-xs button-step-press transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Thử Lại Tệp Khác</span>
              </button>

              <button
                onClick={onUseDemo}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs button-step-press transition-colors cursor-pointer"
              >
                <span>Chuyển Sang Bản Mẫu Sinh Học</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
