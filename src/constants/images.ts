/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Import images through Vite's asset bundler so they are hashed and bundled into dist/assets/
import heroKidsBundled from '../assets/images/muslim_kids_hero_1794278452695.jpg';
import islamicBgBundled from '../assets/images/islamic_skyline_bg_1794278454139.jpg';
import avatarBoyBundled from '../assets/images/avatar_boy_student_1794278454764.jpg';
import avatarGirlBundled from '../assets/images/avatar_girl_student_1794278454716.jpg';

export const IMAGES = {
  heroKids: heroKidsBundled || '/images/muslim_kids_hero.jpg',
  islamicBg: islamicBgBundled || '/images/islamic_skyline_bg.jpg',
  avatarBoy: avatarBoyBundled || '/images/avatar_boy_student.jpg',
  avatarGirl: avatarGirlBundled || '/images/avatar_girl_student.jpg',
  // Direct public fallback paths
  fallbacks: {
    heroKids: '/images/muslim_kids_hero.jpg',
    islamicBg: '/images/islamic_skyline_bg.jpg',
    avatarBoy: '/images/avatar_boy_student.jpg',
    avatarGirl: '/images/avatar_girl_student.jpg',
  },
};
