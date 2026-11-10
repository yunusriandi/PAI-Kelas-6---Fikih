/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { KilatQuestion } from '../../types/game';
import { Check, X } from 'lucide-react';

interface GameKilatProps {
  question: KilatQuestion;
  onAnswer: (player: 'A' | 'B', isHalalChosen: boolean) => void;
  disabledA: boolean;
  disabledB: boolean;
  feedbackA: { isCorrect: boolean; points: number } | null;
  feedbackB: { isCorrect: boolean; points: number } | null;
}

export const GameKilat: React.FC<GameKilatProps> = ({
  question,
  onAnswer,
  disabledA,
  disabledB,
  feedbackA,
  feedbackB,
}) => {
  return (
    <div className="flex-1 grid grid-cols-2 divide-x-4 divide-emerald-200/40 h-full w-full select-none">
      {/* Player A Half */}
      <div
        className={`flex flex-col justify-between p-6 sm:p-8 transition-colors duration-200 ${
          feedbackA
            ? feedbackA.isCorrect
              ? 'bg-emerald-500/15'
              : 'bg-rose-500/15'
            : 'bg-transparent'
        }`}
      >
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-7xl sm:text-8xl md:text-9xl mb-4 transition-transform hover:scale-105 active:scale-95">
            {question.emoji}
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight max-w-sm">
            {question.name}
          </h3>
          <p className="mt-2 text-sm sm:text-base font-semibold text-slate-500">
            Pemain A: Tentukan Hukumnya!
          </p>

          {/* Player A Feedback Overlay */}
          {feedbackA && (
            <div className={`mt-4 px-6 py-2 rounded-2xl font-black text-xl sm:text-2xl animate-pop ${
              feedbackA.isCorrect ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
            }`}>
              {feedbackA.isCorrect ? `+${feedbackA.points} TEPAT!` : 'SALAH!'}
            </div>
          )}
        </div>

        {/* Buttons for Player A */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button
            type="button"
            disabled={disabledA}
            onClick={() => onAnswer('A', true)}
            className="flex flex-col items-center justify-center gap-2 py-6 sm:py-8 px-4 rounded-3xl bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 active:scale-95 text-white font-black text-2xl sm:text-3xl shadow-xl shadow-emerald-600/30 border-4 border-emerald-300 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Check className="w-8 h-8 sm:w-10 sm:h-10 stroke-[3]" />
            </div>
            <span>HALAL</span>
          </button>

          <button
            type="button"
            disabled={disabledA}
            onClick={() => onAnswer('A', false)}
            className="flex flex-col items-center justify-center gap-2 py-6 sm:py-8 px-4 rounded-3xl bg-gradient-to-b from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 active:scale-95 text-white font-black text-2xl sm:text-3xl shadow-xl shadow-rose-600/30 border-4 border-rose-300 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center">
              <X className="w-8 h-8 sm:w-10 sm:h-10 stroke-[3]" />
            </div>
            <span>HARAM</span>
          </button>
        </div>
      </div>

      {/* Player B Half */}
      <div
        className={`flex flex-col justify-between p-6 sm:p-8 transition-colors duration-200 ${
          feedbackB
            ? feedbackB.isCorrect
              ? 'bg-emerald-500/15'
              : 'bg-rose-500/15'
            : 'bg-transparent'
        }`}
      >
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-7xl sm:text-8xl md:text-9xl mb-4 transition-transform hover:scale-105 active:scale-95">
            {question.emoji}
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight max-w-sm">
            {question.name}
          </h3>
          <p className="mt-2 text-sm sm:text-base font-semibold text-slate-500">
            Pemain B: Tentukan Hukumnya!
          </p>

          {/* Player B Feedback Overlay */}
          {feedbackB && (
            <div className={`mt-4 px-6 py-2 rounded-2xl font-black text-xl sm:text-2xl animate-pop ${
              feedbackB.isCorrect ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
            }`}>
              {feedbackB.isCorrect ? `+${feedbackB.points} TEPAT!` : 'SALAH!'}
            </div>
          )}
        </div>

        {/* Buttons for Player B */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button
            type="button"
            disabled={disabledB}
            onClick={() => onAnswer('B', true)}
            className="flex flex-col items-center justify-center gap-2 py-6 sm:py-8 px-4 rounded-3xl bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 active:scale-95 text-white font-black text-2xl sm:text-3xl shadow-xl shadow-emerald-600/30 border-4 border-emerald-300 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Check className="w-8 h-8 sm:w-10 sm:h-10 stroke-[3]" />
            </div>
            <span>HALAL</span>
          </button>

          <button
            type="button"
            disabled={disabledB}
            onClick={() => onAnswer('B', false)}
            className="flex flex-col items-center justify-center gap-2 py-6 sm:py-8 px-4 rounded-3xl bg-gradient-to-b from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 active:scale-95 text-white font-black text-2xl sm:text-3xl shadow-xl shadow-rose-600/30 border-4 border-rose-300 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center">
              <X className="w-8 h-8 sm:w-10 sm:h-10 stroke-[3]" />
            </div>
            <span>HARAM</span>
          </button>
        </div>
      </div>
    </div>
  );
};
