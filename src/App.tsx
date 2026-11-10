/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  DuelResult,
  GameSettings,
  QuestionBank,
  Team,
  TeamMember,
  TournamentMatch,
} from './types/game';
import {
  loadHistory,
  loadQuestions,
  loadSettings,
  loadTeams,
  loadTournament,
  saveQuestions,
  saveSettings,
  saveTeams,
  saveTournament,
} from './utils/storage';
import { generateBracket, advanceBracket } from './utils/bracket';
import { HomeScreen } from './components/home/HomeScreen';
import { KnockoutBracket } from './components/tournament/KnockoutBracket';
import { MatchDuelRunner } from './components/tournament/MatchDuelRunner';
import { SplitScreenDuel } from './components/games/SplitScreenDuel';
import { PortalGuru } from './components/portal/PortalGuru';
import { CaraBermainModal } from './components/home/CaraBermainModal';
import { QuickDuelModal } from './components/home/QuickDuelModal';

export default function App() {
  // App State from localStorage
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const [teams, setTeams] = useState<Team[]>(() => loadTeams());
  const [questions, setQuestions] = useState<QuestionBank>(() => loadQuestions());
  const [matches, setMatches] = useState<TournamentMatch[] | null>(() => loadTournament());

  // Navigation View
  const [currentView, setCurrentView] = useState<'HOME' | 'BRACKET' | 'MATCH' | 'QUICK_DUEL'>('HOME');

  // Active Match in Tournament
  const [activeMatch, setActiveMatch] = useState<TournamentMatch | null>(null);

  // Active Quick Duel
  const [quickDuelConfig, setQuickDuelConfig] = useState<{
    gameType: 1 | 2 | 3 | 4 | 5;
    teamA: Team;
    teamB: Team;
    playerA: TeamMember;
    playerB: TeamMember;
  } | null>(null);

  // Modal Dialogs
  const [showPortalGuru, setShowPortalGuru] = useState<boolean>(false);
  const [showCaraBermain, setShowCaraBermain] = useState<boolean>(false);
  const [showQuickDuelModal, setShowQuickDuelModal] = useState<boolean>(false);

  // Sync state to storage
  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleUpdateTeams = (newTeams: Team[]) => {
    setTeams(newTeams);
    saveTeams(newTeams);
    // If tournament matches exist, regenerate bracket with updated teams
    const newBracket = generateBracket(newTeams, false);
    setMatches(newBracket);
    saveTournament(newBracket);
  };

  const handleUpdateQuestions = (newQuestions: QuestionBank) => {
    setQuestions(newQuestions);
    saveQuestions(newQuestions);
  };

  // Start / Open Tournament Bracket
  const handleStartTournament = () => {
    let currentMatches = matches;
    if (!currentMatches || currentMatches.length === 0) {
      currentMatches = generateBracket(teams, false);
      setMatches(currentMatches);
      saveTournament(currentMatches);
    }
    setCurrentView('BRACKET');
  };

  // Shuffle Tournament Bracket
  const handleShuffleBracket = () => {
    const shuffled = generateBracket(teams, true);
    setMatches(shuffled);
    saveTournament(shuffled);
  };

  // Reset Tournament
  const handleResetTournament = () => {
    const fresh = generateBracket(teams, false);
    setMatches(fresh);
    saveTournament(fresh);
    setActiveMatch(null);
  };

  // Select match in bracket
  const handleSelectMatch = (match: TournamentMatch) => {
    setActiveMatch(match);
    setCurrentView('MATCH');
  };

  // Complete tournament match
  const handleTournamentMatchComplete = (matchId: string, winnerId: string, duels: DuelResult[]) => {
    if (!matches) return;
    const updated = matches.map((m) =>
      m.id === matchId ? { ...m, duels, isCompleted: true, winnerId } : m
    );
    const advanced = advanceBracket(updated, matchId, winnerId);
    setMatches(advanced);
    saveTournament(advanced);
    setActiveMatch(null);
    setCurrentView('BRACKET');
  };

  // Start Quick Duel Exhibition
  const handleStartQuickDuel = (
    gameType: 1 | 2 | 3 | 4 | 5,
    teamA: Team,
    teamB: Team,
    playerA: TeamMember,
    playerB: TeamMember
  ) => {
    setQuickDuelConfig({ gameType, teamA, teamB, playerA, playerB });
    setShowQuickDuelModal(false);
    setCurrentView('QUICK_DUEL');
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      {/* 1. HOME SCREEN */}
      {currentView === 'HOME' && (
        <HomeScreen
          teams={teams}
          onStartTournament={handleStartTournament}
          onOpenQuickDuel={() => setShowQuickDuelModal(true)}
          onOpenCaraBermain={() => setShowCaraBermain(true)}
          onOpenPortalGuru={() => setShowPortalGuru(true)}
        />
      )}

      {/* 2. TOURNAMENT BRACKET SCREEN */}
      {currentView === 'BRACKET' && matches && (
        <KnockoutBracket
          teams={teams}
          matches={matches}
          onSelectMatch={handleSelectMatch}
          onShuffleBracket={handleShuffleBracket}
          onResetTournament={handleResetTournament}
          onBackToMenu={() => setCurrentView('HOME')}
        />
      )}

      {/* 3. TOURNAMENT MATCH DUEL RUNNER */}
      {currentView === 'MATCH' && activeMatch && (
        (() => {
          const teamA = teams.find((t) => t.id === activeMatch.teamAId);
          const teamB = teams.find((t) => t.id === activeMatch.teamBId);
          if (!teamA || !teamB) {
            return (
              <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6">
                <p className="text-lg font-bold mb-4">Pertandingan belum siap atau salah satu tim belum lolos.</p>
                <button
                  type="button"
                  onClick={() => setCurrentView('BRACKET')}
                  className="px-6 py-2.5 bg-emerald-600 rounded-xl font-bold cursor-pointer"
                >
                  Kembali ke Bagan
                </button>
              </div>
            );
          }

          return (
            <MatchDuelRunner
              match={activeMatch}
              teamA={teamA}
              teamB={teamB}
              settings={settings}
              questions={questions}
              onMatchComplete={handleTournamentMatchComplete}
              onExit={() => setCurrentView('BRACKET')}
            />
          );
        })()
      )}

      {/* 4. QUICK DUEL (EXHIBITION) */}
      {currentView === 'QUICK_DUEL' && quickDuelConfig && (
        <SplitScreenDuel
          gameType={quickDuelConfig.gameType}
          teamA={quickDuelConfig.teamA}
          teamB={quickDuelConfig.teamB}
          playerA={quickDuelConfig.playerA}
          playerB={quickDuelConfig.playerB}
          settings={settings}
          questions={questions}
          onComplete={(_result) => {
            setCurrentView('HOME');
            setQuickDuelConfig(null);
          }}
          onExit={() => {
            setCurrentView('HOME');
            setQuickDuelConfig(null);
          }}
        />
      )}

      {/* MODAL: Cara Bermain & Panduan Guru */}
      {showCaraBermain && (
        <CaraBermainModal onClose={() => setShowCaraBermain(false)} />
      )}

      {/* MODAL: Quick Duel Selection */}
      {showQuickDuelModal && (
        <QuickDuelModal
          teams={teams}
          onStartDuel={handleStartQuickDuel}
          onClose={() => setShowQuickDuelModal(false)}
        />
      )}

      {/* MODAL: Portal Guru */}
      {showPortalGuru && (
        <PortalGuru
          settings={settings}
          teams={teams}
          questions={questions}
          matches={matches}
          onUpdateSettings={handleUpdateSettings}
          onUpdateTeams={handleUpdateTeams}
          onUpdateQuestions={handleUpdateQuestions}
          onResetTournament={handleResetTournament}
          onClose={() => setShowPortalGuru(false)}
        />
      )}
    </div>
  );
}
