import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameConfig } from '../../types/game.ts';
import { GameResult, AnsweredQuestionRecord } from './types.ts';
import { sounds } from '../../lib/soundEffects.ts';
import {
  Heart,
  Trophy,
  Zap,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface QuizRunnerEngineProps {
  gameConfig: GameConfig;
  onFinish: (result: GameResult) => void;
  onExit: () => void;
}

type EngineState = 'START' | 'RUNNING' | 'CHALLENGE' | 'FEEDBACK' | 'GAMEOVER' | 'VICTORY';

export const QuizRunnerEngine: React.FC<QuizRunnerEngineProps> = ({
  gameConfig,
  onFinish,
  onExit,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Gameplay state
  const [engineState, setEngineState] = useState<EngineState>('START');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(25);
  const [answeredRecords, setAnsweredRecords] = useState<AnsweredQuestionRecord[]>([]);

  // Internal animation refs
  const stateRef = useRef({
    engineState: 'START' as EngineState,
    currentQuestionIndex: 0,
    hearts: 3,
    score: 0,
    combo: 0,
    maxCombo: 0,
    runnerX: 140,
    runnerY: 340,
    runnerVy: 0,
    isJumping: false,
    jumpTimer: 0,
    hurtTimer: 0,
    groundY: 380,
    scrollSpeed: 4,
    worldOffset: 0,
    obstacleX: 1000,
    obstacleActive: false,
    particles: [] as Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      life: number;
    }>,
    startTime: Date.now(),
    questionStartTime: Date.now(),
  });

  // Sync stateRef
  useEffect(() => {
    stateRef.current.engineState = engineState;
    stateRef.current.currentQuestionIndex = currentQuestionIndex;
    stateRef.current.hearts = hearts;
    stateRef.current.score = score;
    stateRef.current.combo = combo;
    stateRef.current.maxCombo = maxCombo;
  }, [engineState, currentQuestionIndex, hearts, score, combo, maxCombo]);

  const questions = gameConfig.questions;
  const currentQ = questions[currentQuestionIndex] || questions[0];

  // Sound toggle
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
  };

  // Trigger Jump with particles
  const triggerJump = useCallback(() => {
    const s = stateRef.current;
    if (!s.isJumping) {
      s.isJumping = true;
      s.runnerVy = -13;
      sounds.playJump();

      // Spawn dust / trail particles
      for (let i = 0; i < 8; i++) {
        s.particles.push({
          x: s.runnerX + 10,
          y: s.groundY - 5,
          vx: -(Math.random() * 4 + 1),
          vy: -(Math.random() * 3 + 1),
          color: '#34d399',
          size: Math.random() * 4 + 2,
          life: 1,
        });
      }
    }
  }, []);

  // Answer selection handler
  const handleSelectAnswer = useCallback(
    (index: number) => {
      if (engineState !== 'CHALLENGE') return;

      setSelectedOption(index);
      const isCorrect = index === currentQ.correct_answer_index;
      setLastAnswerCorrect(isCorrect);
      setEngineState('FEEDBACK');

      const timeSpent = Math.max(1, Math.round((Date.now() - stateRef.current.questionStartTime) / 1000));

      const newRecord: AnsweredQuestionRecord = {
        question: currentQ,
        selectedOptionIndex: index,
        isCorrect,
        timeSpent,
      };

      setAnsweredRecords((prev) => [...prev, newRecord]);

      if (isCorrect) {
        sounds.playCorrect();
        triggerJump();
        const newCombo = combo + 1;
        const addedScore = 100 + newCombo * 25;
        setCombo(newCombo);
        setMaxCombo((prev) => Math.max(prev, newCombo));
        setScore((prev) => prev + addedScore);

        // Spawn golden victory particles
        for (let i = 0; i < 25; i++) {
          stateRef.current.particles.push({
            x: stateRef.current.runnerX + 80,
            y: stateRef.current.runnerY - 30,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.7) * 9,
            color: ['#fbbf24', '#34d399', '#60a5fa', '#f472b6'][Math.floor(Math.random() * 4)],
            size: Math.random() * 5 + 3,
            life: 1.2,
          });
        }
      } else {
        sounds.playWrong();
        setCombo(0);
        stateRef.current.hurtTimer = 40;
        setHearts((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            sounds.playGameOver();
          }
          return next;
        });

        // Sparks on obstacle impact
        for (let i = 0; i < 15; i++) {
          stateRef.current.particles.push({
            x: stateRef.current.runnerX + 40,
            y: stateRef.current.runnerY,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            color: '#ef4444',
            size: Math.random() * 4 + 2,
            life: 0.8,
          });
        }
      }
    },
    [engineState, currentQ, combo, triggerJump]
  );

  // Continue after feedback
  const handleNextStep = useCallback(() => {
    setSelectedOption(null);
    setLastAnswerCorrect(null);

    if (hearts <= 0) {
      setEngineState('GAMEOVER');
      return;
    }

    if (currentQuestionIndex >= questions.length - 1) {
      setEngineState('VICTORY');
      sounds.playVictory();
      return;
    }

    // Advance to next question
    setCurrentQuestionIndex((prev) => prev + 1);
    setEngineState('RUNNING');
    stateRef.current.obstacleActive = false;
    stateRef.current.obstacleX = 850;
    stateRef.current.scrollSpeed = 5;
    setTimeRemaining(25);
  }, [hearts, currentQuestionIndex, questions.length]);

  // Keyboard shortcut listener (1, 2, 3, 4, Space, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (engineState === 'CHALLENGE') {
        if (['1', '2', '3', '4'].includes(e.key)) {
          handleSelectAnswer(parseInt(e.key, 10) - 1);
        }
      } else if (engineState === 'FEEDBACK') {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
          handleNextStep();
        }
      } else if (engineState === 'START') {
        if (e.key === 'Enter' || e.key === ' ') {
          startGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [engineState, handleSelectAnswer, handleNextStep]);

  // Question countdown timer
  useEffect(() => {
    if (engineState !== 'CHALLENGE') return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up: treat as wrong answer with option -1
          handleSelectAnswer(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [engineState, handleSelectAnswer]);

  const startGame = () => {
    setEngineState('RUNNING');
    setCurrentQuestionIndex(0);
    setHearts(3);
    setScore(0);
    setCombo(0);
    setAnsweredRecords([]);
    stateRef.current.obstacleX = 800;
    stateRef.current.obstacleActive = false;
    stateRef.current.startTime = Date.now();
  };

  const handleFinishScreen = () => {
    const totalQ = questions.length;
    const correctCount = answeredRecords.filter((r) => r.isCorrect).length;
    const accuracy = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;
    const duration = Math.round((Date.now() - stateRef.current.startTime) / 1000);

    onFinish({
      gameConfig,
      totalScore: score,
      correctCount,
      totalQuestions: totalQ,
      accuracy,
      heartsLeft: hearts,
      maxCombo,
      durationSeconds: duration,
      answeredQuestions: answeredRecords,
    });
  };

  // -------------------------------------------------------------
  // 2D CANVAS RENDERING LOOP (Side-scrolling runner)
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const s = stateRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // Update positions
      if (s.engineState === 'RUNNING') {
        s.worldOffset += s.scrollSpeed;
        if (!s.obstacleActive) {
          s.obstacleX -= s.scrollSpeed;
          // When obstacle gets close, enter challenge mode!
          if (s.obstacleX <= 540) {
            s.obstacleActive = true;
            s.questionStartTime = Date.now();
            setEngineState('CHALLENGE');
          }
        }
      }

      // Physics for runner jump
      if (s.isJumping) {
        s.runnerY += s.runnerVy;
        s.runnerVy += 0.65; // gravity
        if (s.runnerY >= s.groundY - 50) {
          s.runnerY = s.groundY - 50;
          s.isJumping = false;
          s.runnerVy = 0;
        }
      } else {
        s.runnerY = s.groundY - 50;
      }

      if (s.hurtTimer > 0) s.hurtTimer--;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // 1. SKY BACKGROUND & NEBULA
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#0a0f1d');
      bgGrad.addColorStop(0.65, '#0f172a');
      bgGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Stars (parallax layer 1)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      for (let i = 0; i < 40; i++) {
        const starX = (i * 47 - (s.worldOffset * 0.2)) % width;
        const x = starX < 0 ? starX + width : starX;
        const y = (i * 31) % (s.groundY - 100);
        const r = (i % 3 === 0) ? 2 : 1.2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Distant mountains / futuristic cityscape (layer 2)
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(0, s.groundY);
      for (let x = 0; x <= width; x += 40) {
        const h = Math.sin((x + s.worldOffset * 0.4) * 0.01) * 35 + 90;
        ctx.lineTo(x, s.groundY - h);
      }
      ctx.lineTo(width, s.groundY);
      ctx.closePath();
      ctx.fill();

      // Futuristic power grid / midground silos (layer 3)
      ctx.fillStyle = '#0f172a';
      for (let i = 0; i < 8; i++) {
        const bx = ((i * 180 - s.worldOffset * 0.8) % (width + 200)) - 100;
        const bh = 110 + (i % 3) * 30;
        ctx.fillRect(bx, s.groundY - bh, 65, bh);
        // glowing window stripes
        ctx.fillStyle = (i % 2 === 0) ? '#10b981' : '#38bdf8';
        ctx.fillRect(bx + 12, s.groundY - bh + 20, 8, 8);
        ctx.fillRect(bx + 35, s.groundY - bh + 45, 8, 8);
        ctx.fillStyle = '#0f172a';
      }

      // 2. RUNNING GROUND PLATFORM
      const groundGrad = ctx.createLinearGradient(0, s.groundY, 0, height);
      groundGrad.addColorStop(0, '#10b981');
      groundGrad.addColorStop(0.08, '#047857');
      groundGrad.addColorStop(0.2, '#0f172a');
      groundGrad.addColorStop(1, '#020617');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, s.groundY, width, height - s.groundY);

      // Grid perspective stripes on ground
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.35)';
      ctx.lineWidth = 1.5;
      const stripeOffset = (s.worldOffset * 2) % 60;
      for (let gx = -stripeOffset; gx < width; gx += 60) {
        ctx.beginPath();
        ctx.moveTo(gx, s.groundY);
        ctx.lineTo(gx - 40, height);
        ctx.stroke();
      }

      // Neon horizon glow line
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(0, s.groundY);
      ctx.lineTo(width, s.groundY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 3. OBSTACLE / KNOWLEDGE GATE
      if (s.obstacleX > -100 && s.obstacleX < width + 100) {
        const ox = s.obstacleX;
        const oy = s.groundY - 110;

        // Base pedestal
        ctx.fillStyle = '#334155';
        ctx.fillRect(ox - 25, s.groundY - 15, 50, 15);

        // Holographic gate pillars
        const gateColor =
          s.engineState === 'FEEDBACK'
            ? lastAnswerCorrect
              ? '#10b981'
              : '#ef4444'
            : '#f59e0b';

        ctx.shadowColor = gateColor;
        ctx.shadowBlur = 15;
        ctx.fillStyle = gateColor;

        // Left & right pylon
        ctx.fillRect(ox - 20, oy, 10, 95);
        ctx.fillRect(ox + 10, oy, 10, 95);

        // Top arch
        ctx.fillRect(ox - 20, oy, 40, 12);

        // Energy beam in center
        ctx.fillStyle = `${gateColor}66`;
        ctx.fillRect(ox - 10, oy + 12, 20, 83);

        // Floating Question Symbol
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('?', ox, oy + 55);

        ctx.shadowBlur = 0;
      }

      // 4. RUNNER HERO CHARACTER
      const rx = s.runnerX;
      const ry = s.runnerY;

      ctx.save();
      if (s.hurtTimer > 0 && Math.floor(s.hurtTimer / 4) % 2 === 0) {
        ctx.globalAlpha = 0.4;
      }

      // Motion running bounce
      const runCycle = Math.sin((s.worldOffset * 0.15)) * (s.isJumping ? 0 : 4);

      // Hero shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(rx + 15, s.groundY - 2, 22, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cyber Jetpack trail
      ctx.fillStyle = s.isJumping ? '#38bdf8' : '#34d399';
      ctx.shadowColor = s.isJumping ? '#38bdf8' : '#10b981';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(rx - 8, ry + 22 + runCycle, s.isJumping ? 6 : 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Legs animation
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';

      const leg1Angle = Math.sin(s.worldOffset * 0.2) * 14;
      const leg2Angle = -Math.sin(s.worldOffset * 0.2) * 14;

      // Leg 1
      ctx.beginPath();
      ctx.moveTo(rx + 10, ry + 36);
      ctx.lineTo(rx + 10 + leg1Angle, ry + 50);
      ctx.stroke();

      // Leg 2
      ctx.beginPath();
      ctx.moveTo(rx + 20, ry + 36);
      ctx.lineTo(rx + 20 + leg2Angle, ry + 50);
      ctx.stroke();

      // Body (Sci-fi Suit)
      const bodyGrad = ctx.createLinearGradient(rx, ry + 12, rx + 30, ry + 36);
      bodyGrad.addColorStop(0, '#0284c7');
      bodyGrad.addColorStop(1, '#0369a1');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.roundRect(rx + 5, ry + 14 + runCycle, 22, 22, 4);
      ctx.fill();

      // Chest Emblem (Glowing Core)
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(rx + 16, ry + 24 + runCycle, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Head & Visor
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(rx + 16, ry + 6 + runCycle, 10, 0, Math.PI * 2);
      ctx.fill();

      // Visor
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.roundRect(rx + 16, ry + 3 + runCycle, 10, 7, 2);
      ctx.fill();

      ctx.restore();

      // 5. PARTICLES (Jump dust, sparks, victory stars)
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.025;

        if (p.life <= 0) {
          s.particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, [lastAnswerCorrect]);

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-2xl flex flex-col select-none card-hover-lift">
      {/* TOP HUD BAR */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 border-b border-slate-800 text-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-emerald-400">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>QUIZ RUNNER 2D</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">CÂU HỎI</span>
            <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {currentQuestionIndex + 1} / {questions.length}
            </span>
          </div>
        </div>

        {/* Center: Hearts & Combo */}
        <div className="flex items-center gap-5">
          {/* Hearts */}
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-5 h-5 transition-transform ${
                  h <= hearts
                    ? 'text-rose-500 fill-rose-500 scale-100'
                    : 'text-slate-700 fill-transparent scale-90'
                }`}
              />
            ))}
          </div>

          {/* Combo */}
          {combo > 1 && (
            <div className="flex items-center gap-1 text-amber-300 font-bold text-xs bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 rounded-full animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>COMBO x{combo}</span>
            </div>
          )}
        </div>

        {/* Right: Score & Audio */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-extrabold text-base">
            <Trophy className="w-4 h-4" />
            <span>{score.toLocaleString()} ĐIỂM</span>
          </div>

          <button
            onClick={toggleSound}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2D CANVAS ARENA */}
      <div className="relative w-full h-[360px] md:h-[400px] overflow-hidden bg-slate-950">
        <canvas
          ref={canvasRef}
          width={960}
          height={400}
          className="w-full h-full object-cover block"
        />

        {/* START OVERLAY */}
        {engineState === 'START' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
              <Zap className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              {gameConfig.game_title}
            </h2>
            <p className="text-slate-300 text-sm max-w-md mb-6 leading-relaxed">
              Vượt qua các cánh cổng tri thức bằng cách trả lời đúng câu hỏi trắc nghiệm được trích xuất
              từ giáo án!
            </p>

            <button
              onClick={startGame}
              className="flex items-center gap-2 px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-500/30 button-step-press cursor-pointer"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>BẮT ĐẦU CHƠI NGAY (SPACE)</span>
            </button>
          </div>
        )}

        {/* GAME OVER OVERLAY */}
        {engineState === 'GAMEOVER' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mb-3">
              <XCircle className="w-8 h-8 text-rose-400" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">HẾT MẠNG RỒI!</h2>
            <p className="text-slate-300 text-sm max-w-md mb-5">
              Bạn đã hoàn thành một phần thử thách với tổng điểm{' '}
              <span className="text-emerald-400 font-bold">{score}</span>. Hãy rèn luyện thêm để vượt qua
              tất cả chướng ngại vật!
            </p>
            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl button-step-press cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Thử Lại</span>
              </button>
              <button
                onClick={handleFinishScreen}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl border border-slate-700 button-step-press cursor-pointer"
              >
                <span>Xem Báo Cáo Kết Quả</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* VICTORY OVERLAY */}
        {engineState === 'VICTORY' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-3 animate-pulse">
              <Trophy className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">CHIẾN THẮNG XUẤT SẮC!</h2>
            <p className="text-slate-300 text-sm max-w-md mb-5">
              Chúc mừng! Bạn đã hoàn thành toàn bộ câu hỏi trắc nghiệm của bài học với điểm số{' '}
              <span className="text-emerald-400 font-extrabold">{score}</span>!
            </p>
            <button
              onClick={handleFinishScreen}
              className="flex items-center gap-2 px-7 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-500/25 button-step-press cursor-pointer"
            >
              <span>XEM BẢNG TỔNG KẾT TRI THỨC</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* RUNNING SPEED INDICATOR */}
        {engineState === 'RUNNING' && (
          <div className="absolute top-4 left-6 bg-slate-900/80 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>ĐANG CHẠY ĐẾN CỔNG TRI THỨC TIẾP THEO...</span>
          </div>
        )}
      </div>

      {/* INTERACTIVE QUESTION PANEL (When Challenge or Feedback is active) */}
      {(engineState === 'CHALLENGE' || engineState === 'FEEDBACK') && (
        <div className="p-6 bg-white border-t border-slate-200 transition-all duration-300">
          {/* Header of Question */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-3">
              <span className="shrink-0 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg font-mono">
                CÂU {currentQuestionIndex + 1}
              </span>
              <h3 className="text-base md:text-lg font-bold text-slate-950 leading-snug">
                {currentQ.question_text}
              </h3>
            </div>

            {/* Countdown timer */}
            {engineState === 'CHALLENGE' && (
              <div className="shrink-0 flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 font-mono text-xs">
                <span className="text-slate-500 font-semibold">Thời gian:</span>
                <span
                  className={`font-bold ${
                    timeRemaining <= 5 ? 'text-rose-600 animate-pulse' : 'text-emerald-700'
                  }`}
                >
                  {timeRemaining}s
                </span>
              </div>
            )}
          </div>

          {/* 4 Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {currentQ.options.map((option, idx) => {
              const keyLabel = ['1', '2', '3', '4'][idx];
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === currentQ.correct_answer_index;

              let btnStyle =
                'bg-slate-50 border-slate-200 text-slate-800 hover:bg-emerald-50/40 hover:border-emerald-400 hover:text-emerald-950 shadow-xs button-step-press';

              if (engineState === 'FEEDBACK') {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20 shadow-xs';
                } else if (isSelected && !isCorrectAnswer) {
                  btnStyle = 'bg-rose-100 border-rose-500 text-rose-950 font-bold ring-2 ring-rose-500/20 shadow-xs';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={engineState === 'FEEDBACK'}
                  onClick={() => handleSelectAnswer(idx)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-sm transition-all duration-200 cursor-pointer ${btnStyle}`}
                >
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-slate-700 shadow-xs">
                    {keyLabel}
                  </span>
                  <span className="grow font-medium">{option}</span>
                  {engineState === 'FEEDBACK' && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {engineState === 'FEEDBACK' && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Pedagogical Explanation Box */}
          {engineState === 'FEEDBACK' && (
            <div
              className={`p-4 rounded-xl border mb-3 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200 ${
                lastAnswerCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {lastAnswerCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">CHÍNH XÁC! VƯỢT QUA CHƯỚNG NGẠI VẬT!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span className="text-rose-700">CHƯA ĐÚNG! BỊ TRỪ 1 MẠNG!</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <span className="font-semibold text-slate-900">Giải thích: </span>
                  {currentQ.explanation}
                </p>
                {currentQ.source_excerpt && (
                  <p className="text-[11px] text-slate-500 italic">
                    Căn cứ tài liệu: &ldquo;{currentQ.source_excerpt}&rdquo;
                  </p>
                )}
              </div>

              <button
                onClick={handleNextStep}
                className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs button-step-press cursor-pointer"
              >
                <span>TIẾP TỤC (ENTER)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* FOOTER BAR */}
      <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-4">
          <span>Phím tắt: [1-4] chọn đáp án · [Space] nhảy / bắt đầu · [Enter] tiếp tục</span>
        </div>
        <button
          onClick={onExit}
          className="text-slate-600 hover:text-slate-950 font-semibold transition-colors cursor-pointer"
        >
          Thoát Trò Chơi
        </button>
      </div>
    </div>
  );
};
