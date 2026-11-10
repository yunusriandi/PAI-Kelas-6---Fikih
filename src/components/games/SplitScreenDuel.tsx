/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  BasketType,
  CocokkanPair,
  DuelResult,
  GAME_TYPE_NAMES,
  GameSettings,
  HakimCilikQuestion,
  KeranjangItem,
  KilatQuestion,
  PilihanGandaQuestion,
  Team,
  TeamMember,
} from '../../types/game';
import { soundManager } from '../../utils/sound';
import { GameKilat } from './GameKilat';
import { GamePilihanGanda } from './GamePilihanGanda';
import { GameKeranjang } from './GameKeranjang';
import { GameCocokkan } from './GameCocokkan';
import { GameHakimCilik } from './GameHakimCilik';
import { ArrowRight, RotateCcw, Volume2, VolumeX, Sparkles, BookOpen } from 'lucide-react';

interface SplitScreenDuelProps {
  gameType: 1 | 2 | 3 | 4 | 5;
  teamA: Team;
  teamB: Team;
  playerA: TeamMember;
  playerB: TeamMember;
  settings: GameSettings;
  questions: {
    kilat: KilatQuestion[];
    pilihanGanda: PilihanGandaQuestion[];
    keranjang: KeranjangItem[];
    cocokkan: CocokkanPair[];
    hakimCilik: HakimCilikQuestion[];
  };
  onComplete: (result: DuelResult) => void;
  onExit: () => void;
}

