/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PilihanGandaQuestion } from '../../types/game';

interface GamePilihanGandaProps {
  question: PilihanGandaQuestion;
  onAnswer: (player: 'A' | 'B', selectedIndex: number) => void;
  disabledA: boolean;
  disabledB: boolean;
  selectedA: number | null;
  selectedB: number | null;
  feedbackA: { isCorrect: boolean; points: number } | null;
  feedbackB: { isCorrect: boolean; points: number } | null;
}

export const GamePilihanGanda: React.FC<GamePilihanGandaProps> = ({
  question,
  onAnswer,
  disabledA,
  disabledB,
  selectedA,
  selectedB,
  feedbackA,
  feedbackB,
}) => {
  const letters = ['A', 'B', 'C', 'D'];

  const renderSide = (
    player: 'A' | 'B',
    disabled: boolean,
    selected: number | null,
    feedback: { isCorrect: boolean; points: number } | null
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
        {/* Story Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-amber-200/60 shadow-md">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2.5 py-1 rounded-lg">
              📖 Kisah Kasus (Pemain {player})
            </span>
            {feedback && (
              <span
                className={`text-sm sm:text-base font-extrabold px-3 py-1 rounded-lg animate-pop ${
                  feedback.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {feedback.isCorrect ? `+${feedback.points} TEPAT` : 'SALAH'}
              </span>
            )}
          </div>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
            "{question.story}"
          </p>
          <div className="mt-3 pt-3 border-t border-slate-200/80">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {question.question}
            </p>
          </div>
        </div>

        {/* 4 Choices */}
        <div className="grid grid-cols-1 gap-2.5 sm:gap-3 mt-4">
          {question.options.map((option, idx) => {
            const isSelected = selected === idx;
            const isCorrectAnswer = idx === question.correctIndex;

            let btnStyle = 'bg-white hover:bg-emerald-50/70 border-slate-200 text-slate-800 shadow-sm';
            if (feedback && isSelected) {
              btnStyle = feedback.isCorrect
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/30 font-bold'
                : 'bg-rose-600 border-rose-500 text-white shadow-md shadow-rose-600/30 font-bold';
            } else if (feedback && isCorrectAnswer) {
              btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={() => onAnswer(player, idx)}
                className={`flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98] disabled:cursor-not-allowed ${btnStyle} cursor-pointer`}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-base shrink-0 ${
                    isSelected && feedback
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {letters[idx]}
                </div>
                <span className="text-sm sm:text-base font-semibold leading-snug flex-1">
                  {option}
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
