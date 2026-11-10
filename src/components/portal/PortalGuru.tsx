/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Category,
  CATEGORY_LABELS,
  GAME_TYPE_NAMES,
  GameSettings,
  KilatQuestion,
  PilihanGandaQuestion,
  KeranjangItem,
  CocokkanPair,
  HakimCilikQuestion,
  QuestionBank,
  Team,
  TournamentMatch,
} from '../../types/game';
import {
  exportAllData,
  importAllData,
  resetToFactoryDefault,
  loadHistory,
  deleteHistoryRecord,
  clearAllHistory,
  DuelHistoryRecord,
} from '../../utils/storage';
import {
  Users,
  BookOpen,
  Settings,
  BarChart3,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  Search,
  Check,
  X,
  Lock,
  KeyRound,
  ShieldCheck,
  FileJson,
} from 'lucide-react';

interface PortalGuruProps {
  settings: GameSettings;
  teams: Team[];
  questions: QuestionBank;
  matches: TournamentMatch[] | null;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onUpdateTeams: (newTeams: Team[]) => void;
  onUpdateQuestions: (newQuestions: QuestionBank) => void;
  onResetTournament: () => void;
  onClose: () => void;
}

export const PortalGuru: React.FC<PortalGuruProps> = ({
  settings,
  teams,
  questions,
  matches,
  onUpdateSettings,
  onUpdateTeams,
  onUpdateQuestions,
  onResetTournament,
  onClose,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'TEAMS' | 'QUESTIONS' | 'SETTINGS' | 'RECAP' | 'BACKUP'>('TEAMS');

  // Change PIN modal
  const [showChangePinModal, setShowChangePinModal] = useState<boolean>(false);
  const [newPin, setNewPin] = useState<string>('');
  const [pinChangeMsg, setPinChangeMsg] = useState<string | null>(null);

  // Question Management State
  const [selectedGameType, setSelectedGameType] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddQuestionModal, setShowAddQuestionModal] = useState<boolean>(false);

  // History for recap
  const [history, setHistory] = useState<DuelHistoryRecord[]>(() => loadHistory());

  // Form states for adding question
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemEmoji, setNewItemEmoji] = useState<string>('🍏');
  const [newItemIsHalal, setNewItemIsHalal] = useState<boolean>(true);
  const [newItemCategory, setNewItemCategory] = useState<Category>('zat_asal');
  const [newItemExplanation, setNewItemExplanation] = useState<string>('');

  // Handle PIN verification
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === settings.teacherPin) {
      setIsAuthenticated(true);
      setPinError(null);
    } else {
      setPinError('PIN salah! Default PIN adalah 1234.');
    }
  };

  // Change PIN handler
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      setPinChangeMsg('PIN minimal 4 angka.');
      return;
    }
    const updated = { ...settings, teacherPin: newPin };
    onUpdateSettings(updated);
    setPinChangeMsg('PIN berhasil diperbarui!');
    setTimeout(() => {
      setShowChangePinModal(false);
      setPinChangeMsg(null);
      setNewPin('');
    }, 1200);
  };

  // Import JSON File
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importAllData(content);
      if (res.success) {
        alert(res.message);
        window.location.reload();
      } else {
        alert(res.message);
      }
    };
    reader.readAsText(file);
  };

  // Team Edit Handler
  const handleUpdateTeamName = (teamIndex: number, newName: string) => {
    const updated = [...teams];
    updated[teamIndex] = { ...updated[teamIndex], name: newName };
    onUpdateTeams(updated);
  };

  const handleUpdateMemberName = (teamIndex: number, memberIndex: number, newName: string) => {
    const updated = [...teams];
    const updatedMembers = [...updated[teamIndex].members];
    updatedMembers[memberIndex] = { ...updatedMembers[memberIndex], name: newName };
    updated[teamIndex] = { ...updated[teamIndex], members: updatedMembers };
    onUpdateTeams(updated);
  };

  const handleAddNewTeam = () => {
    if (teams.length >= 8) {
      alert('Maksimal 8 kelompok untuk turnamen.');
      return;
    }
    const newId = `team-${Date.now()}`;
    const colors = ['#059669', '#0284C7', '#D97706', '#7C3AED', '#E11D48', '#0D9488', '#4F46E5', '#EA580C'];
    const newTeam: Team = {
      id: newId,
      name: `Kelompok ${teams.length + 1}`,
      color: colors[teams.length % colors.length],
      members: [
        { id: `${newId}-m1`, name: 'Anggota 1', gameType: 1 },
        { id: `${newId}-m2`, name: 'Anggota 2', gameType: 2 },
        { id: `${newId}-m3`, name: 'Anggota 3', gameType: 3 },
        { id: `${newId}-m4`, name: 'Anggota 4', gameType: 4 },
        { id: `${newId}-m5`, name: 'Anggota 5', gameType: 5 },
      ],
    };
    onUpdateTeams([...teams, newTeam]);
  };

  const handleDeleteTeam = (teamId: string) => {
    if (teams.length <= 2) {
      alert('Minimal harus ada 2 kelompok dalam turnamen.');
      return;
    }
    if (confirm('Yakin ingin menghapus kelompok ini?')) {
      onUpdateTeams(teams.filter((t) => t.id !== teamId));
    }
  };

  // Add Question to Game 1
  const handleSaveKilatQuestion = () => {
    if (!newItemName.trim() || !newItemExplanation.trim()) {
      alert('Mohon isi nama makanan/perilaku dan penjelasan singkatnya.');
      return;
    }
    const newQ: KilatQuestion = {
      id: `k-custom-${Date.now()}`,
      name: newItemName.trim(),
      emoji: newItemEmoji || '✨',
      isHalal: newItemIsHalal,
      category: newItemCategory,
      explanation: newItemExplanation.trim(),
    };
    onUpdateQuestions({
      ...questions,
      kilat: [newQ, ...questions.kilat],
    });
    setShowAddQuestionModal(false);
    setNewItemName('');
    setNewItemExplanation('');
  };

  const handleDeleteKilatQuestion = (qId: string) => {
    if (confirm('Hapus soal ini dari bank soal?')) {
      onUpdateQuestions({
        ...questions,
        kilat: questions.kilat.filter((q) => q.id !== qId),
      });
    }
  };

  const handleDeleteHistory = (recordId: string) => {
    if (confirm('Hapus baris riwayat duel ini dari log?')) {
      const updated = deleteHistoryRecord(recordId);
      setHistory(updated);
    }
  };

  const handleClearAllHistory = () => {
    if (confirm('Yakin ingin menghapus seluruh catatan riwayat log duel?')) {
      clearAllHistory();
      setHistory([]);
    }
  };

  // PIN Login Gate
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-pop">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-emerald-500 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-1">Portal Guru PAI</h2>
          <p className="text-sm text-slate-500 mb-6">
            Masukkan PIN guru untuk mengatur bank soal, kelompok, dan pengaturan game. (PIN default: <span className="font-mono font-bold text-emerald-600">1234</span>)
          </p>

          <form onSubmit={handleVerifyPin} className="space-y-4">
            <input
              type="password"
              maxLength={8}
              autoFocus
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Masukkan 4 angka PIN"
              className="w-full text-center tracking-widest text-3xl font-mono py-3.5 px-4 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none"
            />

            {pinError && (
              <p className="text-xs font-bold text-rose-600">{pinError}</p>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-sm cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                Buka Portal
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 z-50 overflow-hidden font-sans">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 sm:h-20 bg-slate-950 px-6 sm:px-8 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Portal Guru — Duel Halal Haram
              </h2>
              <p className="text-xs text-slate-400">
                Pendidikan Agama Islam Kelas 6 SD
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowChangePinModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors cursor-pointer border border-slate-700"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Ganti PIN</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-slate-950/60 border-b border-slate-800 px-6 sm:px-8 flex items-center gap-2 overflow-x-auto shrink-0 py-2">
          <button
            type="button"
            onClick={() => setActiveTab('TEAMS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'TEAMS'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>1. Kelompok & Anggota</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('QUESTIONS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'QUESTIONS'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>2. Bank Soal Fiqih</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SETTINGS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'SETTINGS'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>3. Pengaturan Permainan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('RECAP')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'RECAP'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>4. Rekap & Papan Skor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('BACKUP')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'BACKUP'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileJson className="w-4 h-4" />
            <span>5. Ekspor / Impor JSON</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* TAB 1: TEAMS & MEMBERS */}
          {activeTab === 'TEAMS' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-white">
                    Manajemen Kelompok Belajar ({teams.length} Kelompok)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Setiap kelompok terdiri dari 5 anggota tetap yang masing-masing memainkan Game 1 hingga Game 5.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddNewTeam}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Kelompok</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teams.map((t, tIdx) => (
                  <div
                    key={t.id}
                    className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 shadow-md flex flex-col justify-between"
                  >
                    <div>
                      {/* Team Name Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5 flex-1 mr-3">
                          <div
                            className="w-4 h-4 rounded-full shrink-0"
                            style={{ backgroundColor: t.color }}
                          />
                          <input
                            type="text"
                            value={t.name}
                            onChange={(e) => handleUpdateTeamName(tIdx, e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 font-bold text-sm text-white focus:border-emerald-500 outline-none w-full"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteTeam(t.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                          title="Hapus Kelompok"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* 5 Members Inputs */}
                      <div className="space-y-2">
                        {t.members.map((m, mIdx) => (
                          <div
                            key={m.id}
                            className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs"
                          >
                            <span className="w-24 shrink-0 font-bold text-amber-400 truncate">
                              Duel {m.gameType} ({GAME_TYPE_NAMES[m.gameType].name.slice(0, 10)})
                            </span>
                            <input
                              type="text"
                              value={m.name}
                              onChange={(e) => handleUpdateMemberName(tIdx, mIdx, e.target.value)}
                              className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-slate-200 text-xs font-medium focus:border-emerald-500 outline-none flex-1"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: QUESTIONS MANAGEMENT */}
          {activeTab === 'QUESTIONS' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-white">Bank Soal Fiqih PAI</h3>
                  <p className="text-xs text-slate-400">
                    Mencakup materi zat asal, sifat asal, proses perolehan, dan perilaku akhlak sehari-hari.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {selectedGameType === 1 && (
                    <button
                      type="button"
                      onClick={() => setShowAddQuestionModal(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Soal Kilat</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Game Type Filter Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {[1, 2, 3, 4, 5].map((gNum) => (
                  <button
                    key={gNum}
                    type="button"
                    onClick={() => setSelectedGameType(gNum)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      selectedGameType === gNum
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>{GAME_TYPE_NAMES[gNum].icon}</span>
                    <span>Game {gNum}: {GAME_TYPE_NAMES[gNum].name}</span>
                  </button>
                ))}
              </div>

              {/* Category Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari kata kunci soal..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as Category | 'ALL')}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 outline-none focus:border-emerald-500 cursor-pointer w-full sm:w-auto"
                >
                  <option value="ALL">Semua Kategori Fiqih</option>
                  <option value="zat_asal">Zat Asal</option>
                  <option value="sifat_asal">Sifat Asal</option>
                  <option value="proses">Proses / Cara</option>
                  <option value="perilaku">Perilaku & Akhlak</option>
                </select>
              </div>

              {/* Question List Display for Selected Game */}
              <div className="space-y-3">
                {selectedGameType === 1 && (
                  <>
                    <div className="text-xs text-slate-400 font-semibold mb-2">
                      Total: {questions.kilat.length} Soal Kilat Terdaftar
                    </div>
                    {questions.kilat
                      .filter((q) => {
                        const matchCat = selectedCategory === 'ALL' || q.category === selectedCategory;
                        const matchSearch = q.name.toLowerCase().includes(searchQuery.toLowerCase()) || q.explanation.toLowerCase().includes(searchQuery.toLowerCase());
                        return matchCat && matchSearch;
                      })
                      .map((q) => (
                        <div
                          key={q.id}
                          className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-start justify-between gap-4"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-3xl">{q.emoji}</span>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-black text-base text-white">{q.name}</span>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                                  q.isHalal ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                                }`}>
                                  {q.isHalal ? 'HALAL' : 'HARAM'}
                                </span>
                                <span className="text-[10px] font-semibold text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                                  {CATEGORY_LABELS[q.category].split(' ')[0]}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {q.explanation}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteKilatQuestion(q.id)}
                            className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                  </>
                )}

                {selectedGameType === 2 && (
                  <>
                    <div className="text-xs text-slate-400 font-semibold mb-2">
                      Total: {questions.pilihanGanda.length} Soal Pilihan Ganda Kasus
                    </div>
                    {questions.pilihanGanda.map((q, idx) => (
                      <div key={q.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                        <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                          <span>Kasus #{idx + 1}</span>
                          <span className="text-slate-400">{CATEGORY_LABELS[q.category].split(' ')[0]}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 italic">"{q.story}"</p>
                        <p className="text-sm font-extrabold text-white">{q.question}</p>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`p-2 rounded-lg text-xs font-medium border ${
                                oIdx === q.correctIndex
                                  ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300 font-bold'
                                  : 'bg-slate-900/60 border-slate-700 text-slate-400'
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}. {opt}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-slate-400 pt-1">
                          💡 <span className="font-semibold text-slate-300">Penjelasan:</span> {q.explanation}
                        </p>
                      </div>
                    ))}
                  </>
                )}

                {selectedGameType === 3 && (
                  <>
                    <div className="text-xs text-slate-400 font-semibold mb-2">
                      Total: {questions.keranjang.length} Item Keranjang Sortir
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {questions.keranjang.map((item) => (
                        <div key={item.id} className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{item.emoji}</span>
                            <div>
                              <div className="text-sm font-bold text-white">{item.name}</div>
                              <div className="text-xs text-slate-400">{item.explanation}</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-slate-900 text-amber-400 shrink-0">
                            {item.correctBasket}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {selectedGameType === 4 && (
                  <>
                    <div className="text-xs text-slate-400 font-semibold mb-2">
                      Total: {questions.cocokkan.length} Pasang Kartu Makanan & Alasan
                    </div>
                    <div className="space-y-2">
                      {questions.cocokkan.map((pair) => (
                        <div key={pair.id} className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between gap-4 text-xs">
                          <div className="flex items-center gap-2 font-bold text-white">
                            <span>{pair.emoji}</span>
                            <span>{pair.item}</span>
                          </div>
                          <span className="text-slate-500">dipasangkan dengan</span>
                          <div className="text-emerald-400 font-medium text-right flex-1 truncate">
                            {pair.matchReason}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {selectedGameType === 5 && (
                  <>
                    <div className="text-xs text-slate-400 font-semibold mb-2">
                      Total: {questions.hakimCilik.length} Skenario Hakim Cilik
                    </div>
                    {questions.hakimCilik.map((hq, idx) => (
                      <div key={hq.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                        <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                          <span>⚖️ {hq.character}</span>
                          <span className="text-slate-400">{CATEGORY_LABELS[hq.category].split(' ')[0]}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300">"{hq.scenario}"</p>
                        <p className="text-sm font-extrabold text-white">{hq.question}</p>
                        <div className="space-y-1.5 pt-1">
                          {hq.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-xl text-xs ${
                                opt.isCorrect
                                  ? 'bg-emerald-950/60 border border-emerald-600 text-emerald-300 font-bold'
                                  : 'bg-slate-900/40 border border-slate-700 text-slate-400'
                              }`}
                            >
                              {opt.text}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: GAME SETTINGS */}
          {activeTab === 'SETTINGS' && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h3 className="text-xl font-black text-white">Pengaturan Aturan Permainan</h3>
                <p className="text-xs text-slate-400">
                  Sesuaikan durasi waktu, skor bonus kecepatan, penalti, serta materi penjelasan syariat.
                </p>
              </div>

              <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-5 space-y-5">
                {/* Time Per Question */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <label className="text-sm font-bold text-white block">
                      Waktu per Soal (Detik)
                    </label>
                    <span className="text-xs text-slate-400">
                      Batas waktu berpikir tiap soal (default: 10 detik)
                    </span>
                  </div>
                  <input
                    type="number"
                    min={5}
                    max={30}
                    value={settings.timePerQuestion}
                    onChange={(e) =>
                      onUpdateSettings({ ...settings, timePerQuestion: Number(e.target.value) || 10 })
                    }
                    className="w-20 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-center font-bold text-white outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Speed Bonus Toggle */}
                <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-700">
                  <div>
                    <label className="text-sm font-bold text-white block">
                      Bonus Kecepatan (Speed Bonus)
                    </label>
                    <span className="text-xs text-slate-400">
                      Pemain mendapat bonus poin tambahan jika menjawab lebih cepat
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.speedBonusEnabled}
                    onChange={(e) =>
                      onUpdateSettings({ ...settings, speedBonusEnabled: e.target.checked })
                    }
                    className="w-5 h-5 accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Penalty for wrong answer */}
                <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-700">
                  <div>
                    <label className="text-sm font-bold text-white block">
                      Penalti Jawaban Salah
                    </label>
                    <span className="text-xs text-slate-400">
                      Pengurangan poin jika salah menjawab (-25 poin atau 0 poin)
                    </span>
                  </div>
                  <select
                    value={settings.wrongPenalty}
                    onChange={(e) =>
                      onUpdateSettings({ ...settings, wrongPenalty: Number(e.target.value) })
                    }
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value={0}>Tidak Ada Penalti (0)</option>
                    <option value={25}>Penalti -25 Poin</option>
                  </select>
                </div>

                {/* Show Explanations */}
                <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-700">
                  <div>
                    <label className="text-sm font-bold text-white block">
                      Tampilkan Penjelasan Syariat
                    </label>
                    <span className="text-xs text-slate-400">
                      Tampilkan hikmah hukum (zat/sifat/proses) setelah soal/duel untuk penguatan materi
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showExplanations}
                    onChange={(e) =>
                      onUpdateSettings({ ...settings, showExplanations: e.target.checked })
                    }
                    className="w-5 h-5 accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Randomize Questions */}
                <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-700">
                  <div>
                    <label className="text-sm font-bold text-white block">
                      Acak Urutan Soal
                    </label>
                    <span className="text-xs text-slate-400">
                      Acak urutan soal tiap kali duel dimulai agar tidak monoton
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.randomizeQuestions}
                    onChange={(e) =>
                      onUpdateSettings({ ...settings, randomizeQuestions: e.target.checked })
                    }
                    className="w-5 h-5 accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Audio Sound FX */}
                <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-700">
                  <div>
                    <label className="text-sm font-bold text-white block">
                      Efek Suara Audio
                    </label>
                    <span className="text-xs text-slate-400">
                      Suara lonceng benar, buzzer salah, dan hitung mundur
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) =>
                      onUpdateSettings({ ...settings, soundEnabled: e.target.checked })
                    }
                    className="w-5 h-5 accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RECAP & SCOREBOARD */}
          {activeTab === 'RECAP' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-black text-white">Rekap Skor & Riwayat Pertandingan</h3>
                <p className="text-xs text-slate-400">
                  Papan peringkat kelompok dan catatan duel yang baru saja berlangsung.
                </p>
              </div>

              {/* Tournament Match Status */}
              {matches && matches.length > 0 && (
                <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-5">
                  <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3">
                    Status Turnamen Saat Ini
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {matches.map((m) => {
                      const tA = teams.find((t) => t.id === m.teamAId);
                      const tB = teams.find((t) => t.id === m.teamBId);
                      const winner = teams.find((t) => t.id === m.winnerId);

                      return (
                        <div key={m.id} className="p-3 bg-slate-900 rounded-xl border border-slate-700/80 text-xs">
                          <div className="font-bold text-slate-300 mb-1">{m.roundName}</div>
                          <div className="text-white truncate">
                            {tA?.name || 'TBD'} vs {tB?.name || 'TBD'}
                          </div>
                          <div className="mt-2 text-[11px] font-semibold">
                            {m.isCompleted ? (
                              <span className="text-emerald-400">Pemenang: {winner?.name}</span>
                            ) : (
                              <span className="text-slate-500">Belum Selesai</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recent Duel History Table */}
              <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-5">
                <div className="flex items-center justify-between mb-3 gap-2">
                  <h4 className="text-sm font-bold text-slate-200">
                    Log 20 Duel Terakhir
                  </h4>
                  {history.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllHistory}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/70 text-rose-300 text-xs font-bold transition-colors cursor-pointer shadow-sm"
                      title="Hapus seluruh riwayat log permainan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Semua Log</span>
                    </button>
                  )}
                </div>
                {history.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    Belum ada duel yang dimainkan. Mulai turnamen atau duel cepat untuk melihat log!
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-700 text-slate-400">
                          <th className="py-2 px-3">Waktu</th>
                          <th className="py-2 px-3">Tipe Duel</th>
                          <th className="py-2 px-3">Pemain A</th>
                          <th className="py-2 px-3">Pemain B</th>
                          <th className="py-2 px-3">Skor</th>
                          <th className="py-2 px-3">Pemenang</th>
                          <th className="py-2 px-3 text-center">Aksi / Hapus</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60">
                        {history.slice(0, 20).map((rec) => (
                          <tr key={rec.id} className="text-slate-300 hover:bg-slate-700/30 transition-colors">
                            <td className="py-2.5 px-3 font-mono">{rec.timestamp}</td>
                            <td className="py-2.5 px-3 font-semibold text-amber-300">{rec.gameName}</td>
                            <td className="py-2.5 px-3">{rec.playerAName}</td>
                            <td className="py-2.5 px-3">{rec.playerBName}</td>
                            <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                              {rec.scoreA} - {rec.scoreB}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-white">{rec.winnerName}</td>
                            <td className="py-2.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteHistory(rec.id)}
                                className="px-2.5 py-1 rounded-lg text-rose-300 hover:text-white bg-rose-950/50 hover:bg-rose-900 border border-rose-800/70 hover:border-rose-600 transition-colors cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold"
                                title="Hapus riwayat duel ini"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Hapus</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: BACKUP & RESTORE */}
          {activeTab === 'BACKUP' && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h3 className="text-xl font-black text-white">Cadangan & Pemulihan Data</h3>
                <p className="text-xs text-slate-400">
                  Data otomatis tersimpan di peramban (localStorage). Anda juga dapat mengunduh berkas cadangan JSON untuk dipindahkan ke komputer lain atau disimpan sebagai arsip sekolah.
                </p>
              </div>

              <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-5 space-y-4">
                {/* Export Button */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Ekspor Data Lengkap</h4>
                    <p className="text-xs text-slate-400">
                      Unduh seluruh kelompok, soal, pengaturan, dan riwayat dalam format file JSON.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={exportAllData}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Cadangan</span>
                  </button>
                </div>

                {/* Import Button */}
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-700">
                  <div>
                    <h4 className="text-sm font-bold text-white">Impor Data dari Berkas JSON</h4>
                    <p className="text-xs text-slate-400">
                      Pulihkan data soal atau kelompok dari file cadangan yang telah diunduh sebelumnya.
                    </p>
                  </div>
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs shadow-md transition-colors cursor-pointer shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>Pilih Berkas JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportFile}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Factory Reset */}
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-700">
                  <div>
                    <h4 className="text-sm font-bold text-rose-400">Kembalikan ke Pengaturan Awal Pabrik</h4>
                    <p className="text-xs text-slate-400">
                      Hapus semua perubahan custom dan kembalikan seluruh bank soal dan 6 kelompok asli.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('PERINGATAN: Seluruh soal kustom, nama kelompok, dan riwayat akan dikembalikan ke awal. Lanjutkan?')) {
                        resetToFactoryDefault();
                        window.location.reload();
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700 font-bold text-xs shadow-md transition-colors cursor-pointer shrink-0"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset Pabrik</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Kilat Question Modal */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 z-60 animate-pop">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-700 shadow-2xl text-left">
            <h3 className="text-xl font-black text-white mb-4">Tambah Soal Kilat Halal-Haram</h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">
                  Nama Makanan / Minuman / Perbuatan:
                </label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Contoh: Daging Kelinci Goreng"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">
                    Emoji / Ikon:
                  </label>
                  <input
                    type="text"
                    value={newItemEmoji}
                    onChange={(e) => setNewItemEmoji(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-lg text-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">
                    Kunci Hukum:
                  </label>
                  <select
                    value={newItemIsHalal ? 'HALAL' : 'HARAM'}
                    onChange={(e) => setNewItemIsHalal(e.target.value === 'HALAL')}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:border-emerald-500 outline-none cursor-pointer"
                  >
                    <option value="HALAL">HALAL</option>
                    <option value="HARAM">HARAM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">
                  Kategori Sebab Hukum Fiqih:
                </label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as Category)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:border-emerald-500 outline-none cursor-pointer"
                >
                  <option value="zat_asal">Zat Asal (Substansi hewan/benda)</option>
                  <option value="sifat_asal">Sifat Asal (Basi, beracun, memabukkan, najis)</option>
                  <option value="proses">Proses / Cara (Curi, tanpa basmalah, menipu)</option>
                  <option value="perilaku">Perilaku & Akhlak (Penerapan keseharian)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">
                  Penjelasan Singkat (Hikmah Pembelajaran):
                </label>
                <textarea
                  rows={3}
                  value={newItemExplanation}
                  onChange={(e) => setNewItemExplanation(e.target.value)}
                  placeholder="Contoh: Kelinci adalah hewan halal yang memakan rumput dan boleh disembelih secara syar'i."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddQuestionModal(false)}
                  className="py-3 rounded-xl border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveKilatQuestion}
                  className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md cursor-pointer"
                >
                  Simpan ke Bank Soal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change PIN Modal */}
      {showChangePinModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 z-60 animate-pop">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-slate-700 shadow-2xl text-center">
            <h3 className="text-xl font-black text-white mb-2">Ganti PIN Guru</h3>
            <p className="text-xs text-slate-400 mb-4">
              Masukkan 4-8 angka baru untuk mengamankan portal guru.
            </p>

            <form onSubmit={handleChangePin} className="space-y-4">
              <input
                type="password"
                maxLength={8}
                autoFocus
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="PIN Baru"
                className="w-full text-center tracking-widest text-2xl font-mono py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:border-emerald-500"
              />

              {pinChangeMsg && (
                <p className="text-xs font-bold text-emerald-400">{pinChangeMsg}</p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowChangePinModal(false)}
                  className="py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md cursor-pointer"
                >
                  Simpan PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