export const SplitScreenDuel: React.FC<SplitScreenDuelProps> = ({
  gameType,
  teamA,
  teamB,
  playerA,
  playerB,
  settings,
  questions,
  onComplete,
  onExit,
}) => {
  // Phase: 'COUNTDOWN' | 'PLAYING' | 'EXPLANATION' | 'RESULT'
  const [phase, setPhase] = useState<'COUNTDOWN' | 'PLAYING' | 'EXPLANATION' | 'RESULT'>('COUNTDOWN');
  const [countdown, setCountdown] = useState<number>(3);

  // Scores & Stats
  const [scoreA, setScoreA] = useState<number>(0);
  const [scoreB, setScoreB] = useState<number>(0);
  const [correctA, setCorrectA] = useState<number>(0);
  const [correctB, setCorrectB] = useState<number>(0);
  const [totalTimeMsA, setTotalTimeMsA] = useState<number>(0);
  const [totalTimeMsB, setTotalTimeMsB] = useState<number>(0);

  // Question index and timer
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(settings.timePerQuestion);

  // Answer tracking per question
  const [answeredA, setAnsweredA] = useState<boolean>(false);
  const [answeredB, setAnsweredB] = useState<boolean>(false);
  const [feedbackA, setFeedbackA] = useState<{ isCorrect: boolean; points: number; note?: string } | null>(null);
  const [feedbackB, setFeedbackB] = useState<{ isCorrect: boolean; points: number; note?: string } | null>(null);

  // Specific selection tracking for PG / Hakim Cilik
  const [selectedIdxA, setSelectedIdxA] = useState<number | null>(null);
  const [selectedIdxB, setSelectedIdxB] = useState<number | null>(null);

  // Sound toggle
  const [isMuted, setIsMuted] = useState<boolean>(!settings.soundEnabled);

  // Track start time for speed bonus
  const questionStartTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Subset of questions based on game settings
  const [activeQuestions, setActiveQuestions] = useState<{
    kilat: KilatQuestion[];
    pilihanGanda: PilihanGandaQuestion[];
    keranjang: KeranjangItem[];
    cocokkan: CocokkanPair[];
    hakimCilik: HakimCilikQuestion[];
  }>(() => {
    const shuffleArray = <T,>(arr: T[]) => (settings.randomizeQuestions ? [...arr].sort(() => Math.random() - 0.5) : [...arr]);
    return {
      kilat: shuffleArray(questions.kilat).slice(0, settings.kilatCount),
      pilihanGanda: shuffleArray(questions.pilihanGanda).slice(0, settings.pilihanGandaCount),
      keranjang: shuffleArray(questions.keranjang).slice(0, settings.keranjangCount),
      cocokkan: shuffleArray(questions.cocokkan).slice(0, settings.cocokkanCount),
      hakimCilik: shuffleArray(questions.hakimCilik).slice(0, settings.hakimCilikCount),
    };
  });

  const totalQuestions =
    gameType === 1
      ? activeQuestions.kilat.length
      : gameType === 2
      ? activeQuestions.pilihanGanda.length
      : gameType === 3
      ? activeQuestions.keranjang.length
      : gameType === 4
      ? 1 // Game 4 runs as 1 board matching exercise
      : activeQuestions.hakimCilik.length;

  // Sync mute with soundManager
  useEffect(() => {
    soundManager.setMuted(isMuted);
  }, [isMuted]);

  // Initial countdown effect
  useEffect(() => {
    let count = 3;
    setCountdown(3);
    soundManager.playTick();

    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        soundManager.playTick();
      } else if (count === 0) {
        setCountdown(0);
        soundManager.playStart();
      } else {
        clearInterval(interval);
        setPhase('PLAYING');
        questionStartTimeRef.current = Date.now();
      }
    }, 900);

    return () => clearInterval(interval);
  }, []);

  // Timer countdown loop during PLAYING phase (except for Game 4 Cocokkan which has board-wide timer)
  useEffect(() => {
    if (phase !== 'PLAYING') return;

    setTimeLeft(settings.timePerQuestion);
    questionStartTimeRef.current = Date.now();

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          handleTimeExpire();
          return 0;
        }
        return Number((prev - 0.1).toFixed(1));
      });
    }, 100);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [currentIndex, phase]);

  // Handle when both players have answered or time expired
  const triggerNextOrExplanation = useCallback(() => {
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);

    const isLastQuestion = currentIndex >= totalQuestions - 1;

    advanceTimeoutRef.current = setTimeout(() => {
      if (settings.showExplanations && gameType !== 4) {
        setPhase('EXPLANATION');
      } else {
        if (isLastQuestion) {
          finishDuel();
        } else {
          advanceToNextQuestion();
        }
      }
    }, 1200);
  }, [currentIndex, totalQuestions, settings.showExplanations, gameType]);

  const advanceToNextQuestion = () => {
    setCurrentIndex((prev) => prev + 1);
    setAnsweredA(false);
    setAnsweredB(false);
    setFeedbackA(null);
    setFeedbackB(null);
    setSelectedIdxA(null);
    setSelectedIdxB(null);
    setPhase('PLAYING');
  };

  const handleTimeExpire = () => {
    // If not answered, mark as wrong
    if (!answeredA) {
      setAnsweredA(true);
      setFeedbackA({ isCorrect: false, points: 0 });
    }
    if (!answeredB) {
      setAnsweredB(true);
      setFeedbackB({ isCorrect: false, points: 0 });
    }
    triggerNextOrExplanation();
  };

  // Check if both answered to advance immediately
  useEffect(() => {
    if (gameType === 4) return; // Cocokkan handles completion independently
    if (answeredA && answeredB && phase === 'PLAYING') {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      triggerNextOrExplanation();
    }
  }, [answeredA, answeredB, phase, gameType, triggerNextOrExplanation]);

  // Scoring calculation
  const computeScore = (isCorrect: boolean): { points: number; elapsedMs: number } => {
    const elapsedMs = Date.now() - questionStartTimeRef.current;
    if (!isCorrect) {
      return { points: settings.wrongPenalty > 0 ? -settings.wrongPenalty : 0, elapsedMs };
    }
    let points = 100;
    if (settings.speedBonusEnabled) {
      const remainingRatio = Math.max(0, timeLeft / settings.timePerQuestion);
      const bonus = Math.round(remainingRatio * 100);
      points += bonus;
    }
    return { points, elapsedMs };
  };

  // Generic answer handler
  const processAnswer = (
    player: 'A' | 'B',
    isCorrect: boolean,
    optionIndex?: number,
    customNote?: string
  ) => {
    const { points, elapsedMs } = computeScore(isCorrect);

    if (isCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }

    if (player === 'A') {
      setAnsweredA(true);
      if (optionIndex !== undefined) setSelectedIdxA(optionIndex);
      setFeedbackA({ isCorrect, points, note: customNote });
      setScoreA((prev) => Math.max(0, prev + points));
      if (isCorrect) {
        setCorrectA((prev) => prev + 1);
        setTotalTimeMsA((prev) => prev + elapsedMs);
      }
    } else {
      setAnsweredB(true);
      if (optionIndex !== undefined) setSelectedIdxB(optionIndex);
      setFeedbackB({ isCorrect, points, note: customNote });
      setScoreB((prev) => Math.max(0, prev + points));
      if (isCorrect) {
        setCorrectB((prev) => prev + 1);
        setTotalTimeMsB((prev) => prev + elapsedMs);
      }
    }
  };

  // Game 1 Handler
  const handleKilatAnswer = (player: 'A' | 'B', isHalalChosen: boolean) => {
    const q = activeQuestions.kilat[currentIndex];
    const isCorrect = isHalalChosen === q.isHalal;
    processAnswer(player, isCorrect);
  };

  // Game 2 Handler
  const handlePGAmswer = (player: 'A' | 'B', selectedIndex: number) => {
    const q = activeQuestions.pilihanGanda[currentIndex];
    const isCorrect = selectedIndex === q.correctIndex;
    processAnswer(player, isCorrect, selectedIndex);
  };

  // Game 3 Handler
  const handleKeranjangSort = (player: 'A' | 'B', basket: BasketType) => {
    const q = activeQuestions.keranjang[currentIndex];
    const isCorrect = basket === q.correctBasket;
    processAnswer(player, isCorrect);
  };

  // Game 4 Handlers
  const handleCocokkanCorrect = (player: 'A' | 'B') => {
    soundManager.playCorrect();
    const points = 100;
    if (player === 'A') {
      setScoreA((prev) => prev + points);
      setCorrectA((prev) => prev + 1);
    } else {
      setScoreB((prev) => prev + points);
      setCorrectB((prev) => prev + 1);
    }
  };

  const handleCocokkanWrong = (_player: 'A' | 'B') => {
    soundManager.playWrong();
  };

  const [cocokkanFinishedA, setCocokkanFinishedA] = useState(false);
  const [cocokkanFinishedB, setCocokkanFinishedB] = useState(false);

  const handleCocokkanPlayerFinish = (player: 'A' | 'B', _finalScore: number, _matchedCount: number) => {
    soundManager.playVictory();
    if (player === 'A') {
      setCocokkanFinishedA(true);
      // Give speed bonus if first to finish
      if (!cocokkanFinishedB) {
        setScoreA((prev) => prev + 200); // 200 speed bonus for finishing first
      }
    } else {
      setCocokkanFinishedB(true);
      if (!cocokkanFinishedA) {
        setScoreB((prev) => prev + 200);
      }
    }

    // If both finished, end duel
    if ((player === 'A' && cocokkanFinishedB) || (player === 'B' && cocokkanFinishedA)) {
      setTimeout(() => finishDuel(), 1500);
    }
  };

  // Game 5 Handler
  const handleHakimCilikAnswer = (player: 'A' | 'B', optionIndex: number) => {
    const q = activeQuestions.hakimCilik[currentIndex];
    const opt = q.options[optionIndex];
    processAnswer(player, opt.isCorrect, optionIndex, opt.feedback);
  };

  // Finish Duel
  const finishDuel = () => {
    setPhase('RESULT');
    soundManager.playVictory();

    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  // Current explanation text for learning reinforcement
  const getCurrentExplanation = (): { title: string; text: string } => {
    switch (gameType) {
      case 1:
        return {
          title: activeQuestions.kilat[currentIndex]?.name || '',
          text: activeQuestions.kilat[currentIndex]?.explanation || '',
        };
      case 2:
        return {
          title: 'Analisis Kasus Syariat',
          text: activeQuestions.pilihanGanda[currentIndex]?.explanation || '',
        };
      case 3:
        return {
          title: activeQuestions.keranjang[currentIndex]?.name || '',
          text: activeQuestions.keranjang[currentIndex]?.explanation || '',
        };
      case 5:
        return {
          title: activeQuestions.hakimCilik[currentIndex]?.character || '',
          text: activeQuestions.hakimCilik[currentIndex]?.explanation || '',
        };
      default:
        return { title: '', text: '' };
    }
  };

  // Winner calculation
  let duelWinner: 'A' | 'B' | 'TIE' = 'TIE';
  if (scoreA > scoreB) duelWinner = 'A';
  else if (scoreB > scoreA) duelWinner = 'B';
  else {
    // Tiebreaker: fastest response time
    if (totalTimeMsA < totalTimeMsB && totalTimeMsA > 0) duelWinner = 'A';
    else if (totalTimeMsB < totalTimeMsA && totalTimeMsB > 0) duelWinner = 'B';
  }

  // Restart / Rematch Duel
  const handleRematch = () => {
    setScoreA(0);
    setScoreB(0);
    setCorrectA(0);
    setCorrectB(0);
    setTotalTimeMsA(0);
    setTotalTimeMsB(0);
    setCurrentIndex(0);
    setAnsweredA(false);
    setAnsweredB(false);
    setFeedbackA(null);
    setFeedbackB(null);
    setSelectedIdxA(null);
    setSelectedIdxB(null);
    setCocokkanFinishedA(false);
    setCocokkanFinishedB(false);
    setPhase('COUNTDOWN');
    setCountdown(3);

    // Reshuffle questions
    const shuffleArray = <T,>(arr: T[]) => (settings.randomizeQuestions ? [...arr].sort(() => Math.random() - 0.5) : [...arr]);
    setActiveQuestions({
      kilat: shuffleArray(questions.kilat).slice(0, settings.kilatCount),
      pilihanGanda: shuffleArray(questions.pilihanGanda).slice(0, settings.pilihanGandaCount),
      keranjang: shuffleArray(questions.keranjang).slice(0, settings.keranjangCount),
      cocokkan: shuffleArray(questions.cocokkan).slice(0, settings.cocokkanCount),
      hakimCilik: shuffleArray(questions.hakimCilik).slice(0, settings.hakimCilikCount),
    });
  };

  const handleFinishAndSave = () => {
    const duelResult: DuelResult = {
      gameType,
      gameName: GAME_TYPE_NAMES[gameType].name,
      playerAName: `${playerA.name} (${teamA.name})`,
      playerBName: `${playerB.name} (${teamB.name})`,
      scoreA,
      scoreB,
      winner: duelWinner,
      correctCountA: correctA,
      correctCountB: correctB,
      totalTimeMsA,
      totalTimeMsB,
    };
    onComplete(duelResult);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex flex-col font-sans select-none">
      {/* Background Islamic Architecture & Sky Atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src="/src/assets/images/islamic_skyline_bg_1794278454139.jpg"
          alt="Latar Belakang Islami"
          className="w-full h-full object-cover opacity-15 filter blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/80 to-slate-950/95" />
      </div>

      {/* Top Duel Header */}
      <header className="h-16 sm:h-20 bg-slate-900/90 backdrop-blur-md border-b-2 border-emerald-500/30 px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-lg z-20 text-white">
        {/* Player A Info */}
        <div className="flex items-center gap-2.5 sm:gap-3 max-w-[36%]">
          <div className="relative shrink-0">
            <div
              className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 shadow-md"
              style={{ borderColor: teamA.color }}
            >
              <img
                src="/src/assets/images/avatar_boy_student_1794278454764.jpg"
                alt="Pemain A Siswa Muslim"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center border border-white"
              style={{ backgroundColor: teamA.color }}
            >
              A
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-bold text-emerald-400 truncate flex items-center gap-1">
              <span>🕌</span>
              <span>{teamA.name}</span>
            </div>
            <div className="text-xs sm:text-sm md:text-base font-extrabold text-white truncate">
              {playerA.name}
            </div>
          </div>
          <div className="ml-1 sm:ml-2 px-2.5 sm:px-3 py-1 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded-xl font-black text-lg sm:text-2xl tabular-nums shadow-inner">
            {scoreA}
          </div>
        </div>

        {/* Center Match / Timer HUD */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-xl sm:text-2xl">{GAME_TYPE_NAMES[gameType].icon}</span>
            <h2 className="text-xs sm:text-sm md:text-base font-black text-amber-300 uppercase tracking-wide">
              {GAME_TYPE_NAMES[gameType].name}
            </h2>
          </div>

          {gameType !== 4 ? (
            <div className="flex items-center gap-2 sm:gap-3 mt-1">
              <span className="text-[11px] sm:text-xs font-bold text-slate-400">
                Soal {currentIndex + 1}/{totalQuestions}
              </span>
              <div className="w-20 sm:w-36 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className={`h-full transition-all duration-100 ${
                    timeLeft < 3 ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-500 to-amber-400'
                  }`}
                  style={{ width: `${(timeLeft / settings.timePerQuestion) * 100}%` }}
                />
              </div>
              <span className={`text-xs font-mono font-bold ${timeLeft < 3 ? 'text-rose-400 animate-pulse' : 'text-amber-300'}`}>
                {timeLeft.toFixed(1)}s
              </span>
            </div>
          ) : (
            <div className="text-[11px] sm:text-xs font-bold text-emerald-400 mt-1">
              Cocokkan seluruh 6 pasang kartu secepat mungkin!
            </div>
          )}
        </div>

        {/* Player B Info & Sound Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3 max-w-[36%] justify-end">
          <div className="mr-1 sm:mr-2 px-2.5 sm:px-3 py-1 bg-sky-950/80 border border-sky-500/50 text-sky-300 rounded-xl font-black text-lg sm:text-2xl tabular-nums shadow-inner">
            {scoreB}
          </div>
          <div className="min-w-0 text-right">
            <div className="text-[11px] sm:text-xs font-bold text-sky-400 truncate flex items-center justify-end gap-1">
              <span>{teamB.name}</span>
              <span>🕌</span>
            </div>
            <div className="text-xs sm:text-sm md:text-base font-extrabold text-white truncate">
              {playerB.name}
            </div>
          </div>
          <div className="relative shrink-0">
            <div
              className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 shadow-md"
              style={{ borderColor: teamB.color }}
            >
              <img
                src="/src/assets/images/avatar_girl_student_1794278454716.jpg"
                alt="Pemain B Siswi Muslimah"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center border border-white"
              style={{ backgroundColor: teamB.color }}
            >
              B
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 sm:p-2 ml-1 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* Main Split Screen Area */}
      <main className="flex-1 relative flex overflow-hidden">
        {/* Center Divider Visual */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-300 via-amber-300 to-sky-300 z-10 -translate-x-1/2 opacity-70 pointer-events-none" />

        {/* Dual Game Renders */}
        {gameType === 1 && (
          <GameKilat
            question={activeQuestions.kilat[currentIndex]}
            onAnswer={handleKilatAnswer}
            disabledA={answeredA}
            disabledB={answeredB}
            feedbackA={feedbackA}
            feedbackB={feedbackB}
          />
        )}

        {gameType === 2 && (
          <GamePilihanGanda
            question={activeQuestions.pilihanGanda[currentIndex]}
            onAnswer={handlePGAmswer}
            disabledA={answeredA}
            disabledB={answeredB}
            selectedA={selectedIdxA}
            selectedB={selectedIdxB}
            feedbackA={feedbackA}
            feedbackB={feedbackB}
          />
        )}

        {gameType === 3 && (
          <GameKeranjang
            item={activeQuestions.keranjang[currentIndex]}
            onSort={handleKeranjangSort}
            disabledA={answeredA}
            disabledB={answeredB}
            feedbackA={feedbackA}
            feedbackB={feedbackB}
          />
        )}

        {gameType === 4 && (
          <GameCocokkan
            pairs={activeQuestions.cocokkan}
            onPlayerFinish={handleCocokkanPlayerFinish}
            onCorrectMatch={handleCocokkanCorrect}
            onWrongMatch={handleCocokkanWrong}
          />
        )}

        {gameType === 5 && (
          <GameHakimCilik
            question={activeQuestions.hakimCilik[currentIndex]}
            onAnswer={handleHakimCilikAnswer}
            disabledA={answeredA}
            disabledB={answeredB}
            selectedA={selectedIdxA}
            selectedB={selectedIdxB}
            feedbackA={feedbackA}
            feedbackB={feedbackB}
          />
        )}
      </main>

      {/* Countdown 3-2-1 Overlay */}
      {phase === 'COUNTDOWN' && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-pop">
          <div className="text-amber-300 font-extrabold text-xl sm:text-2xl uppercase tracking-widest mb-3 flex items-center gap-2">
            <span>🌙</span>
            <span>{GAME_TYPE_NAMES[gameType].name}</span>
            <span>⭐</span>
          </div>

          {/* Versus Avatars in Countdown */}
          <div className="flex items-center gap-6 sm:gap-10 my-4">
            {/* Player A Avatar */}
            <div className="flex flex-col items-center">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl overflow-hidden border-4 shadow-xl mb-2"
                style={{ borderColor: teamA.color }}
              >
                <img
                  src="/src/assets/images/avatar_boy_student_1794278454764.jpg"
                  alt={playerA.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-extrabold text-white">{playerA.name}</span>
              <span className="text-xs text-emerald-400 font-semibold">{teamA.name}</span>
            </div>

            <div className="text-white font-black text-7xl sm:text-8xl md:text-9xl animate-pulse-glow px-4">
              {countdown === 0 ? 'MULAI!' : countdown}
            </div>

            {/* Player B Avatar */}
            <div className="flex flex-col items-center">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl overflow-hidden border-4 shadow-xl mb-2"
                style={{ borderColor: teamB.color }}
              >
                <img
                  src="/src/assets/images/avatar_girl_student_1794278454716.jpg"
                  alt={playerB.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-extrabold text-white">{playerB.name}</span>
              <span className="text-xs text-sky-400 font-semibold">{teamB.name}</span>
            </div>
          </div>

          <p className="text-amber-200/90 text-xs sm:text-sm font-semibold max-w-md text-center px-4">
            Bersiaplah! Jawab secepat dan setepat mungkin untuk meraih bonus skor tertinggi!
          </p>
        </div>
      )}

      {/* Brief Educational Explanation Modal (between questions) */}
      {phase === 'EXPLANATION' && (
        <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-6 z-40 animate-pop">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border-4 border-emerald-400 shadow-2xl flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-2">
              Hikmah & Pembahasan Syariat
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">
              {getCurrentExplanation().title}
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-6">
              "{getCurrentExplanation().text}"
            </p>

            <button
              type="button"
              onClick={() => {
                if (currentIndex >= totalQuestions - 1) {
                  finishDuel();
                } else {
                  advanceToNextQuestion();
                }
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-lg shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span>{currentIndex >= totalQuestions - 1 ? 'Lihat Hasil Duel' : 'Lanjut Soal Berikutnya'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Final Duel Result Screen Modal */}
      {phase === 'RESULT' && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-50 animate-pop">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border-4 border-amber-300 shadow-2xl flex flex-col items-center text-center">
            <div className="text-5xl sm:text-6xl mb-2">🏆</div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full mb-1">
              Hasil Akhir {GAME_TYPE_NAMES[gameType].name}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
              {duelWinner === 'A'
                ? `Pemenang: ${playerA.name}!`
                : duelWinner === 'B'
                ? `Pemenang: ${playerB.name}!`
                : 'HASIL IMBANG / SERI!'}
            </h3>

            {/* Duel Score Comparison Cards */}
            <div className="grid grid-cols-2 gap-4 w-full my-4">
              {/* Player A Card */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border-2 flex flex-col items-center ${
                  duelWinner === 'A'
                    ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div
                  className="w-14 h-14 rounded-2xl overflow-hidden border-2 shadow-md mb-2"
                  style={{ borderColor: teamA.color }}
                >
                  <img
                    src="/src/assets/images/avatar_boy_student_1794278454764.jpg"
                    alt={playerA.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-extrabold text-base sm:text-lg text-slate-800 truncate max-w-full">
                  {playerA.name}
                </div>
                <div className="text-xs text-slate-500 font-semibold mb-2">
                  {teamA.name}
                </div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-700 tabular-nums">
                  {scoreA}
                </div>
                <div className="text-xs text-slate-600 mt-2">
                  Benar: <span className="font-bold text-emerald-600">{correctA}</span> soal
                </div>
              </div>

              {/* Player B Card */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border-2 flex flex-col items-center ${
                  duelWinner === 'B'
                    ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div
                  className="w-14 h-14 rounded-2xl overflow-hidden border-2 shadow-md mb-2"
                  style={{ borderColor: teamB.color }}
                >
                  <img
                    src="/src/assets/images/avatar_girl_student_1794278454716.jpg"
                    alt={playerB.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-extrabold text-base sm:text-lg text-slate-800 truncate max-w-full">
                  {playerB.name}
                </div>
                <div className="text-xs text-slate-500 font-semibold mb-2">
                  {teamB.name}
                </div>
                <div className="text-3xl sm:text-4xl font-black text-sky-700 tabular-nums">
                  {scoreB}
                </div>
                <div className="text-xs text-slate-600 mt-2">
                  Benar: <span className="font-bold text-sky-600">{correctB}</span> soal
                </div>
              </div>
            </div>

            {/* Tiebreaker Note */}
            {scoreA === scoreB && (
              <p className="text-xs font-semibold text-slate-500 mb-4">
                *Skor seri. Kecepatan respon benar:{' '}
                {playerA.name} ({(totalTimeMsA / 1000).toFixed(2)}s) vs {playerB.name} ({(totalTimeMsB / 1000).toFixed(2)}s).
              </p>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 w-full mt-2">
              <button
                type="button"
                onClick={handleRematch}
                className="py-3.5 px-4 rounded-2xl border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Ulangi Duel</span>
              </button>
              <button
                type="button"
                onClick={handleFinishAndSave}
                className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Simpan & Lanjut</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
