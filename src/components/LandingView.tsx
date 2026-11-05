import React from 'react';
import {
  Sparkles,
  FileText,
  BrainCircuit,
  Gamepad2,
  ArrowRight,
  ShieldCheck,
  Play,
  Repeat,
} from 'lucide-react';

interface LandingViewProps {
  onCreateClick: () => void;
  onDemoClick: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onCreateClick,
  onDemoClick,
}) => {
  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-12 md:pt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline and Call to Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="tracking-wide">AGENTIC AI EDUCATIONAL GAME FACTORY</span>
              <span aria-hidden="true" className="text-emerald-400">·</span>
              <span className="font-mono">PROTOTYPE V0.1</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1] text-balance">
              Turn Every Lesson Into an Adventure.
            </h1>

            <p className="text-lg md:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl">
              Chuyển đổi giáo án PDF tĩnh thành trò chơi 2D tương tác sống động thông qua quy trình Agentic AI 3-node và engine Kaplay.js.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onCreateClick}
                className="flex items-center gap-2.5 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/25 button-step-press cursor-pointer"
              >
                <span>Tạo Game Từ Giáo Án PDF</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onDemoClick}
                className="flex items-center gap-2.5 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl border border-slate-300 shadow-xs button-step-press cursor-pointer"
              >
                <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>Trải Nghiệm Mẫu (Sinh Học)</span>
              </button>
            </div>

            {/* Unboxed Metadata Trust Strip */}
            <div className="flex flex-wrap items-center gap-3 pt-3 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Định dạng PDF (tối đa 10MB)
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Hỗ trợ tiếng Việt</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>3 Agent Kiểm Định</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Game 2D Native Canvas 60 FPS</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Graphic */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl bg-white/95 border border-slate-200/90 p-6 shadow-xl backdrop-blur-sm overflow-hidden card-hover-lift">
              {/* Decorative Subtle Ambient Glow */}
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs text-slate-500 font-medium">
                <span className="font-mono text-emerald-700 font-bold">PIPELINE PREVIEW</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono">
                  Kaplay 2D Engine
                </span>
              </div>

              {/* Simulated Transformation Card */}
              <div className="mt-4 space-y-3">
                {/* PDF Document snippet */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3 hover:border-slate-300 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="grow min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">Giao_an_Quang_hop.pdf</div>
                    <div className="text-[11px] text-slate-500">Khái niệm, pha sáng, pha tối, lục lạp</div>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                    Đã trích xuất
                  </span>
                </div>

                {/* Arrow down icon */}
                <div className="flex justify-center">
                  <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 text-xs shadow-xs">
                    ↓
                  </div>
                </div>

                {/* Agent Process */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3 hover:border-slate-300 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div className="grow min-w-0">
                    <div className="text-xs font-bold text-slate-900">Agentic Orchestrator</div>
                    <div className="text-[11px] text-slate-500">Curriculum Parser → Designer → Evaluator</div>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                    Đạt 100%
                  </span>
                </div>

                {/* Arrow down icon */}
                <div className="flex justify-center">
                  <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 text-xs shadow-xs">
                    ↓
                  </div>
                </div>

                {/* Resulting 2D Game */}
                <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Gamepad2 className="w-5 h-5" />
                  </div>
                  <div className="grow min-w-0">
                    <div className="text-xs font-bold text-slate-900">Quiz Runner 2D: Cuộc Đua Lục Lạp</div>
                    <div className="text-[11px] text-slate-600">6 Thử thách · 3 Mạng · Chạy vượt chướng ngại vật</div>
                  </div>
                  <button
                    onClick={onDemoClick}
                    className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-500 transition-colors shrink-0 shadow-xs button-step-press cursor-pointer"
                  >
                    Chơi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 WORKING STEPS */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold tracking-widest text-emerald-700 uppercase mb-2">
            CÁCH THỨC HOẠT ĐỘNG
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-950 tracking-tight">
            Từ Giáo Án Đến Trò Chơi Trong 4 Bước
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md card-hover-lift flex flex-col justify-between">
            <div>
              <div className="text-3xl font-black text-slate-200 mb-4 font-mono group-hover:text-emerald-500 transition-colors">
                01
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4 shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Upload Your Lesson</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tải lên tài liệu giáo án định dạng PDF (tối đa 10MB). Hệ thống tự động trích xuất văn bản và kiểm tra chất lượng số hóa.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md card-hover-lift flex flex-col justify-between">
            <div>
              <div className="text-3xl font-black text-slate-200 mb-4 font-mono group-hover:text-emerald-500 transition-colors">
                02
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-4 shadow-xs">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">AI Understands</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Curriculum Parser phân tích chuyên sâu các khái niệm tri thức cốt lõi, mục tiêu sư phạm và trích xuất câu căn cứ khoa học từ tài liệu.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md card-hover-lift flex flex-col justify-between">
            <div>
              <div className="text-3xl font-black text-slate-200 mb-4 font-mono group-hover:text-emerald-500 transition-colors">
                03
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Game Gets Created</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pedagogical Designer thiết kế câu hỏi trắc nghiệm, và Evaluator tự động kiểm định 100% schema, chỉ số đáp án và tính căn cứ trước khi xuất bản.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md card-hover-lift flex flex-col justify-between">
            <div>
              <div className="text-3xl font-black text-slate-200 mb-4 font-mono group-hover:text-emerald-500 transition-colors">
                04
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4 shadow-xs">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Play and Learn</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trực tiếp chơi trò chơi 2D Quiz Runner trên trình duyệt! Vượt qua các chướng ngại vật bằng phản xạ và kiến thức vừa học.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI WORKFLOW SECTION */}
      <section id="workflow" className="max-w-7xl mx-auto px-6">
        <div className="p-8 md:p-12 rounded-3xl bg-white border border-slate-200 shadow-md">
          <div className="max-w-2xl mb-10">
            <h2 className="text-xs font-bold tracking-widest text-emerald-700 uppercase mb-2">
              KIẾN TRÚC AGENTIC AI
            </h2>
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight">
              StateGraph Workflow: 3 Node Chuyên Biệt
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Mỗi node thực thi nhiệm vụ độc lập, có schema riêng và cơ chế tự động thẩm định lỗi trước khi xuất bản game.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Node 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:shadow-md card-hover-lift relative transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-emerald-700">NODE 1</span>
                <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Gemini 3.8 Flash
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Curriculum Parser</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Nhận văn bản trích xuất từ PDF. Nhận diện môn học, bài học, tóm tắt nội dung và trích xuất danh sách khái niệm kèm đoạn trích căn cứ.
              </p>
              <div className="text-[11px] font-mono text-slate-700 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-xs">
                Output: Lesson JSON
              </div>
            </div>

            {/* Node 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:shadow-md card-hover-lift relative transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-emerald-700">NODE 2</span>
                <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Gemini 3.8 Flash
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Pedagogical Designer</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Phân tích cấu trúc sư phạm, chọn Quiz Runner template, tạo từ 5 đến 8 câu hỏi với đúng 4 đáp án, giải thích chi tiết và liên kết concept ID.
              </p>
              <div className="text-[11px] font-mono text-slate-700 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-xs">
                Output: Game Config JSON
              </div>
            </div>

            {/* Node 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:shadow-md card-hover-lift relative transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-emerald-700">NODE 3</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <Repeat className="w-3 h-3" /> Tự sửa lỗi (max 2)
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Evaluator Node</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Thẩm định chặt chẽ Zod Schema, số lượng câu hỏi, tính nhất quán của đáp án và đối chiếu căn cứ tài liệu nguồn. Nếu sai, yêu cầu Node 2 sinh lại.
              </p>
              <div className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 shadow-xs">
                Output: Evaluation Report
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FOOTER STRIP */}
      <section className="max-w-7xl mx-auto px-6 text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-emerald-50/90 via-white to-teal-50/90 border border-emerald-200 shadow-md flex flex-col items-center gap-6">
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-950">
            Sẵn Sàng Trải Nghiệm Prototype v0.1?
          </h3>
          <p className="text-sm text-slate-600 max-w-lg">
            Khám phá sức mạnh chuyển đổi giáo án PDF thành game học tập trực tiếp ngay hôm nay.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={onCreateClick}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 button-step-press cursor-pointer"
            >
              Tải Lên Giáo Án Của Bạn
            </button>
            <button
              onClick={onDemoClick}
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl border border-slate-300 shadow-xs button-step-press cursor-pointer"
            >
              Chạy Demo Sinh Học (Không Cần Key)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
