/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BasketType, BASKET_INFO, KeranjangItem } from '../../types/game';

interface GameKeranjangProps {
  item: KeranjangItem;
  onSort: (player: 'A' | 'B', basket: BasketType) => void;
  disabledA: boolean;
  disabledB: boolean;
  feedbackA: { isCorrect: boolean; points: number } | null;
  feedbackB: { isCorrect: boolean; points: number } | null;
}

export const GameKeranjang: React.FC<GameKeranjangProps> = ({
  item,
  onSort,
  disabledA,
  disabledB,
  feedbackA,
  feedbackB,
}) => {
  const baskets: BasketType[] = ['halal', 'haram_zat', 'haram_sifat', 'haram_proses'];

  const getBasketColorClasses = (basket: BasketType, isSelected: boolean, isFeedback: boolean, isCorrect: boolean) => {
    if (isFeedback && isSelected) {
      return isCorrect
        ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/30 ring-4 ring-emerald-300'
        : 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-600/30 ring-4 ring-rose-300';
    }

    switch (basket) {
      case 'halal':
        return 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'haram_zat':
        return 'bg-rose-50 hover:bg-rose-100 text-rose-900 border-rose-300';
      case 'haram_sifat':
        return 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300';
      case 'haram_proses':
        return 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-300';
    }
  };

  const renderSide = (
    player: 'A' | 'B',
    disabled: boolean,
    feedback: { isCorrect: boolean; points: number } | null
  ) => {
    return (
      <div
        className={`flex flex-col justify-between p-4 sm:p-6 transition-colors duration-200 h-full ${
          feedback
            ? feedback.isCorrect
              ? 'bg-emerald-500/10'
              : 'bg-rose-500/10'
            : 'bg-transparent'
        }`}
      >
        {/* Item to Sort */}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <div className="bg-white/90 rounded-3xl p-6 sm:p-8 border-2 border-slate-200/80 shadow-xl max-w-sm w-full animate-pop flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Pemain {player} — Sortir ke Keranjang Mana?
            </span>
            <div className="text-6xl sm:text-7xl md:text-8xl my-2">
              {item.emoji}
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">
              {item.name}
            </h4>

            {feedback && (
              <div
                className={`mt-4 px-6 py-1.5 rounded-full font-black text-lg animate-pop ${
                  feedback.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {feedback.isCorrect ? `+${feedback.points} TEPAT!` : 'SALAH KERANJANG!'}
              </div>
            )}
          </div>
        </div>

        {/* 4 Baskets Grid */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          {baskets.map((b) => {
            const info = BASKET_INFO[b];
            const isCorrect = item.correctBasket === b;
            const colorClass = getBasketColorClasses(b, false, false, isCorrect);

            return (
              <button
                key={b}
                type="button"
                disabled={disabled}
                onClick={() => onSort(player, b)}
                className={`p-3 sm:p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer ${colorClass}`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-black px-2 py-0.5 rounded-md bg-white/70">
                    {info.badge}
                  </span>
                  <span className="text-lg">🧺</span>
                </div>
                <div>
                  <div className="font-extrabold text-sm sm:text-base leading-tight">
                    {info.title}
                  </div>
                  <div className="text-[11px] sm:text-xs opacity-80 mt-0.5 line-clamp-1">
                    {info.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 grid grid-cols-2 divide-x-4 divide-emerald-200/40 h-full w-full select-none overflow-hidden">
      {renderSide('A', disabledA, feedbackA)}
      {renderSide('B', disabledB, feedbackB)}
    </div>
  );
};
