/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, BookOpen, Users, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';
import { GAME_TYPE_NAMES } from '../../types/game';
import { IMAGES } from '../../constants/images';

interface CaraBermainModalProps {
  onClose: () => void;
}

export const CaraBermainModal: React.FC<CaraBermainModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-50 overflow-hidden font-sans">
      <div className="bg-white rounded-3xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl text-slate-800 border-2 border-emerald-400 overflow-hidden">
        {/* Modal Header */}
        <header className="h-16 sm:h-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-6 sm:px-8 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black">
                Cara Bermain & Panduan Guru PAI
              </h2>
              <p className="text-xs text-emerald-100">
                Pendidikan Agama Islam Kelas 6 SD: Makanan, Minuman, & Perilaku Halal-Haram
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
          {/* Welcome Mascot Banner */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-100 via-teal-50 to-amber-50 border border-emerald-300">
            <div className="w-24 sm:w-28 h-20 sm:h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-emerald-400 shadow-md">
              <img
                src={IMAGES.heroKids}
                onError={(e) => {
                  e.currentTarget.src = IMAGES.fallbacks.heroKids;
                }}
                alt="Siswa dan Siswi Muslim PAI"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                <span>Assalamu'alaikum Warahmatullahi Wabarakatuh!</span>
                <span>✨</span>
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Selamat datang di media pembelajaran interaktif PAI Kelas 6. Permainan dirancang untuk menguatkan pemahaman fiqih makanan, minuman, dan perilaku halal-haram secara kolaboratif dan menyenangkan di layar sentuh pintar kelas.
              </p>
            </div>
          </div>

          {/* Section 1: Konsep Dasar Fiqih */}
          <div className="bg-emerald-50/80 border-2 border-emerald-200/80 rounded-2xl p-5">
            <h3 className="text-base font-black text-emerald-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>1. Tiga Sebab Hukum Halal & Haram yang Dipelajari Siswa</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-sm">
                <div className="font-extrabold text-emerald-800 text-sm mb-1">
                  🥩 1. Zat Asal (Li Dzatihi)
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Benda yang secara asal substansinya diharamkan oleh Al-Qur'an dan Hadits, seperti babi, darah mengalir, bangkai hewan darat, khamr, dan hewan bertaring buas.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-sm">
                <div className="font-extrabold text-amber-800 text-sm mb-1">
                  🧪 2. Sifat Asal (Li Ghairihi)
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Asalnya halal, tetapi berubah haram karena sifatnya yang berubah: beracun, memabukkan, basi/berlendir, najis (mutanajjis), atau merusak kesehatan tubuh.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-sm">
                <div className="font-extrabold text-purple-800 text-sm mb-1">
                  💼 3. Proses / Perolehan
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Zatnya halal tetapi didapat dengan jalan haram: mencuri, korupsi, menipu, judi, atau penyembelihan hewan tanpa menyebut asma Allah (Basmalah).
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Format Turnamen Split Screen */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <h3 className="text-base font-black text-slate-900 mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>2. Format Turnamen Kelompok & Layar Sentuh (Split Screen)</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 list-disc list-inside">
              <li>
                <strong className="text-slate-900">5 Anggota Tetap per Kelompok:</strong> Setiap anggota memegang peran tetap di satu jenis game (Anggota 1 = Game 1, ..., Anggota 5 = Game 5).
              </li>
              <li>
                <strong className="text-slate-900">1 Pertandingan = 5 Duel Berurutan:</strong> Anggota 1 lawan Anggota 1, berlanjut sampai seluruh 5 duel selesai.
              </li>
              <li>
                <strong className="text-slate-900">Split Screen Simultan:</strong> Layar smartboard/laptop dibagi dua (Kiri = Pemain A, Kanan = Pemain B). Keduanya menerima soal yang sama secara bersamaan dan menekan layarnya masing-masing.
              </li>
              <li>
                <strong className="text-slate-900">Penentu Pemenang Pertandingan:</strong> Kelompok yang memenangkan minimal 3 dari 5 duel dinyatakan sebagai pemenang dan otomatis maju di bagan sistem gugur (knockout).
              </li>
            </ul>
          </div>

          {/* Section 3: 5 Tipe Game */}
          <div>
            <h3 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>3. Mekanik 5 Tipe Permainan Duel</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[1, 2, 3, 4, 5].map((gNum) => (
                <div key={gNum} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm flex items-start gap-3">
                  <span className="text-2xl shrink-0">{GAME_TYPE_NAMES[gNum].icon}</span>
                  <div>
                    <div className="font-black text-slate-900 text-sm">
                      Game {gNum}: {GAME_TYPE_NAMES[gNum].name}
                    </div>
                    <div className="text-slate-600 mt-1 leading-relaxed">
                      {GAME_TYPE_NAMES[gNum].desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Tips Praktis untuk Guru di Kelas */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs space-y-1.5 text-amber-900">
            <div className="font-extrabold text-sm text-amber-950 flex items-center gap-1.5">
              <span>💡</span>
              <span>Tips Penggunaan untuk Guru di Smartboard / Proyektor Kelas</span>
            </div>
            <p>
              • <strong>Ajak Dua Siswa Maju ke Depan:</strong> Suruh kedua siswa berdiri berdampingan di depan smartboard. Siswa A di sebelah kiri dan Siswa B di sebelah kanan.
            </p>
            <p>
              • <strong>Manfaatkan Penjelasan Syariat:</strong> Setelah setiap soal atau duel, gunakan momen pembahasan singkat untuk mengulas mengapa makanan tersebut halal/haram.
            </p>
            <p>
              • <strong>Kustomisasi di Portal Guru (PIN 1234):</strong> Guru dapat menambah nama murid yang sebenarnya, menyesuaikan durasi waktu (misal 15 detik), atau menambah soal kustom buatan guru sendiri.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-md transition-colors cursor-pointer"
          >
            Mengerti & Siap Bermain
          </button>
        </div>
      </div>
    </div>
  );
};
