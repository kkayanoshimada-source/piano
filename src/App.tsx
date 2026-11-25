import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

interface KeyConfig {
  note: string;
  label: string;
  keyBind: string;
  freq: number;
  isBlack: boolean;
  whiteIndex: number;
}

const KEYS: KeyConfig[] = [
  { note: 'C4', label: 'ド', keyBind: 'A', freq: 261.63, isBlack: false, whiteIndex: 0 },
  { note: 'C#4', label: 'ド#', keyBind: 'W', freq: 277.18, isBlack: true, whiteIndex: 0 },
  { note: 'D4', label: 'レ', keyBind: 'S', freq: 293.66, isBlack: false, whiteIndex: 1 },
  { note: 'D#4', label: 'レ#', keyBind: 'E', freq: 311.13, isBlack: true, whiteIndex: 1 },
  { note: 'E4', label: 'ミ', keyBind: 'D', freq: 329.63, isBlack: false, whiteIndex: 2 },
  { note: 'F4', label: 'ファ', keyBind: 'F', freq: 349.23, isBlack: false, whiteIndex: 3 },
  { note: 'F#4', label: 'ファ#', keyBind: 'T', freq: 369.99, isBlack: true, whiteIndex: 3 },
  { note: 'G4', label: 'ソ', keyBind: 'G', freq: 392.00, isBlack: false, whiteIndex: 4 },
  { note: 'G#4', label: 'ソ#', keyBind: 'Y', freq: 415.30, isBlack: true, whiteIndex: 4 },
  { note: 'A4', label: 'ラ', keyBind: 'H', freq: 440.00, isBlack: false, whiteIndex: 5 },
  { note: 'A#4', label: 'ラ#', keyBind: 'U', freq: 466.16, isBlack: true, whiteIndex: 5 },
  { note: 'B4', label: 'シ', keyBind: 'J', freq: 493.88, isBlack: false, whiteIndex: 6 },
  { note: 'C5', label: 'ド↑', keyBind: 'K', freq: 523.25, isBlack: false, whiteIndex: 7 },
];

interface SheetNote {
  time: number;
  note: string;
}

interface Song {
  id: string;
  title: string;
  composer: string;
  notes: SheetNote[];
}

