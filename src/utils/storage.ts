/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  GameSettings,
  QuestionBank,
  Team,
  TournamentMatch,
} from '../types/game';
import {
  DEFAULT_QUESTIONS,
  DEFAULT_SETTINGS,
  DEFAULT_TEAMS,
} from '../data/defaultData';

const STORAGE_KEYS = {
  SETTINGS: 'duel_halal_settings_v1',
  TEAMS: 'duel_halal_teams_v1',
  QUESTIONS: 'duel_halal_questions_v1',
  TOURNAMENT: 'duel_halal_tournament_v1',
  HISTORY: 'duel_halal_history_v1',
};

export interface DuelHistoryRecord {
  id: string;
  timestamp: string;
  matchId?: string;
  gameType: number;
  gameName: string;
  teamAName: string;
  teamBName: string;
  playerAName: string;
  playerBName: string;
  scoreA: number;
  scoreB: number;
  winnerName: string;
}

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: GameSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function loadTeams(): Team[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEAMS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load teams:', e);
  }
  return DEFAULT_TEAMS;
}

export function saveTeams(teams: Team[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  } catch (e) {
    console.error('Failed to save teams:', e);
  }
}

export function loadQuestions(): QuestionBank {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.kilat && parsed.pilihanGanda && parsed.keranjang && parsed.cocokkan && parsed.hakimCilik) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load questions:', e);
  }
  return DEFAULT_QUESTIONS;
}

export function saveQuestions(questions: QuestionBank) {
  try {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  } catch (e) {
    console.error('Failed to save questions:', e);
  }
}

export function loadTournament(): TournamentMatch[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TOURNAMENT);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load tournament:', e);
  }
  return null;
}

export function saveTournament(tournament: TournamentMatch[] | null) {
  try {
    if (tournament === null) {
      localStorage.removeItem(STORAGE_KEYS.TOURNAMENT);
    } else {
      localStorage.setItem(STORAGE_KEYS.TOURNAMENT, JSON.stringify(tournament));
    }
  } catch (e) {
    console.error('Failed to save tournament:', e);
  }
}

export function loadHistory(): DuelHistoryRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load history:', e);
  }
  return [];
}

export function addHistoryRecord(record: DuelHistoryRecord) {
  try {
    const existing = loadHistory();
    const updated = [record, ...existing].slice(0, 50); // Keep last 50
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to add history:', e);
  }
}

export function deleteHistoryRecord(recordId: string): DuelHistoryRecord[] {
  try {
    const existing = loadHistory();
    const updated = existing.filter((item) => item.id !== recordId);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete history record:', e);
    return [];
  }
}

export function clearAllHistory() {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (e) {
    console.error('Failed to clear history:', e);
  }
}

// Export all data to JSON file
export function exportAllData() {
  const data = {
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    settings: loadSettings(),
    teams: loadTeams(),
    questions: loadQuestions(),
    tournament: loadTournament(),
    history: loadHistory(),
  };

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `duel-halal-haram-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Import all data from JSON string
export function importAllData(jsonStr: string): { success: boolean; message: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed.questions || !parsed.teams) {
      return { success: false, message: 'Format data tidak valid: komponen soal atau kelompok tidak ditemukan.' };
    }
    if (parsed.settings) saveSettings(parsed.settings);
    if (parsed.teams) saveTeams(parsed.teams);
    if (parsed.questions) saveQuestions(parsed.questions);
    if (parsed.tournament) saveTournament(parsed.tournament);
    if (parsed.history) {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(parsed.history));
    }
    return { success: true, message: 'Berhasil mengimpor data! Aplikasi telah diperbarui.' };
  } catch (e) {
    return { success: false, message: 'Gagal membaca file JSON: ' + (e instanceof Error ? e.message : 'File rusak') };
  }
}

// Reset all to initial factory default
export function resetToFactoryDefault() {
  saveSettings(DEFAULT_SETTINGS);
  saveTeams(DEFAULT_TEAMS);
  saveQuestions(DEFAULT_QUESTIONS);
  saveTournament(null);
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
}
