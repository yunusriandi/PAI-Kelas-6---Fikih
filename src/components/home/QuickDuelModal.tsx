/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GAME_TYPE_NAMES, Team, TeamMember } from '../../types/game';
import { X, Play, Swords } from 'lucide-react';
import { IMAGES } from '../../constants/images';

interface QuickDuelModalProps {
  teams: Team[];
  onStartDuel: (gameType: 1 | 2 | 3 | 4 | 5, teamA: Team, teamB: Team, playerA: TeamMember, playerB: TeamMember) => void;
  onClose: () => void;
}

export const QuickDuelModal: React.FC<QuickDuelModalProps> = ({
  teams,
  onStartDuel,
  onClose,
}) => {
  const [selectedGameType, setSelectedGameType] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [teamAIndex, setTeamAIndex] = useState<number>(0);
  const [teamBIndex, setTeamBIndex] = useState<number>(1);

  const teamA = teams[teamAIndex] || teams[0];
  const teamB = teams[teamBIndex] || teams[1] || teams[0];

  const playerA =
    teamA.members.find((m) => m.gameType === selectedGameType) || teamA.members[0];
  const playerB =
    teamB.members.find((m) => m.gameType === selectedGameType) || teamB.members[0];

  const handleStart = () => {
    onStartDuel(selectedGameType, teamA, teamB, playerA, playerB);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-50 animate-pop font-sans">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border-2 border-emerald-500 shadow-2xl text-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Swords className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Duel Kilat Bebas (Eksibisi)</h3>
              <p className="text-xs text-slate-500">Pilih tipe game dan 2 kelompok untuk latihan langsung</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Pick Game Type */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Pilih Jenis Duel Game:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[1, 2, 3, 4, 5].map((g) => {
                const info = GAME_TYPE_NAMES[g];
                const isSelected = selectedGameType === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGameType(g as 1 | 2 | 3 | 4 | 5)}
                    className={`p-3 rounded-2xl border-2 text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 font-bold ring-2 ring-emerald-300'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{info.icon}</span>
                    <div className="truncate">
                      <div className="text-xs font-black truncate">{info.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{info.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Select Teams */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* Team A */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Pemain A (Layar Kiri)
                </span>
                <select
                  value={teamAIndex}
                  onChange={(e) => setTeamAIndex(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-800 outline-none focus:border-emerald-500 cursor-pointer mb-2"
                >
                  {teams.map((t, idx) => (
                    <option key={t.id} value={idx}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200">
                <div className="w-6 h-6 rounded-lg overflow-hidden shrink-0 border border-emerald-400">
                  <img
                    src={IMAGES.avatarBoy}
                    onError={(e) => {
                      e.currentTarget.src = IMAGES.fallbacks.avatarBoy;
                    }}
                    alt={playerA.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="truncate">{playerA.name}</span>
              </div>
            </div>

            {/* Team B */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Pemain B (Layar Kanan)
                </span>
                <select
                  value={teamBIndex}
                  onChange={(e) => setTeamBIndex(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-800 outline-none focus:border-emerald-500 cursor-pointer mb-2"
                >
                  {teams.map((t, idx) => (
                    <option key={t.id} value={idx}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1.5 rounded-xl border border-sky-200">
                <div className="w-6 h-6 rounded-lg overflow-hidden shrink-0 border border-sky-400">
                  <img
                    src={IMAGES.avatarGirl}
                    onError={(e) => {
                      e.currentTarget.src = IMAGES.fallbacks.avatarGirl;
                    }}
                    alt={playerB.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="truncate">{playerB.name}</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleStart}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-lg shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Mulai Duel Eksibisi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
