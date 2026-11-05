import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  X,
  AlertCircle,
  Play,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface UploadViewProps {
  onFileSubmit: (file: File) => void;
  onDemoClick: () => void;
  isLoading: boolean;
}

export const UploadView: React.FC<UploadViewProps> = ({
  onFileSubmit,
  onDemoClick,
  isLoading,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);

    // Validate MIME / extension
    const isPdf =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setErrorMessage('Chỉ chấp nhận tệp định dạng PDF. Vui lòng chọn lại.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage(
        `Dung lượng tệp (${(file.size / (1024 * 1024)).toFixed(1)}MB) vượt quá giới hạn tối đa 10MB.`
      );
      return;
    }

    if (file.size === 0) {
      setErrorMessage('Tệp PDF được chọn là tệp rỗng.');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage('Vui lòng chọn một tệp PDF giáo án để tiếp tục.');
      return;
    }
    onFileSubmit(selectedFile);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* HEADER */}
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">
          Tạo Game Mới Từ Giáo Án PDF
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Tải lên tài liệu giảng dạy, bài giảng hoặc đề cương bài học định dạng PDF. AI sẽ tự động phân tích và tạo trò chơi 2D tương tác.
        </p>
      </div>

      {/* FORM CONTAINER */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* DRAG AND DROP ZONE */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !selectedFile && inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-8 md:p-12 text-center transition-all ${
            dragActive
              ? 'border-emerald-500 bg-emerald-50/80 scale-[1.01]'
              : selectedFile
              ? 'border-emerald-300 bg-emerald-50/30'
              : 'border-slate-300 hover:border-emerald-500 bg-white/90 hover:bg-emerald-50/20 shadow-xs cursor-pointer'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleChange}
            className="hidden"
          />

          {!selectedFile ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-slate-900">
                  Kéo và thả tệp PDF vào đây, hoặc{' '}
                  <span className="text-emerald-700 underline underline-offset-4 hover:text-emerald-600">
                    nhấp để duyệt tệp
                  </span>
                </p>
                <p className="text-xs text-slate-500">
                  Hỗ trợ định dạng PDF (chứa văn bản kỹ thuật số) · Tối đa 10MB
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-left">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500 font-mono">
                    {formatFileSize(selectedFile.size)} · Đã sẵn sàng phân tích
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                title="Chọn lại tệp khác"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* ERROR MESSAGE DISPLAY */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-rose-950">Không thể xử lý tệp: </span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* NOTICE BOX ON PDF SUPPORT */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-3 shadow-xs">
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-amber-950">Lưu ý về phiên bản Prototype v0.1: </span>
            Chỉ hỗ trợ tài liệu PDF có văn bản kỹ thuật số (không hỗ trợ PDF scan hình ảnh chưa qua OCR). Nếu chưa có sẵn file PDF trên máy, bạn có thể{' '}
            <a
              href="/sample_quang_hop.pdf"
              download="sample_quang_hop.pdf"
              className="text-emerald-700 font-bold underline underline-offset-2 hover:text-emerald-600"
            >
              tải tệp PDF mẫu tại đây
            </a>{' '}
            để kéo thả thử nghiệm, hoặc bấm nút &ldquo;Dùng Giáo Án Mẫu (Sinh Học)&rdquo; bên dưới.
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={!selectedFile || isLoading}
            className={`w-full sm:w-auto grow flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md ${
              !selectedFile || isLoading
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 button-step-press cursor-pointer'
            }`}
          >
            <span>Bắt Đầu Tạo Trò Chơi</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onDemoClick}
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold border border-slate-300 shadow-xs button-step-press transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            <span>Dùng Giáo Án Mẫu (Sinh Học)</span>
          </button>
        </div>
      </form>
    </div>
  );
};
