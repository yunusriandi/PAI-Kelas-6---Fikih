/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Trophy, Swords, BookOpen, Settings, Sparkles, Star, Moon, Check, X } from 'lucide-react';
import { Team } from '../../types/game';
import { IMAGES } from '../../constants/images';

interface HomeScreenProps {
  teams: Team[];
  onStartTournament: () => void;
  onOpenQuickDuel: () => void;
  onOpenCaraBermain: () => void;
  onOpenPortalGuru: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  teams,
  onStartTournament,
  onOpenQuickDuel,
  onOpenCaraBermain,
  onOpenPortalGuru,
}) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden text-white flex flex-col justify-between p-5 sm:p-8 select-none font-sans">
      {/* 1. Panoramic Islamic Mosque & Sky Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={IMAGES.islamicBg}
          alt="Latar Belakang Nuansa Islami Anak Muslim"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = IMAGES.fallbacks.islamicBg;
          }}
          className="w-full h-full object-cover object-center filter brightness-[0.45] saturate-[1.25] scale-105"
        />
        {/* Soft emerald-slate gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/75 to-emerald-950/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/60 via-transparent to-slate-950/70" />
      </div>

      {/* 2. Hanging Decorative Islamic Lanterns (Fanous) & Crescent Ornaments */}
      <div className="absolute top-0 left-6 sm:left-14 pointer-events-none z-10 flex items-start gap-4 animate-pulse">
        {/* Lantern 1 */}
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-12 sm:h-20 bg-amber-400/70" />
          <div className="w-8 h-12 sm:w-10 sm:h-16 rounded-xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 shadow-lg shadow-amber-400/50 flex items-center justify-center border-2 border-amber-200">
            <span className="text-base sm:text-lg">✨</span>
          </div>
        </div>
        {/* Crescent Star */}
        <div className="flex flex-col items-center pt-4">
          <div className="w-0.5 h-8 sm:h-12 bg-amber-300/60" />
          <div className="text-xl sm:text-2xl text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">
            🌙
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-6 sm:right-14 pointer-events-none z-10 flex items-start gap-4 animate-pulse">
        {/* Crescent Star */}
        <div className="flex flex-col items-center pt-2">
          <div className="w-0.5 h-10 sm:h-14 bg-amber-300/60" />
          <div className="text-xl sm:text-2xl text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">
            ⭐
          </div>
        </div>
        {/* Lantern 2 */}
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-14 sm:h-24 bg-amber-400/70" />
          <div className="w-8 h-12 sm:w-10 sm:h-16 rounded-xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 shadow-lg shadow-amber-400/50 flex items-center justify-center border-2 border-amber-200">
            <span className="text-base sm:text-lg">🏮</span>
          </div>
        </div>
      </div>

      {/* Top Bar with School / Subject Kicker */}
      <header className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-emerald-400/40 text-xs sm:text-sm font-bold text-emerald-200 shadow-lg">
          <Moon className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span>Pendidikan Agama Islam (PAI) · Kelas 6 SD</span>
        </div>

        <button
          type="button"
          onClick={onOpenPortalGuru}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-md border border-amber-400/40 text-xs sm:text-sm font-bold text-white transition-all active:scale-95 cursor-pointer shadow-lg hover:border-amber-300"
        >
          <Settings className="w-4 h-4 text-amber-300" />
          <span>Portal Guru (PIN)</span>
        </button>
      </header>

      {/* Center Hero Section with Muslim Kids Mascot & Title Lockup */}
      <main className="relative z-10 my-auto w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 py-2">
        {/* Left: Muslim Kids Illustration Card */}
        <div className="relative group shrink-0">
          <div className="w-56 sm:w-64 md:w-72 lg:w-80 rounded-3xl overflow-hidden border-4 border-amber-300/80 shadow-2xl shadow-emerald-950/80 bg-slate-800/90 relative">
            <img
              src={IMAGES.heroKids}
              alt="Anak Muslim Berprestasi PAI"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = IMAGES.fallbacks.heroKids;
              }}
              className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            {/* Friendly Mascot Tag */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent p-3 text-center">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-950/70 border border-amber-400/40 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Sahabat Cilik PAI Kelas 6</span>
              </span>
            </div>
          </div>

          {/* Floating Student Avatars Badges */}
          <div className="absolute -top-3 -left-3 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-lg bg-emerald-900">
            <img
              src={IMAGES.avatarBoy}
              alt="Siswa Muslim PAI"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = IMAGES.fallbacks.avatarBoy;
              }}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-3 -right-3 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-pink-400 shadow-lg bg-pink-900">
            <img
              src={IMAGES.avatarGirl}
              alt="Siswi Muslimah PAI"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = IMAGES.fallbacks.avatarGirl;
              }}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right: Game Title & CTAs */}
        <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start max-w-xl">
          {/* Halal / Haram Visual Badges */}
          <div className="flex items-center gap-2.5 mb-3 animate-pop">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/30 border border-emerald-400 text-emerald-300 font-black text-xs tracking-wide shadow-sm">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>HALAL & THAYYIB</span>
            </div>
            <span className="text-amber-400 font-black text-xs">⚔️</span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/30 border border-rose-400 text-rose-300 font-black text-xs tracking-wide shadow-sm">
              <X className="w-4 h-4 stroke-[3]" />
              <span>HARAM (ZAT/SIFAT/PROSES)</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-2">
            <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent drop-shadow-lg">
              DUEL HALAL HARAM
            </span>
          </h1>

          <p className="text-slate-200 text-sm sm:text-base font-medium leading-relaxed mb-6">
            Turnamen cerdas cermat fiqih interaktif untuk smartboard. Uji ketepatan & kecepatan membedakan makanan, minuman, serta perbuatan halal dan haram!
          </p>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
            {/* Mulai Turnamen CTA */}
            <button
              type="button"
              onClick={onStartTournament}
              className="flex items-center justify-center gap-2.5 py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-lg sm:text-xl shadow-2xl shadow-amber-500/40 active:scale-95 transition-all border-2 border-amber-200 cursor-pointer"
            >
              <Trophy className="w-6 h-6 fill-slate-950" />
              <span>Mulai Turnamen</span>
            </button>

            {/* Duel Cepat Eksibisi */}
            <button
              type="button"
              onClick={onOpenQuickDuel}
              className="flex items-center justify-center gap-2.5 py-4 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg sm:text-xl shadow-xl shadow-emerald-600/30 active:scale-95 transition-all border-2 border-emerald-400 cursor-pointer"
            >
              <Swords className="w-6 h-6" />
              <span>Duel Cepat</span>
            </button>
          </div>

          {/* Secondary How-To Guide Button */}
          <button
            type="button"
            onClick={onOpenCaraBermain}
            className="mt-4 flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-300 hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Panduan Fiqih & Cara Bermain untuk Guru dan Siswa</span>
          </button>
        </div>
      </main>

      {/* Footer Team Strip */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-white/10 text-xs text-slate-300 bg-slate-950/40 backdrop-blur-sm px-4 py-2 rounded-2xl">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full">
          <span className="font-semibold text-amber-300 shrink-0">
            {teams.length} Kelompok:
          </span>
          <div className="flex items-center gap-1.5 flex-nowrap">
            {teams.map((t) => (
              <span
                key={t.id}
                className="px-2 py-0.5 rounded-lg bg-white/10 text-white font-medium text-[11px] whitespace-nowrap border border-white/10"
              >
                {t.name}
              </span>
            ))}
          </div>
        </div>

        <div className="text-slate-400 font-medium text-[11px] shrink-0">
          Layar Sentuh Landscape & Papan Smartboard
        </div>
      </footer>
    </div>
  );
};
