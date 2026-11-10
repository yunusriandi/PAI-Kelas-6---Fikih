/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CocokkanPair } from '../../types/game';
import { Check } from 'lucide-react';

interface GameCocokkanProps {
  pairs: CocokkanPair[];
  onPlayerFinish: (player: 'A' | 'B', score: number, matchedCount: number) => void;
  onCorrectMatch: (player: 'A' | 'B') => void;
  onWrongMatch: (player: 'A' | 'B') => void;
}

export const GameCocokkan: React.FC<GameCocokkanProps> = ({
  pairs,
  onPlayerFinish,
  onCorrectMatch,
  onWrongMatch,
}) => {
  // Shuffled reasons for each player
  const [shuffledReasonsA] = useState(() =>
    [...pairs].map((p) => ({ id: p.id, reason: p.matchReason })).sort(() => Math.random() - 0.5)
  );
  const [shuffledReasonsB] = useState(() =>
    [...pairs].map((p) => ({ id: p.id, reason: p.matchReason })).sort(() => Math.random() - 0.5)
  );

  // Selections & Matched sets
  const [selectedItemA, setSelectedItemA] = useState<string | null>(null);
  const [selectedReasonA, setSelectedReasonA] = useState<string | null>(null);
  const [matchedA, setMatchedA] = useState<Set<string>>(new Set());

  const [selectedItemB, setSelectedItemB] = useState<string | null>(null);
  const [selectedReasonB, setSelectedReasonB] = useState<string | null>(null);
  const [matchedB, setMatchedB] = useState<Set<string>>(new Set());

  // Error shake states
  const [errorItemA, setErrorItemA] = useState<string | null>(null);
  const [errorItemB, setErrorItemB] = useState<string | null>(null);

  const handleSelectA = (type: 'item' | 'reason', id: string) => {
    if (matchedA.has(id)) return;

    if (type === 'item') {
      const nextItem = selectedItemA === id ? null : id;
      setSelectedItemA(nextItem);
      if (nextItem && selectedReasonA) {
        checkMatch('A', nextItem, selectedReasonA);
      }
    } else {
      const nextReason = selectedReasonA === id ? null : id;
      setSelectedReasonA(nextReason);
      if (selectedItemA && nextReason) {
        checkMatch('A', selectedItemA, nextReason);
      }
    }
  };

  const handleSelectB = (type: 'item' | 'reason', id: string) => {
    if (matchedB.has(id)) return;

    if (type === 'item') {
      const nextItem = selectedItemB === id ? null : id;
      setSelectedItemB(nextItem);
      if (nextItem && selectedReasonB) {
        checkMatch('B', nextItem, selectedReasonB);
      }
    } else {
      const nextReason = selectedReasonB === id ? null : id;
      setSelectedReasonB(nextReason);
      if (selectedItemB && nextReason) {
        checkMatch('B', selectedItemB, nextReason);
      }
    }
  };

  const checkMatch = (player: 'A' | 'B', itemId: string, reasonId: string) => {
    const isCorrect = itemId === reasonId;

    if (player === 'A') {
      if (isCorrect) {
        const nextMatched = new Set(matchedA);
        nextMatched.add(itemId);
        setMatchedA(nextMatched);
        setSelectedItemA(null);
        setSelectedReasonA(null);
        onCorrectMatch('A');

        if (nextMatched.size === pairs.length) {
          onPlayerFinish('A', pairs.length * 100, pairs.length);
        }
      } else {
        setErrorItemA(itemId);
        onWrongMatch('A');
        setTimeout(() => {
          setSelectedItemA(null);
          setSelectedReasonA(null);
          setErrorItemA(null);
        }, 600);
      }
    } else {
      if (isCorrect) {
        const nextMatched = new Set(matchedB);
        nextMatched.add(itemId);
        setMatchedB(nextMatched);
        setSelectedItemB(null);
        setSelectedReasonB(null);
        onCorrectMatch('B');

        if (nextMatched.size === pairs.length) {
          onPlayerFinish('B', pairs.length * 100, pairs.length);
        }
      } else {
        setErrorItemB(itemId);
        onWrongMatch('B');
        setTimeout(() => {
          setSelectedItemB(null);
          setSelectedReasonB(null);
          setErrorItemB(null);
        }, 600);
      }
    }
  };

  const renderSide = (
    player: 'A' | 'B',
    selectedItem: string | null,
    selectedReason: string | null,
    matched: Set<string>,
    errorItem: string | null,
    shuffledReasons: { id: string; reason: string }[],
    handleSelect: (type: 'item' | 'reason', id: string) => void
  ) => {
    const isCompleted = matched.size === pairs.length;

    return (
      <div className="flex flex-col p-3 sm:p-5 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-3 px-2">
          <span className="text-xs sm:text-sm font-bold text-slate-600">
            Pemain {player}: Pasangkan Makanan & Alasan Hukumnya
          </span>
          <span className="text-xs sm:text-sm font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            {matched.size} / {pairs.length} Terpasang
          </span>
        </div>

        {isCompleted ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-emerald-50 rounded-3xl border-2 border-emerald-300">
            <div className="text-6xl mb-3">🎉</div>
            <h4 className="text-2xl font-black text-emerald-800 mb-1">
              SEMUA PASANGAN COCOK!
            </h4>
            <p className="text-sm font-medium text-emerald-700">
              Hebat! Pemain {player} telah menyelesaikan seluruh kartu pasangan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 flex-1">
            {/* Left Column: Items */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                1. Makanan / Hal
              </span>
              {pairs.map((p) => {
                const isMatched = matched.has(p.id);
                const isSelected = selectedItem === p.id;
                const isError = errorItem === p.id;

                let cardStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';
                if (isMatched) {
                  cardStyle = 'bg-emerald-100/70 border-emerald-300 text-emerald-800 opacity-60';
                } else if (isSelected) {
                  cardStyle = 'bg-amber-100 border-amber-400 text-amber-900 ring-2 ring-amber-300 font-bold';
                } else if (isError) {
                  cardStyle = 'bg-rose-100 border-rose-400 text-rose-900 animate-shake';
                }

                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={isMatched}
                    onClick={() => handleSelect('item', p.id)}
                    className={`p-2.5 sm:p-3 rounded-xl border-2 text-left flex items-center gap-2 transition-all active:scale-98 cursor-pointer disabled:cursor-default ${cardStyle}`}
                  >
                    <span className="text-2xl shrink-0">{p.emoji}</span>
                    <span className="text-xs sm:text-sm font-bold flex-1 leading-snug">
                      {p.item}
                    </span>
                    {isMatched && <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />}
                  </button>
                );
              })}
            </div>

            {/* Right Column: Reasons */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                2. Alasan / Hukum
              </span>
              {shuffledReasons.map((r) => {
                const isMatched = matched.has(r.id);
                const isSelected = selectedReason === r.id;

                let cardStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';
                if (isMatched) {
                  cardStyle = 'bg-emerald-100/70 border-emerald-300 text-emerald-800 opacity-60';
                } else if (isSelected) {
                  cardStyle = 'bg-blue-100 border-blue-400 text-blue-900 ring-2 ring-blue-300 font-bold';
                }

                return (
                  <button
                    key={r.id}
                    type="button"
                    disabled={isMatched}
                    onClick={() => handleSelect('reason', r.id)}
                    className={`p-2.5 sm:p-3 rounded-xl border-2 text-left flex items-center justify-between gap-1 transition-all active:scale-98 cursor-pointer disabled:cursor-default ${cardStyle}`}
                  >
                    <span className="text-[11px] sm:text-xs font-semibold leading-tight line-clamp-3">
                      {r.reason}
                    </span>
                    {isMatched && <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 grid grid-cols-2 divide-x-4 divide-emerald-200/40 h-full w-full select-none overflow-hidden">
      {renderSide(
        'A',
        selectedItemA,
        selectedReasonA,
        matchedA,
        errorItemA,
        shuffledReasonsA,
        handleSelectA
      )}
      {renderSide(
        'B',
        selectedItemB,
        selectedReasonB,
        matchedB,
        errorItemB,
        shuffledReasonsB,
        handleSelectB
      )}
    </div>
  );
};
