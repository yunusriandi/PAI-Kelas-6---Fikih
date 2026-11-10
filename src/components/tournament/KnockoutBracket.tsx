/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Team, TournamentMatch } from '../../types/game';
import { Trophy, Shuffle, RotateCcw, Swords, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { IMAGES } from '../../constants/images';

interface KnockoutBracketProps {
  teams: Team[];
  matches: TournamentMatch[];
  onSelectMatch: (match: TournamentMatch) => void;
  onShuffleBracket: () => void;
  onResetTournament: () => void;
  onBackToMenu: () => void;
}

export const KnockoutBracket: React.FC<KnockoutBracketProps> = ({
  teams,
  matches,
  onSelectMatch,
  onShuffleBracket,
  onResetTournament,
  onBackToMenu,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Group matches by round (1, 2, 3)
  const rounds = Array.from(new Set(matches.map((m) => m.round))).sort((a, b) => a - b);

  // Find final match and champion
  const finalMatch = matches.find((m) => m.roundName.includes('Final') || m.round === Math.max(...rounds, 1));
  const championTeam = finalMatch && finalMatch.winnerId ? teams.find((t) => t.id === finalMatch.winnerId) : null;

  // Trigger confetti when champion is crowned
  useEffect(() => {
    if (championTeam) {
      try {
        confetti({
          particleCount: 150,
          spread: 120,
          origin: { y: 0.4 },
        });
      } catch {}
    }
  }, [championTeam]);

  const getTeam = (teamId: string | null): Team | null => {
    if (!teamId) return null;
    return teams.find((t) => t.id === teamId) || null;
  };

  const getRoundLabel = (roundNum: number, maxRound: number): string => {
    if (roundNum === maxRound) return 'Babak Final';
    if (roundNum === maxRound - 1) return 'Babak Semifinal';
    return 'Babak Penyisihan';
  };

  return (
    <div className="relative w-screen h-screen bg-slate-950 text-white flex flex-col font-sans select-none overflow-hidden">
      {/* Background Islamic Architecture & Sky Atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src={IMAGES.islamicBg}
          onError={(e) => {
            e.currentTarget.src = IMAGES.fallbacks.islamicBg;
          }}
          alt="Latar Belakang Islami"
          className="w-full h-full object-cover opacity-15 filter blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/80 to-slate-950/95" />
      </div>

      {/* Top Navbar */}
      <header className="relative h-16 sm:h-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 sm:px-10 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
              Bagan Sistem Gugur (Knockout)
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Turnamen Antar Kelompok ({teams.length} Kelompok Bertanding)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onShuffleBracket}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold border border-slate-700 transition-colors cursor-pointer"
            title="Acak undian bagan turnamen"
          >
            <Shuffle className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Acak Undian</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-200 hover:text-rose-200 text-xs sm:text-sm font-bold border border-slate-700 transition-colors cursor-pointer"
            title="Reset seluruh hasil turnamen"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">Reset Turnamen</span>
          </button>

          <button
            type="button"
            onClick={onBackToMenu}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black transition-colors cursor-pointer shadow-md shadow-emerald-600/20"
          >
            Menu Utama
          </button>
        </div>
      </header>

      {/* Main Bracket Field */}
      <main className="flex-1 overflow-x-auto overflow-y-auto p-6 sm:p-10 flex flex-col justify-center items-center">
        {/* Grand Champion Celebration Banner if completed */}
        {championTeam && (
          <div className="mb-6 w-full max-w-2xl bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border-2 border-amber-400 rounded-3xl p-6 text-center animate-pop shadow-2xl shadow-amber-500/20">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" />
              <span>JUARA UTAMA TURNAMEN DUEL HALAL HARAM</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              🎉 {championTeam.name} 🎉
            </h2>
            <p className="text-amber-200 text-sm sm:text-base font-semibold mt-2">
              Selamat kepada seluruh 5 anggota kelompok atas pemahaman fiqih halal & haram yang luar biasa!
            </p>
          </div>
        )}

        {/* Tree Bracket Columns */}
        <div className="flex items-center justify-center gap-6 sm:gap-12 min-w-max my-auto">
          {rounds.map((roundNum) => {
            const roundMatches = matches.filter((m) => m.round === roundNum);
            const maxRound = Math.max(...rounds);
            const label = getRoundLabel(roundNum, maxRound);

            return (
              <div key={roundNum} className="flex flex-col items-center">
                <div className="mb-4 text-center">
                  <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                    {label}
                  </span>
                </div>

                <div className="flex flex-col justify-around gap-6 sm:gap-8">
                  {roundMatches.map((m) => {
                    const teamA = getTeam(m.teamAId);
                    const teamB = getTeam(m.teamBId);
                    const isReady = teamA && teamB && !m.isCompleted;
                    const isFinished = m.isCompleted;

                    let winsA = 0;
                    let winsB = 0;
                    m.duels.forEach((d) => {
                      if (d.winner === 'A') winsA++;
                      if (d.winner === 'B') winsB++;
                    });

                    return (
                      <div
                        key={m.id}
                        onClick={() => {
                          if (isReady || isFinished) onSelectMatch(m);
                        }}
                        className={`w-64 sm:w-72 bg-slate-800/90 rounded-2xl p-4 border-2 transition-all shadow-lg ${
                          isReady
                            ? 'border-emerald-500 hover:border-emerald-400 hover:scale-105 cursor-pointer ring-4 ring-emerald-500/20'
                            : isFinished
                            ? 'border-slate-700 hover:border-slate-600 cursor-pointer'
                            : 'border-slate-800 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2.5">
                          <span>{m.roundName}</span>
                          <span
                            className={`px-2 py-0.5 rounded-md ${
                              isFinished
                                ? 'bg-emerald-950 text-emerald-400'
                                : isReady
                                ? 'bg-amber-950 text-amber-400 animate-pulse'
                                : 'bg-slate-900 text-slate-500'
                            }`}
                          >
                            {isFinished ? 'Selesai' : isReady ? 'Siap Tanding' : 'Menunggu'}
                          </span>
                        </div>

                        {/* Team A Slot */}
                        <div
                          className={`flex items-center justify-between p-2.5 rounded-xl mb-1.5 transition-colors ${
                            m.winnerId === teamA?.id
                              ? 'bg-emerald-900/40 border border-emerald-500/50'
                              : 'bg-slate-900/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className="w-3.5 h-3.5 rounded-md shrink-0"
                              style={{ backgroundColor: teamA ? teamA.color : '#475569' }}
                            />
                            <span className="text-xs sm:text-sm font-bold text-white truncate">
                              {teamA ? teamA.name : 'Pemenang Babak Lalu'}
                            </span>
                          </div>
                          {isFinished && teamA && (
                            <span className="font-mono font-black text-xs sm:text-sm text-emerald-300 ml-2">
                              {winsA}
                            </span>
                          )}
                        </div>

                        {/* Team B Slot */}
                        <div
                          className={`flex items-center justify-between p-2.5 rounded-xl transition-colors ${
                            m.winnerId === teamB?.id
                              ? 'bg-emerald-900/40 border border-emerald-500/50'
                              : 'bg-slate-900/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className="w-3.5 h-3.5 rounded-md shrink-0"
                              style={{ backgroundColor: teamB ? teamB.color : '#475569' }}
                            />
                            <span className="text-xs sm:text-sm font-bold text-white truncate">
                              {teamB ? teamB.name : 'Pemenang Babak Lalu'}
                            </span>
                          </div>
                          {isFinished && teamB && (
                            <span className="font-mono font-black text-xs sm:text-sm text-sky-300 ml-2">
                              {winsB}
                            </span>
                          )}
                        </div>

                        {/* CTA helper */}
                        {isReady && (
                          <div className="mt-3 pt-2 border-t border-slate-700/80 flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-black">
                            <Swords className="w-3.5 h-3.5" />
                            <span>Klik untuk Mulai Duel</span>
                          </div>
                        )}
                        {isFinished && (
                          <div className="mt-2 text-center text-[10px] text-slate-400 font-semibold">
                            Lihat Rincian Duel
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-pop">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-rose-500/60 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">Reset Turnamen?</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Seluruh skor, riwayat duel pertandingan, dan posisi bagan akan dihapus dan diatur ulang ke babak awal.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-sm transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetTournament();
                }}
                className="py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm transition-colors shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                Ya, Reset Turnamen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
