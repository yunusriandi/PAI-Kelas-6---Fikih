/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  DuelResult,
  GAME_TYPE_NAMES,
  GameSettings,
  QuestionBank,
  Team,
  TournamentMatch,
} from '../../types/game';
import { SplitScreenDuel } from '../games/SplitScreenDuel';
import { determineMatchWinner } from '../../utils/bracket';
import { addHistoryRecord } from '../../utils/storage';
import { ArrowRight, Trophy, Play, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MatchDuelRunnerProps {
  match: TournamentMatch;
  teamA: Team;
  teamB: Team;
  settings: GameSettings;
  questions: QuestionBank;
  onMatchComplete: (matchId: string, winnerId: string, duels: DuelResult[]) => void;
  onExit: () => void;
}

export const MatchDuelRunner: React.FC<MatchDuelRunnerProps> = ({
  match,
  teamA,
  teamB,
  settings,
  questions,
  onMatchComplete,
  onExit,
}) => {
  // Current duel index (0 to 4, representing Game 1 to 5)
  const [currentDuelIndex, setCurrentDuelIndex] = useState<number>(() => {
    return match.duels.length; // Resume from where it was if partially played
  });

  const [duels, setDuels] = useState<DuelResult[]>(match.duels || []);
  const [isIntermission, setIsIntermission] = useState<boolean>(true);
  const [isMatchFinished, setIsMatchFinished] = useState<boolean>(false);

  // Current active game type (1 to 5)
  const activeGameType = (currentDuelIndex + 1) as 1 | 2 | 3 | 4 | 5;

  const playerA = teamA.members.find((m) => m.gameType === activeGameType) || teamA.members[currentDuelIndex] || {
    id: `pA-${activeGameType}`,
    name: `Anggota ${activeGameType}`,
    gameType: activeGameType,
  };

  const playerB = teamB.members.find((m) => m.gameType === activeGameType) || teamB.members[currentDuelIndex] || {
    id: `pB-${activeGameType}`,
    name: `Anggota ${activeGameType}`,
    gameType: activeGameType,
  };

  const handleDuelComplete = (result: DuelResult) => {
    const updatedDuels = [...duels, result];
    setDuels(updatedDuels);

    // Save history record
    addHistoryRecord({
      id: `rec-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      matchId: match.id,
      gameType: result.gameType,
      gameName: result.gameName,
      teamAName: teamA.name,
      teamBName: teamB.name,
      playerAName: result.playerAName,
      playerBName: result.playerBName,
      scoreA: result.scoreA,
      scoreB: result.scoreB,
      winnerName: result.winner === 'A' ? teamA.name : result.winner === 'B' ? teamB.name : 'Seri',
    });

    if (currentDuelIndex < 4) {
      setCurrentDuelIndex((prev) => prev + 1);
      setIsIntermission(true);
    } else {
      setIsMatchFinished(true);
      try {
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
      } catch {}
    }
  };

  // If match completed, calculate outcome
  const matchResult = isMatchFinished
    ? determineMatchWinner(duels, teamA.id, teamB.id)
    : null;

  const winningTeam = matchResult
    ? matchResult.winnerId === teamA.id
      ? teamA
      : teamB
    : null;

  // Intermission Screen before each duel
  if (isIntermission && !isMatchFinished) {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-12 select-none">
        {/* Background Islamic Skyline Texture */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/src/assets/images/islamic_skyline_bg_1794278454139.jpg"
            alt="Latar Belakang Islami"
            className="w-full h-full object-cover opacity-25 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/90" />
        </div>

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚔️</span>
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <span>🕌</span>
                <span>{match.roundName}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                {teamA.name} VS {teamB.name}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onExit}
            className="text-sm font-semibold text-slate-400 hover:text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
          >
            Kembali ke Bagan
          </button>
        </div>

        {/* Center Spotlight */}
        <div className="relative z-10 max-w-2xl mx-auto w-full text-center py-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 font-black text-sm mb-3 border border-amber-400/40 shadow-lg">
            <span>{GAME_TYPE_NAMES[activeGameType].icon}</span>
            <span>DUEL KE-{activeGameType} DARI 5</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-2">
            {GAME_TYPE_NAMES[activeGameType].name}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mb-6 max-w-lg mx-auto">
            {GAME_TYPE_NAMES[activeGameType].desc}
          </p>

          {/* Versus Card with Muslim Student Avatars */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-amber-400/30 shadow-2xl">
            {/* Player A */}
            <div className="flex flex-col items-center">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-4 shadow-xl mb-3"
                style={{ borderColor: teamA.color }}
              >
                <img
                  src="/src/assets/images/avatar_boy_student_1794278454764.jpg"
                  alt={playerA.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs text-emerald-400 font-bold mb-1">
                {teamA.name}
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-white">
                {playerA.name}
              </h3>
              <span className="mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Pemain A (Layar Kiri)
              </span>
            </div>

            {/* Player B */}
            <div className="flex flex-col items-center">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-4 shadow-xl mb-3"
                style={{ borderColor: teamB.color }}
              >
                <img
                  src="/src/assets/images/avatar_girl_student_1794278454716.jpg"
                  alt={playerB.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs text-sky-400 font-bold mb-1">
                {teamB.name}
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-white">
                {playerB.name}
              </h3>
              <span className="mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40">
                Pemain B (Layar Kanan)
              </span>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="max-w-md mx-auto w-full">
          <button
            type="button"
            onClick={() => setIsIntermission(false)}
            className="w-full py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-white font-black text-xl sm:text-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-6 h-6 fill-white" />
            <span>MASUK KE ARENA DUEL</span>
          </button>
        </div>
      </div>
    );
  }

  // Active Duel Split Screen
  if (!isMatchFinished) {
    return (
      <SplitScreenDuel
        gameType={activeGameType}
        teamA={teamA}
        teamB={teamB}
        playerA={playerA}
        playerB={playerB}
        settings={settings}
        questions={questions}
        onComplete={handleDuelComplete}
        onExit={onExit}
      />
    );
  }

  // Match Summary & Recap Screen (All 5 Duels completed)
  return (
    <div className="w-screen h-screen bg-slate-900 text-white flex flex-col justify-between p-6 sm:p-10 select-none overflow-y-auto">
      <div className="max-w-3xl mx-auto w-full">
        {/* Victory Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-amber-500/20 rounded-2xl text-amber-400 mb-2 border border-amber-500/30">
            <Trophy className="w-10 h-10" />
          </div>
          <div className="text-xs uppercase tracking-widest text-amber-400 font-black">
            HASIL AKHIR PERTANDINGAN
          </div>
          <h1 className="text-3xl sm:text-5xl font-black mt-1">
            {winningTeam ? `${winningTeam.name} Lolos!` : 'Hasil Imbang'}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            Skor Duel: <span className="text-emerald-400 font-bold">{teamA.name} ({matchResult?.winsA})</span> vs{' '}
            <span className="text-sky-400 font-bold">{teamB.name} ({matchResult?.winsB})</span>
            {matchResult && matchResult.winsA === matchResult.winsB && (
              <span className="block text-xs text-amber-300 mt-1">
                *Duel seri 2.5-2.5 dipecahkan oleh total poin: {matchResult.totalScoreA} vs {matchResult.totalScoreB}
              </span>
            )}
          </p>
        </div>

        {/* 5 Duels Breakdown Table */}
        <div className="bg-slate-800/80 rounded-3xl border border-slate-700 p-4 sm:p-6 mb-6">
          <h3 className="text-base font-bold text-slate-300 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Rincian 5 Duel Antar Anggota</span>
          </h3>

          <div className="space-y-3">
            {duels.map((d, idx) => {
              const wonA = d.winner === 'A';
              const wonB = d.winner === 'B';

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/60 text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-2.5 w-1/3">
                    <span className="text-base">{GAME_TYPE_NAMES[d.gameType].icon}</span>
                    <div className="truncate">
                      <div className="font-extrabold text-white truncate">{d.gameName}</div>
                      <div className="text-[11px] text-slate-400 truncate">{d.playerAName} vs {d.playerBName}</div>
                    </div>
                  </div>

                  {/* Score A */}
                  <div className={`px-3 py-1 rounded-lg font-black text-sm tabular-nums ${wonA ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/50' : 'text-slate-400'}`}>
                    {d.scoreA}
                  </div>

                  <span className="text-slate-500 font-bold">-</span>

                  {/* Score B */}
                  <div className={`px-3 py-1 rounded-lg font-black text-sm tabular-nums ${wonB ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/50' : 'text-slate-400'}`}>
                    {d.scoreB}
                  </div>

                  {/* Winner Pill */}
                  <div className="w-24 text-right">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                      wonA ? 'bg-emerald-900/60 text-emerald-300' : wonB ? 'bg-sky-900/60 text-sky-300' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {wonA ? teamA.name.slice(0, 8) : wonB ? teamB.name.slice(0, 8) : 'Seri'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              setDuels([]);
              setCurrentDuelIndex(0);
              setIsIntermission(true);
              setIsMatchFinished(false);
            }}
            className="py-4 rounded-2xl border-2 border-slate-700 hover:bg-slate-800 text-slate-300 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Tanding Ulang Pertandingan</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (winningTeam) {
                onMatchComplete(match.id, winningTeam.id, duels);
              }
            }}
            className="py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-base shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Perbarui Bagan & Lanjut</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