// 著作権切れ（PD）かつ現在の13鍵盤（C4〜C5）で最後まで演奏できる全11曲
const SONGS: Song[] = [
  {
    id: 'twinkle',
    title: 'きらきら星',
    composer: 'フランス民謡（PD）',
    notes: [
      { time: 2.0, note: 'C4' }, { time: 2.5, note: 'C4' },
      { time: 3.0, note: 'G4' }, { time: 3.5, note: 'G4' },
      { time: 4.0, note: 'A4' }, { time: 4.5, note: 'A4' },
      { time: 5.0, note: 'G4' },
      { time: 6.0, note: 'F4' }, { time: 6.5, note: 'F4' },
      { time: 7.0, note: 'E4' }, { time: 7.5, note: 'E4' },
      { time: 8.0, note: 'D4' }, { time: 8.5, note: 'D4' },
      { time: 9.0, note: 'C4' },
      { time: 10.2, note: 'G4' }, { time: 10.7, note: 'G4' },
      { time: 11.2, note: 'F4' }, { time: 11.7, note: 'F4' },
      { time: 12.2, note: 'E4' }, { time: 12.7, note: 'E4' },
      { time: 13.2, note: 'D4' },
      { time: 14.2, note: 'G4' }, { time: 14.7, note: 'G4' },
      { time: 15.2, note: 'F4' }, { time: 15.7, note: 'F4' },
      { time: 16.2, note: 'E4' }, { time: 16.7, note: 'E4' },
      { time: 17.2, note: 'D4' },
      { time: 18.4, note: 'C4' }, { time: 18.9, note: 'C4' },
      { time: 19.4, note: 'G4' }, { time: 19.9, note: 'G4' },
      { time: 20.4, note: 'A4' }, { time: 20.9, note: 'A4' },
      { time: 21.4, note: 'G4' },
      { time: 22.4, note: 'F4' }, { time: 22.9, note: 'F4' },
      { time: 23.4, note: 'E4' }, { time: 23.9, note: 'E4' },
      { time: 24.4, note: 'D4' }, { time: 24.9, note: 'D4' },
      { time: 25.4, note: 'C4' },
    ],
  },
  {
    id: 'mary',
    title: 'メリーさんのひつじ',
    composer: 'アメリカ民謡（PD）',
    notes: [
      { time: 2.0, note: 'E4' }, { time: 2.75, note: 'D4' },
      { time: 3.0, note: 'C4' }, { time: 3.5, note: 'D4' },
      { time: 4.0, note: 'E4' }, { time: 4.5, note: 'E4' }, { time: 5.0, note: 'E4' },
      { time: 6.0, note: 'D4' }, { time: 6.5, note: 'D4' }, { time: 7.0, note: 'D4' },
      { time: 8.0, note: 'E4' }, { time: 8.5, note: 'G4' }, { time: 9.0, note: 'G4' },
      { time: 10.2, note: 'E4' }, { time: 10.95, note: 'D4' },
      { time: 11.2, note: 'C4' }, { time: 11.7, note: 'D4' },
      { time: 12.2, note: 'E4' }, { time: 12.7, note: 'E4' }, { time: 13.2, note: 'E4' },
      { time: 14.2, note: 'D4' }, { time: 14.7, note: 'D4' },
      { time: 15.2, note: 'E4' }, { time: 15.95, note: 'D4' },
      { time: 16.2, note: 'C4' },
    ],
  },
  {
    id: 'butterfly',
    title: 'ちょうちょう',
    composer: 'スペイン民謡（PD）',
    notes: [
      { time: 2.0, note: 'G4' }, { time: 2.5, note: 'E4' }, { time: 3.0, note: 'E4' },
      { time: 4.0, note: 'F4' }, { time: 4.5, note: 'D4' }, { time: 5.0, note: 'D4' },
      { time: 6.0, note: 'C4' }, { time: 6.5, note: 'D4' },
      { time: 7.0, note: 'E4' }, { time: 7.5, note: 'F4' },
      { time: 8.0, note: 'G4' }, { time: 8.5, note: 'G4' }, { time: 9.0, note: 'G4' },
      { time: 10.2, note: 'G4' }, { time: 10.7, note: 'E4' },
      { time: 11.2, note: 'E4' }, { time: 11.7, note: 'E4' },
      { time: 12.2, note: 'F4' }, { time: 12.7, note: 'D4' },
      { time: 13.2, note: 'D4' }, { time: 13.7, note: 'D4' },
      { time: 14.2, note: 'C4' }, { time: 14.7, note: 'E4' },
      { time: 15.2, note: 'G4' }, { time: 15.7, note: 'G4' },
      { time: 16.2, note: 'E4' }, { time: 16.7, note: 'E4' }, { time: 17.2, note: 'E4' },
      { time: 18.4, note: 'D4' }, { time: 18.9, note: 'D4' },
      { time: 19.4, note: 'D4' }, { time: 19.9, note: 'D4' },
      { time: 20.4, note: 'D4' }, { time: 20.9, note: 'E4' }, { time: 21.4, note: 'F4' },
      { time: 22.4, note: 'E4' }, { time: 22.9, note: 'E4' },
      { time: 23.4, note: 'E4' }, { time: 23.9, note: 'E4' },
      { time: 24.4, note: 'E4' }, { time: 24.9, note: 'F4' }, { time: 25.4, note: 'G4' },
      { time: 26.6, note: 'G4' }, { time: 27.1, note: 'E4' },
      { time: 27.6, note: 'E4' }, { time: 28.1, note: 'E4' },
      { time: 28.6, note: 'F4' }, { time: 29.1, note: 'D4' },
      { time: 29.6, note: 'D4' }, { time: 30.1, note: 'D4' },
      { time: 30.6, note: 'C4' }, { time: 31.1, note: 'E4' },
      { time: 31.6, note: 'G4' }, { time: 32.1, note: 'G4' },
      { time: 32.6, note: 'E4' }, { time: 33.1, note: 'E4' }, { time: 33.6, note: 'E4' },
    ],
  },
  {
    id: 'frog',
    title: 'かえるの合唱',
    composer: 'ドイツ民謡（PD）',
    notes: [
      { time: 2.0, note: 'C4' }, { time: 2.5, note: 'D4' },
      { time: 3.0, note: 'E4' }, { time: 3.5, note: 'F4' },
      { time: 4.0, note: 'E4' }, { time: 4.5, note: 'D4' }, { time: 5.0, note: 'C4' },
      { time: 6.0, note: 'E4' }, { time: 6.5, note: 'F4' },
      { time: 7.0, note: 'G4' }, { time: 7.5, note: 'A4' },
      { time: 8.0, note: 'G4' }, { time: 8.5, note: 'F4' }, { time: 9.0, note: 'E4' },
      { time: 10.2, note: 'C4' }, { time: 11.2, note: 'C4' },
      { time: 12.2, note: 'C4' }, { time: 13.2, note: 'C4' },
      { time: 14.2, note: 'C4' }, { time: 14.45, note: 'C4' },
      { time: 14.7, note: 'D4' }, { time: 14.95, note: 'D4' },
      { time: 15.2, note: 'E4' }, { time: 15.45, note: 'E4' },
      { time: 15.7, note: 'F4' }, { time: 15.95, note: 'F4' },
      { time: 16.2, note: 'E4' }, { time: 16.7, note: 'D4' }, { time: 17.2, note: 'C4' },
    ],
  },
  {
    id: 'london_bridge',
    title: 'ロンドン橋',
    composer: 'イギリス伝承曲（PD）',
    notes: [
      { time: 2.0, note: 'G4' }, { time: 2.5, note: 'A4' },
      { time: 3.0, note: 'G4' }, { time: 3.5, note: 'F4' },
      { time: 4.0, note: 'E4' }, { time: 4.5, note: 'F4' }, { time: 5.0, note: 'G4' },
      { time: 6.0, note: 'D4' }, { time: 6.5, note: 'E4' }, { time: 7.0, note: 'F4' },
      { time: 8.0, note: 'E4' }, { time: 8.5, note: 'F4' }, { time: 9.0, note: 'G4' },
      { time: 10.2, note: 'G4' }, { time: 10.7, note: 'A4' },
      { time: 11.2, note: 'G4' }, { time: 11.7, note: 'F4' },
      { time: 12.2, note: 'E4' }, { time: 12.7, note: 'F4' }, { time: 13.2, note: 'G