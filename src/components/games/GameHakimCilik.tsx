/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HakimCilikQuestion } from '../../types/game';

interface GameHakimCilikProps {
  question: HakimCilikQuestion;
  onAnswer: (player: 'A' | 'B', optionIndex: number) => void;
  disabledA: boolean;
  disabledB: boolean;
  selectedA: number | null;
  selectedB: number | null;
  feedbackA: { isCorrect: boolean; points: number; note?: string } | null;
  feedbackB: { isCorrect: boolean; points: number; note?: string } | null;
}

export const GameHakimCilik: React.FC<GameHakimCilikProps> = ({
  question,
  onAnswer,
  disabledA,
  disabledB,
  selectedA,
  selectedB,
  feedbackA,
  feedbackB,
}) => {
  const renderSide = (
    player: 'A' | 'B',
    disabled: boolean,
    selected: number | null,
    feedback: { isCorrect: boolean; points: number; note?: string } | null
  ) => {
    return (
      <div
        className={`flex flex-col justify-between p-4 sm:p-6 transition-colors duration-200 h-full overflow-y-auto ${
          feedback
            ? feedback.isCorrect
              ? 'bg-emerald-500/10'
              : 'bg-rose-500/10'
            : 'bg-transparent'
        }`}
      >
        {/* Scenario Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-4 sm:p-5 border-2 border-emerald-200/80 shadow-md">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span>⚖️</span>
              <span>Hakim Cilik {player}: {question.character}</span>
            </span>
            {feedback && (
              <span
                className={`text-sm font-black px-3 py-1 rounded-full animate-pop ${
                  feedback.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {feedback.isCorrect ? `+${feedback.points} ADIL & BIJAK` : 'KURANG TEPAT'}
              </span>
            )}
          </div>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
            {question.scenario}
          </p>
          <div className="mt-2 pt-2 border-t border-slate-100">
            <p className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
              {question.question}
            </p>
          </div>
          {feedback && (
            <div
              className={`mt-3 p-3 rounded-xl text-xs sm:text-sm font-semibold border ${
                feedback.isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              💬 {feedback.note}
            </div>
          )}
        </div>

        {/* 3 Action Options */}
        <div className="grid grid-cols-1 gap-2.5 sm:gap-3 mt-3">
          {question.options.map((opt, idx) => {
            const isSelected = selected === idx;
            let btnStyle = 'bg-white hover:bg-emerald-50/60 border-slate-200 text-slate-800 shadow-sm';

            if (feedback && isSelected) {
              btnStyle = feedback.isCorrect
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/30 font-bold ring-2 ring-emerald-300'
                : 'bg-rose-600 border-rose-500 text-white shadow-md shadow-rose-600/30 font-bold ring-2 ring-rose-300';
            } else if (feedback && opt.isCorrect) {
              btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={() => onAnswer(player, idx)}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-all active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed ${btnStyle}`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 ${
                    isSelected && feedback ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {idx + 1}
                </div>
                <span className="text-xs sm:text-sm md:text-base font-semibold leading-snug flex-1">
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 grid grid-cols-2 divide-x-4 divide-emerald-200/40 h-full w-full select-none overflow-hidden">
      {renderSide('A', disabledA, selectedA, feedbackA)}
      {renderSide('B', disabledB, selectedB, feedbackB)}
    </div>
  );
};
