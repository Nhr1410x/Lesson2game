import React, { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { LandingView } from './components/LandingView.tsx';
import { UploadView } from './components/UploadView.tsx';
import { ProcessingView } from './components/ProcessingView.tsx';
import { PreviewView } from './components/PreviewView.tsx';
import { QuizRunnerEngine } from './games/quiz-runner/QuizRunnerEngine.tsx';
import { ResultView } from './components/ResultView.tsx';
import { InteractiveBackground } from './components/InteractiveBackground.tsx';
import { GenerationResponse } from './types/game.ts';
import { GameResult } from './games/quiz-runner/types.ts';

type AppView = 'landing' | 'upload' | 'processing' | 'preview' | 'player' | 'result';

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('landing');
  const [generationData, setGenerationData] = useState<GenerationResponse | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  // Processing state
  const [processingStage, setProcessingStage] = useState(1);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Trigger Demo Mode
  const handleTriggerDemo = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setActiveView('processing');
    setProcessingStage(1);
    setStatusMessage('Đang tải dữ liệu chuẩn hoá bài học Sinh Học (Quang hợp ở thực vật)...');

    try {
      // Simulate real step transitions for demonstration
      await new Promise((r) => setTimeout(r, 600));
      setProcessingStage(2);
      setStatusMessage('Curriculum Parser đang trích xuất mục tiêu & khái niệm...');

      await new Promise((r) => setTimeout(r, 600));
      setProcessingStage(3);
      setStatusMessage('Pedagogical Designer đang lựa chọn Quiz Runner 2D...');

      await new Promise((r) => setTimeout(r, 600));
      setProcessingStage(4);
      setStatusMessage('Sinh câu hỏi trắc nghiệm & đáp án đúng...');

      await new Promise((r) => setTimeout(r, 600));
      setProcessingStage(5);
      setStatusMessage('Evaluator thẩm định 100% schema & căn cứ tài liệu...');

      const response = await fetch('/api/v1/games/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu Demo.');
      }

      const data: GenerationResponse = await response.json();
      setGenerationData(data);
      setActiveView('preview');
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi kích hoạt chế độ Demo');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit real PDF file
  const handleUploadFile = async (file: File) => {
    setIsLoading(true);
    setErrorMessage(null);
    setActiveView('processing');
    setProcessingStage(1);
    setStatusMessage(`Đang tải lên và trích xuất nội dung từ tệp "${file.name}"...`);

    const formData = new FormData();
    formData.append('file', file);

    const timer1 = setTimeout(() => {
      setProcessingStage(2);
      setStatusMessage('Curriculum Parser Agent đang phân tích cấu trúc & mục tiêu bài học...');
    }, 1500);

    const timer2 = setTimeout(() => {
      setProcessingStage(3);
      setStatusMessage('Pedagogical Designer Agent đang thiết kế kịch bản Quiz Runner...');
    }, 6000);

    const timer3 = setTimeout(() => {
      setProcessingStage(4);
      setStatusMessage('Đang sinh bộ câu hỏi trắc nghiệm và lời giải thích có căn cứ...');
    }, 11000);

    try {
      const response = await fetch('/api/v1/games/generate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Quá trình phân tích tài liệu và sinh game thất bại.');
      }

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      // Step 5: Evaluator validation finishes in 1ms!
      setProcessingStage(5);
      setStatusMessage('Evaluator thẩm định 100% schema và căn cứ tài liệu: ĐẠT TIÊU CHUẨN!');

      // Short pause to visually show 5/5 completed
      await new Promise((r) => setTimeout(r, 600));

      setGenerationData(data);
      setActiveView('preview');
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setErrorMessage(err.message || 'Lỗi không xác định khi kết nối với máy chủ AI.');
    } finally {
      setIsLoading(false);
    }
  };

  // Switch to Game Player
  const handlePlayGame = () => {
    if (!generationData) return;
    setActiveView('player');
  };

  // Handle Game Finish
  const handleFinishGame = (result: GameResult) => {
    setGameResult(result);
    setActiveView('result');
  };

  // Play Again
  const handlePlayAgain = () => {
    setActiveView('player');
  };

  // Create New Game
  const handleNewGame = () => {
    setGenerationData(null);
    setGameResult(null);
    setErrorMessage(null);
    setActiveView('upload');
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-slate-900 font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* DEEPEST LAYER INTERACTIVE GRID & MOUSE SPOTLIGHT */}
      <InteractiveBackground />

      {/* Strict 3-zone Navbar */}
      <Navbar
        onGoHome={() => setActiveView('landing')}
        onCreateClick={() => setActiveView('upload')}
        onDemoClick={handleTriggerDemo}
        activeView={activeView}
      />

      {/* MAIN VIEW ROUTING */}
      <main className="grow relative z-10">
        {activeView === 'landing' && (
          <LandingView
            onCreateClick={() => setActiveView('upload')}
            onDemoClick={handleTriggerDemo}
          />
        )}

        {activeView === 'upload' && (
          <UploadView
            onFileSubmit={handleUploadFile}
            onDemoClick={handleTriggerDemo}
            isLoading={isLoading}
          />
        )}

        {activeView === 'processing' && (
          <ProcessingView
            currentStage={processingStage}
            statusMessage={statusMessage}
            error={errorMessage}
            onRetry={() => setActiveView('upload')}
            onUseDemo={handleTriggerDemo}
          />
        )}

        {activeView === 'preview' && generationData && (
          <PreviewView
            generationData={generationData}
            onPlayClick={handlePlayGame}
            onNewGameClick={handleNewGame}
          />
        )}

        {activeView === 'player' && generationData && (
          <div className="py-8 px-4">
            <QuizRunnerEngine
              gameConfig={generationData.game_config}
              onFinish={handleFinishGame}
              onExit={() => setActiveView('preview')}
            />
          </div>
        )}

        {activeView === 'result' && gameResult && (
          <ResultView
            result={gameResult}
            onPlayAgain={handlePlayAgain}
            onNewGame={handleNewGame}
          />
        )}
      </main>

      {/* CLEAN FOOTER */}
      <footer className="relative z-10 py-8 px-6 border-t border-slate-200/80 bg-white/70 backdrop-blur-md text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-medium">© 2026 Lesson2Game. Agentic AI Educational Game Factory (Prototype v0.1).</p>
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span className="hover:text-slate-800 transition-colors">Powered by Gemini 3.8 Flash</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-800 transition-colors">Kaplay.js 2D Runner</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-800 transition-colors">EdTech Hackathon Edition</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
