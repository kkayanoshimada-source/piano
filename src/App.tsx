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
      { time: 12.2, note: 'E4' }, { time: 12.7, note: 'F4' }, { time: 13.2, note: 'G4' },
      { time: 14.2, note: 'D4' }, { time: 15.2, note: 'G4' },
      { time: 16.2, note: 'E4' }, { time: 16.7, note: 'C4' },
    ],
  },
  {
    id: 'alps',
    title: 'アルプス一万尺',
    composer: 'アメリカ民謡（PD）',
    notes: [
      { time: 2.0, note: 'C4' }, { time: 2.4, note: 'C4' }, { time: 2.8, note: 'D4' }, { time: 3.2, note: 'E4' },
      { time: 3.8, note: 'C4' }, { time: 4.2, note: 'E4' }, { time: 4.6, note: 'D4' }, { time: 5.0, note: 'G4' },
      { time: 5.6, note: 'C4' }, { time: 6.0, note: 'C4' }, { time: 6.4, note: 'D4' }, { time: 6.8, note: 'E4' },
      { time: 7.4, note: 'C4' }, { time: 8.0, note: 'B4' }, { time: 8.6, note: 'G4' },
      { time: 9.4, note: 'C4' }, { time: 9.8, note: 'C4' }, { time: 10.2, note: 'D4' }, { time: 10.6, note: 'E4' },
      { time: 11.2, note: 'F4' }, { time: 11.6, note: 'E4' }, { time: 12.0, note: 'D4' }, { time: 12.4, note: 'C4' },
      { time: 13.0, note: 'B4' }, { time: 13.4, note: 'G4' }, { time: 13.8, note: 'A4' }, { time: 14.2, note: 'B4' },
      { time: 14.8, note: 'C5' }, { time: 15.6, note: 'C5' },
      { time: 16.6, note: 'A4' }, { time: 17.2, note: 'B4' }, { time: 17.6, note: 'A4' }, { time: 18.0, note: 'G4' },
      { time: 18.6, note: 'A4' }, { time: 19.0, note: 'B4' }, { time: 19.4, note: 'C5' }, { time: 19.8, note: 'A4' },
      { time: 20.4, note: 'G4' }, { time: 21.0, note: 'A4' }, { time: 21.4, note: 'G4' }, { time: 21.8, note: 'F4' },
      { time: 22.4, note: 'E4' }, { time: 23.2, note: 'G4' },
      { time: 24.2, note: 'A4' }, { time: 24.8, note: 'B4' }, { time: 25.2, note: 'A4' }, { time: 25.6, note: 'G4' },
      { time: 26.2, note: 'A4' }, { time: 26.6, note: 'B4' }, { time: 27.0, note: 'C5' }, { time: 27.4, note: 'A4' },
      { time: 28.0, note: 'G4' }, { time: 28.4, note: 'C5' }, { time: 28.8, note: 'B4' }, { time: 29.2, note: 'C5' },
      { time: 29.8, note: 'C5' },
    ],
  },
  {
    id: 'ookina_kuri',
    title: '大きな栗の木の下で',
    composer: '伝統曲（PD）',
    notes: [
      { time: 2.0, note: 'C4' }, { time: 2.6, note: 'C4' }, { time: 2.9, note: 'D4' },
      { time: 3.4, note: 'E4' }, { time: 3.7, note: 'E4' }, { time: 4.1, note: 'G4' },
      { time: 4.8, note: 'E4' }, { time: 5.1, note: 'E4' }, { time: 5.5, note: 'D4' }, { time: 5.8, note: 'D4' },
      { time: 6.4, note: 'C4' },
      { time: 7.5, note: 'E4' }, { time: 8.1, note: 'E4' }, { time: 8.4, note: 'F4' },
      { time: 9.0, note: 'G4' }, { time: 9.6, note: 'C5' },
      { time: 10.3, note: 'A4' }, { time: 10.9, note: 'C5' },
      { time: 11.6, note: 'G4' },
      { time: 12.7, note: 'C5' }, { time: 13.3, note: 'C5' },
      { time: 14.0, note: 'B4' }, { time: 14.6, note: 'G4' },
      { time: 15.3, note: 'A4' }, { time: 15.6, note: 'A4' }, { time: 15.9, note: 'A4' }, { time: 16.2, note: 'A4' },
      { time: 16.8, note: 'G4' },
      { time: 17.9, note: 'C4' }, { time: 18.5, note: 'C4' }, { time: 18.8, note: 'D4' },
      { time: 19.3, note: 'E4' }, { time: 19.6, note: 'E4' }, { time: 20.0, note: 'G4' },
      { time: 20.7, note: 'E4' }, { time: 21.0, note: 'E4' }, { time: 21.4, note: 'D4' }, { time: 21.7, note: 'D4' },
      { time: 22.3, note: 'C4' },
    ],
  },
  {
    id: 'katatsumuri',
    title: 'かたつむり',
    composer: '文部省唱歌（PD）',
    notes: [
      { time: 2.0, note: 'G4' }, { time: 2.7, note: 'G4' }, { time: 3.0, note: 'G4' }, { time: 3.3, note: 'E4' },
      { time: 4.0, note: 'C4' }, { time: 4.7, note: 'C4' }, { time: 5.0, note: 'C4' }, { time: 5.3, note: 'D4' },
      { time: 6.0, note: 'E4' }, { time: 6.7, note: 'E4' }, { time: 7.0, note: 'D4' }, { time: 7.3, note: 'C4' },
      { time: 8.0, note: 'D4' },
      { time: 9.2, note: 'E4' }, { time: 9.6, note: 'F4' }, { time: 10.0, note: 'G4' }, { time: 10.4, note: 'A4' },
      { time: 11.1, note: 'G4' }, { time: 11.8, note: 'G4' }, { time: 12.1, note: 'G4' }, { time: 12.4, note: 'E4' },
      { time: 13.1, note: 'D4' }, { time: 13.5, note: 'D4' }, { time: 13.8, note: 'C4' }, { time: 14.1, note: 'D4' },
      { time: 14.8, note: 'E4' },
      { time: 16.0, note: 'G4' }, { time: 16.4, note: 'C5' }, { time: 16.8, note: 'C5' }, { time: 17.2, note: 'G4' },
      { time: 17.9, note: 'E4' }, { time: 18.3, note: 'G4' }, { time: 18.7, note: 'G4' }, { time: 19.1, note: 'E4' },
      { time: 19.8, note: 'C4' }, { time: 20.2, note: 'E4' }, { time: 20.7, note: 'E4' }, { time: 21.1, note: 'D4' },
      { time: 21.7, note: 'C4' },
    ],
  },
  {
    id: 'senro',
    title: '線路は続くよどこまでも',
    composer: 'アメリカ民謡（PD）',
    notes: [
      { time: 2.0, note: 'C4' }, { time: 2.65, note: 'G4' },
      { time: 3.0, note: 'C4' }, { time: 3.5, note: 'G4' }, { time: 3.75, note: 'C4' }, { time: 4.0, note: 'D4' },
      { time: 4.5, note: 'E4' }, { time: 5.5, note: 'C4' },
      { time: 6.5, note: 'F4' }, { time: 7.15, note: 'F4' }, { time: 7.5, note: 'C4' }, { time: 8.0, note: 'D4' }, { time: 8.5, note: 'E4' },
      { time: 10.0, note: 'C4' }, { time: 10.65, note: 'G4' },
      { time: 11.0, note: 'C4' }, { time: 11.5, note: 'G4' }, { time: 11.75, note: 'C4' }, { time: 12.0, note: 'D4' },
      { time: 12.5, note: 'E4' }, { time: 13.5, note: 'C4' },
      { time: 14.5, note: 'D4' }, { time: 15.15, note: 'D4' }, { time: 15.5, note: 'D4' }, { time: 16.0, note: 'E4' }, { time: 16.5, note: 'D4' },
      { time: 18.0, note: 'D4' }, { time: 18.65, note: 'D4' },
      { time: 19.0, note: 'C#4' }, { time: 19.4, note: 'D4' }, { time: 19.8, note: 'E4' }, { time: 20.2, note: 'D4' },
      { time: 20.7, note: 'C4' }, { time: 21.7, note: 'G4' },
      { time: 22.7, note: 'F4' }, { time: 23.35, note: 'F4' }, { time: 23.7, note: 'C4' }, { time: 24.2, note: 'D4' }, { time: 24.7, note: 'E4' },
      { time: 26.2, note: 'A4' }, { time: 26.85, note: 'B4' },
      { time: 27.2, note: 'C5' }, { time: 27.6, note: 'B4' }, { time: 28.0, note: 'C5' }, { time: 28.4, note: 'A4' },
      { time: 29.0, note: 'G4' }, { time: 29.65, note: 'G4' }, { time: 30.0, note: 'C4' },
      { time: 31.0, note: 'E4' }, { time: 31.65, note: 'F4' },
    ],
  },
  {
    id: 'nanatsu_no_ko',
    title: '七つの子',
    composer: '本居長世（PD）',
    notes: [
      { time: 2.0, note: 'E4' }, { time: 2.7, note: 'D4' }, { time: 3.0, note: 'C4' }, { time: 3.5, note: 'D4' },
      { time: 4.3, note: 'E4' }, { time: 4.8, note: 'C4' }, { time: 5.2, note: 'A4' }, { time: 5.6, note: 'C4' }, { time: 6.0, note: 'G4' },
      { time: 6.8, note: 'A4' }, { time: 7.2, note: 'G4' }, { time: 7.6, note: 'E4' }, { time: 8.0, note: 'G4' }, { time: 8.4, note: 'A4' }, { time: 8.8, note: 'C5' }, { time: 9.2, note: 'D4' },
      { time: 10.0, note: 'D4' },
      { time: 11.4, note: 'E4' }, { time: 12.1, note: 'F4' }, { time: 12.5, note: 'G4' }, { time: 12.9, note: 'E4' },
      { time: 13.7, note: 'G4' }, { time: 14.2, note: 'A4' }, { time: 14.6, note: 'G4' }, { time: 15.0, note: 'E4' }, { time: 15.4, note: 'C5' },
      { time: 16.2, note: 'D4' }, { time: 16.6, note: 'D4' }, { time: 17.0, note: 'E4' }, { time: 17.4, note: 'C4' }, { time: 17.8, note: 'A4' }, { time: 18.2, note: 'G4' }, { time: 18.6, note: 'C4' },
      { time: 19.4, note: 'C4' },
      { time: 20.8, note: 'D4' }, { time: 21.5, note: 'D4' }, { time: 22.0, note: 'D4' },
      { time: 22.8, note: 'D4' }, { time: 23.5, note: 'D4' }, { time: 23.9, note: 'D4' }, { time: 24.4, note: 'E4' },
      { time: 25.2, note: 'F4' }, { time: 25.7, note: 'E4' }, { time: 26.1, note: 'D4' }, { time: 26.5, note: 'D4' }, { time: 26.9, note: 'D4' }, { time: 27.3, note: 'E4' }, { time: 27.7, note: 'A4' },
      { time: 28.5, note: 'A4' },
      { time: 29.9, note: 'G4' }, { time: 30.6, note: 'G4' }, { time: 31.1, note: 'G4' },
      { time: 31.9, note: 'C5' }, { time: 32.6, note: 'C5' }, { time: 33.0, note: 'C5' }, { time: 33.5, note: 'D4' },
      { time: 34.3, note: 'E4' }, { time: 34.8, note: 'F4' }, { time: 35.2, note: 'A4' }, { time: 35.6, note: 'C5' }, { time: 36.0, note: 'D4' },
      { time: 36.8, note: 'D4' },
      { time: 38.2, note: 'E4' }, { time: 38.9, note: 'D4' }, { time: 39.2, note: 'C4' }, { time: 39.7, note: 'D4' },
      { time: 40.5, note: 'E4' }, { time: 41.0, note: 'C4' }, { time: 41.4, note: 'A4' }, { time: 41.8, note: 'C4' }, { time: 42.2, note: 'G4' },
      { time: 43.0, note: 'A4' }, { time: 43.4, note: 'G4' }, { time: 43.8, note: 'E4' }, { time: 44.2, note: 'G4' }, { time: 44.6, note: 'A4' }, { time: 45.0, note: 'C5' }, { time: 45.4, note: 'D4' },
      { time: 46.2, note: 'D4' },
      { time: 47.6, note: 'E4' }, { time: 48.3, note: 'F4' }, { time: 48.7, note: 'G4' }, { time: 49.1, note: 'E4' },
      { time: 49.9, note: 'G4' }, { time: 50.4, note: 'A4' }, { time: 50.8, note: 'G4' }, { time: 51.2, note: 'E4' }, { time: 51.6, note: 'C5' },
      { time: 52.4, note: 'D4' }, { time: 52.8, note: 'D4' }, { time: 53.2, note: 'E4' }, { time: 53.6, note: 'C4' }, { time: 54.0, note: 'A4' }, { time: 54.4, note: 'G4' }, { time: 54.8, note: 'C4' },
      { time: 55.6, note: 'C4' },
    ],
  },
  {
    id: 'hotaru_no_hikari',
    title: '蛍の光',
    composer: 'スコットランド民謡（PD）',
    notes: [
      { time: 2.0, note: 'G4' },
      { time: 2.7, note: 'C4' }, { time: 3.3, note: 'C4' }, { time: 3.7, note: 'C4' }, { time: 4.1, note: 'E4' },
      { time: 4.8, note: 'D4' }, { time: 5.4, note: 'C4' }, { time: 5.8, note: 'D4' }, { time: 6.2, note: 'E4' },
      { time: 6.9, note: 'C4' }, { time: 7.5, note: 'C4' }, { time: 7.9, note: 'E4' }, { time: 8.3, note: 'G4' },
      { time: 9.0, note: 'A4' }, { time: 10.0, note: 'A4' },
      { time: 11.2, note: 'G4' }, { time: 11.8, note: 'E4' }, { time: 12.2, note: 'E4' }, { time: 12.6, note: 'C4' },
      { time: 13.3, note: 'D4' }, { time: 13.9, note: 'C4' }, { time: 14.3, note: 'D4' }, { time: 14.7, note: 'E4' },
      { time: 15.4, note: 'C4' }, { time: 16.1, note: 'A4' }, { time: 16.5, note: 'A4' }, { time: 16.9, note: 'G4' },
      { time: 17.6, note: 'C4' }, { time: 18.6, note: 'A4' },
      { time: 19.8, note: 'G4' }, { time: 20.4, note: 'E4' }, { time: 20.8, note: 'E4' }, { time: 21.2, note: 'C4' },
      { time: 21.9, note: 'D4' }, { time: 22.5, note: 'C4' }, { time: 22.9, note: 'D4' }, { time: 23.3, note: 'A4' },
      { time: 24.0, note: 'G4' }, { time: 24.6, note: 'E4' }, { time: 25.0, note: 'E4' }, { time: 25.4, note: 'G4' },
      { time: 26.1, note: 'A4' }, { time: 27.1, note: 'A4' },
      { time: 28.3, note: 'G4' }, { time: 28.9, note: 'E4' }, { time: 29.3, note: 'E4' }, { time: 29.7, note: 'C4' },
      { time: 30.4, note: 'D4' }, { time: 31.0, note: 'C4' }, { time: 31.4, note: 'D4' }, { time: 31.8, note: 'E4' },
      { time: 32.5, note: 'C4' }, { time: 33.2, note: 'A4' }, { time: 33.6, note: 'A4' }, { time: 34.0, note: 'G4' },
      { time: 34.7, note: 'C4' },
    ],
  },
];

interface ActiveNote extends SheetNote {
  id: number;
  hit: boolean;
  missed: boolean;
}

type PlayMode = 'idle' | 'playing' | 'demo';

export default function App() {
  const [selectedSong, setSelectedSong] = useState<Song>(SONGS[0]);
  const [playMode, setPlayMode] = useState<PlayMode>('idle');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [previewOffsetSec, setPreviewOffsetSec] = useState<number>(0);
  const [activeNotes, setActiveNotes] = useState<ActiveNote[]>([]);
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [scrollSpeed, setScrollSpeed] = useState<number>(22);
  const [judgment, setJudgment] = useState<{ text: string; type: string; id: number } | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const startTimeRef = useRef<number>(0);
  const reqAnimRef = useRef<number | null>(null);
  const demoPlayedIdsRef = useRef<Set<number>>(new Set());

  const isDraggingLaneRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartOffsetRef = useRef<number>(0);

  const isRunning = playMode === 'playing' || playMode === 'demo';
  const songEndTime = Math.max(...selectedSong.notes.map((n) => n.time)) + 2.5;

  const playTone = useCallback((freq: number) => {
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const subGain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);
    subGain.gain.setValueAtTime(0.15, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.45, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.15);

    osc.connect(gain);
    osc2.connect(subGain);
    subGain.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 1.2);
    osc2.stop(now + 1.2);
  }, []);

  const triggerKeyVisual = useCallback((noteName: string) => {
    setPressedKeys((prev) => ({ ...prev, [noteName]: true }));
    setTimeout(() => {
      setPressedKeys((prev) => ({ ...prev, [noteName]: false }));
    }, 190);
  }, []);

  const beginSession = (mode: 'playing' | 'demo', song: Song = selectedSong) => {
    setSelectedSong(song);
    setScore(0);
    setCombo(0);
    setJudgment(null);
    setCurrentTime(0);
    setPreviewOffsetSec(0);
    demoPlayedIdsRef.current = new Set();
    setActiveNotes(
      song.notes.map((n, index) => ({
        ...n,
        id: index,
        hit: false,
        missed: false,
      }))
    );
    setPlayMode(mode);
    startTimeRef.current = performance.now();
  };

  const stopSession = () => {
    setPlayMode('idle');
    if (reqAnimRef.current) {
      cancelAnimationFrame(reqAnimRef.current);
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    const maxTime = Math.max(...selectedSong.notes.map((n) => n.time)) + 2.8;

    const update = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000;
      setCurrentTime(elapsed);

      if (playMode === 'demo') {
        selectedSong.notes.forEach((n, idx) => {
          if (!demoPlayedIdsRef.current.has(idx) && elapsed >= n.time) {
            demoPlayedIdsRef.current.add(idx);
            const keyCfg = KEYS.find((k) => k.note === n.note);
            if (keyCfg) {
              playTone(keyCfg.freq);
              triggerKeyVisual(keyCfg.note);
            }
            setScore((s) => s + 100);
            setCombo((c) => c + 1);
            setJudgment({ text: '♪ お手本', type: 'demo', id: Date.now() + idx });
            setActiveNotes((prev) =>
              prev.map((item) => (item.id === idx ? { ...item, hit: true } : item))
            );
          }
        });
      } else {
        setActiveNotes((prev) =>
          prev.map((note) => {
            if (!note.hit && !note.missed && elapsed - note.time > 0.4) {
              setCombo(0);
              setJudgment({ text: 'MISS', type: 'miss', id: Date.now() + Math.random() });
              return { ...note, missed: true };
            }
            return note;
          })
        );
      }

      if (elapsed >= maxTime) {
        setPlayMode('idle');
        setJudgment({
          text: playMode === 'demo' ? 'お手本終了！' : '演奏終了！',
          type: 'finish',
          id: Date.now(),
        });
        return;
      }

      reqAnimRef.current = requestAnimationFrame(update);
    };

    reqAnimRef.current = requestAnimationFrame(update);
    return () => {
      if (reqAnimRef.current) cancelAnimationFrame(reqAnimRef.current);
    };
  }, [isRunning, playMode, selectedSong, playTone, triggerKeyVisual]);

  const handleKeyPress = useCallback(
    (keyConfig: KeyConfig) => {
      playTone(keyConfig.freq);
      triggerKeyVisual(keyConfig.note);

      if (playMode !== 'playing') return;

      const nowElapsed = (performance.now() - startTimeRef.current) / 1000;
      setActiveNotes((prev) => {
        let targetIndex = -1;
        let minDiff = Infinity;

        prev.forEach((n, idx) => {
          if (!n.hit && !n.missed && n.note === keyConfig.note) {
            const diff = Math.abs(n.time - nowElapsed);
            if (diff < minDiff) {
              minDiff = diff;
              targetIndex = idx;
            }
          }
        });

        if (targetIndex !== -1 && minDiff <= 0.4) {
          const updated = [...prev];
          updated[targetIndex] = { ...updated[targetIndex], hit: true };

          if (minDiff <= 0.16) {
            setScore((s) => s + 100);
            setCombo((c) => c + 1);
            setJudgment({ text: '良！PERFECT', type: 'perfect', id: Date.now() });
          } else {
            setScore((s) => s + 50);
            setCombo((c) => c + 1);
            setJudgment({ text: '可！GOOD', type: 'good', id: Date.now() });
          }
          return updated;
        }
        return prev;
      });
    },
    [playMode, playTone, triggerKeyVisual]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const found = KEYS.find((k) => k.keyBind === e.key.toUpperCase());
      if (found) {
        handleKeyPress(found);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKeyPress]);

  const handleLanePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isRunning) return;
    isDraggingLaneRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = previewOffsetSec;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleLanePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingLaneRef.current || isRunning) return;
    const dx = e.clientX - dragStartXRef.current;
    const laneWidth = e.currentTarget.clientWidth || 600;
    const deltaPercent = (dx / laneWidth) * 100;
    const deltaSec = -deltaPercent / Math.max(scrollSpeed, 8);
    const nextOffset = Math.min(Math.max(dragStartOffsetRef.current + deltaSec, 0), songEndTime);
    setPreviewOffsetSec(nextOffset);
  };

  const handleLanePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingLaneRef.current) return;
    isDraggingLaneRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const effectiveTime = isRunning ? currentTime : previewOffsetSec;

  const getLaneTopPercent = (noteName: string) => {
    const idx = KEYS.findIndex((k) => k.note === noteName);
    if (idx === -1) return 50;
    const ratio = idx / (KEYS.length - 1);
    return 82 - ratio * 64;
  };

  const whiteKeys = KEYS.filter((k) => !k.isBlack);
  const blackKeys = KEYS.filter((k) => k.isBlack);

  const getKeyboardCenterPercent = (noteName: string) => {
    const keyInfo = KEYS.find((k) => k.note === noteName);
    if (!keyInfo) return 50;
    const whiteCount = whiteKeys.length;
    if (keyInfo.isBlack) {
      return ((keyInfo.whiteIndex + 1) / whiteCount) * 100;
    }
    return ((keyInfo.whiteIndex + 0.5) / whiteCount) * 100;
  };

  const HIT_ZONE_LEFT_PERCENT = 16;

  const isNoteGlowingKey = (noteName: string) => {
    if (!isRunning) return false;
    return activeNotes.some((n) => {
      if (n.hit || n.missed || n.note !== noteName) return false;
      const diff = n.time - effectiveTime;
      return diff >= -0.25 && diff <= 1.1;
    });
  };

  const displayNotesSource =
    isRunning
      ? activeNotes.filter((n) => !n.hit)
      : selectedSong.notes.map((n, index) => ({
          ...n,
          id: index,
          hit: false,
          missed: false,
        }));

  const visibleNotesCoords = displayNotesSource
    .map((n) => {
      const timeDiff = n.time - effectiveTime;
      const x = HIT_ZONE_LEFT_PERCENT + timeDiff * scrollSpeed;
      const y = getLaneTopPercent(n.note);
      return { ...n, x, y, timeDiff };
    })
    .filter((n) => n.x >= -15 && n.x <= 115);

  const nextTargetNote = isRunning
    ? visibleNotesCoords.find((n) => !n.missed && n.timeDiff >= -0.25 && n.timeDiff <= 1.1)
    : undefined;

  return (
    <div className="stage-container">
      <header className="stage-curtain-header">
        <div className="curtain-drape" />
        <div className="header-content">
          <h1 className="game-title">🎹 ステージ・ピアノリズム</h1>
          <div className="score-board">
            <div className="score-item">
              <span className="score-label">SCORE</span>
              <span className="score-value">{score}</span>
            </div>
            <div className="score-item">
              <span className="score-label">COMBO</span>
              <span className="score-value">{combo}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="game-main">
        <section className="song-selector-panel" aria-label="楽曲選択と操作">
          <div className="song-list-scroll" role="tablist" aria-label="楽曲一覧">
            {SONGS.map((song) => (
              <button
                key={song.id}
                type="button"
                className={`song-card ${selectedSong.id === song.id ? 'active' : ''}`}
                onClick={() => {
                  stopSession();
                  setSelectedSong(song);
                  setPreviewOffsetSec(0);
                  setActiveNotes(
                    song.notes.map((n, index) => ({
                      ...n,
                      id: index,
                      hit: false,
                      missed: false,
                    }))
                  );
                }}
              >
                <span className="song-title">♪ {song.title}</span>
                <span className="song-composer">{song.composer}</span>
              </button>
            ))}
          </div>

          <div className="control-side">
            <div className="speed-control">
              <label htmlFor="speed-slider" className="speed-label">
                スクロール速度: <strong>{scrollSpeed}</strong>
              </label>
              <input
                id="speed-slider"
                type="range"
                min={10}
                max={45}
                step={1}
                value={scrollSpeed}
                onChange={(e) => setScrollSpeed(Number(e.target.value))}
                className="speed-slider"
              />
            </div>

            <div className="control-buttons">
              {!isRunning ? (
                <>
                  <button
                    type="button"
                    className="btn-start"
                    onClick={() => beginSession('playing', selectedSong)}
                  >
                    ▶ 演奏スタート
                  </button>
                  <button
                    type="button"
                    className="btn-demo"
                    onClick={() => beginSession('demo', selectedSong)}
                  >
                    ♪ お手本
                  </button>
                </>
              ) : (
                <button type="button" className="btn-stop" onClick={stopSession}>
                  ■ {playMode === 'demo' ? 'お手本ストップ' : 'ストップ'}
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="sheet-lane-wrapper" aria-label="楽譜レーン">
          <div
            className={`sheet-lane ${!isRunning ? 'scrubbable' : ''}`}
            onPointerDown={handleLanePointerDown}
            onPointerMove={handleLanePointerMove}
            onPointerUp={handleLanePointerUp}
            onPointerCancel={handleLanePointerUp}
          >
            <div className="staff-lines">
              <div className="staff-line" />
              <div className="staff-line" />
              <div className="staff-line" />
              <div className="staff-line" />
              <div className="staff-line" />
            </div>

            <svg
              className="guide-lines-svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {visibleNotesCoords.length > 1 && (
                <polyline
                  fill="none"
                  stroke="rgba(255, 224, 150, 0.38)"
                  strokeWidth="0.65"
                  strokeDasharray="1.5, 1.2"
                  points={visibleNotesCoords.map((n) => `${n.x},${n.y}`).join(' ')}
                />
              )}

              {isRunning && nextTargetNote && (
                <g>
                  <line
                    x1={nextTargetNote.x}
                    y1={nextTargetNote.y}
                    x2={getKeyboardCenterPercent(nextTargetNote.note)}
                    y2={100}
                    stroke="rgba(255, 214, 102, 0.85)"
                    strokeWidth="0.8"
                    strokeDasharray="1.8, 1.2"
                  />
                  <circle
                    cx={getKeyboardCenterPercent(nextTargetNote.note)}
                    cy={98}
                    r="1.4"
                    fill="#ffd666"
                  />
                </g>
              )}
            </svg>

            <div className="hit-zone" style={{ left: `${HIT_ZONE_LEFT_PERCENT}%` }}>
              <div className="hit-ring" />
            </div>

            {judgment && (
              <div
                key={judgment.id}
                className={`judgment-popup ${judgment.type}`}
                style={{ left: `${HIT_ZONE_LEFT_PERCENT}%` }}
              >
                {judgment.text}
              </div>
            )}

            {visibleNotesCoords.map((note) => {
              const keyInfo = KEYS.find((k) => k.note === note.note);
              const isNext =
                isRunning && !note.missed && note.timeDiff >= -0.25 && note.timeDiff <= 1.1;

              return (
                <div
                  key={note.id}
                  className={`scroll-note ${note.missed ? 'missed' : ''} ${
                    keyInfo?.isBlack ? 'sharp-note' : ''
                  } ${isNext ? 'highlight-note' : ''}`}
                  style={{
                    left: `${note.x}%`,
                    top: `${note.y}%`,
                  }}
                >
                  <span className="note-label">{keyInfo?.label}</span>
                </div>
              );
            })}

            {!isRunning && (
              <div className="lane-scrub-hint">
                ← スワイプして楽譜を確認（{previewOffsetSec.toFixed(1)}s / {songEndTime.toFixed(1)}s） →
              </div>
            )}
          </div>
        </section>

        <section className="piano-stage" aria-label="ピアノ鍵盤">
          <div className="piano-keyboard">
            <div className="white-keys">
              {whiteKeys.map((k) => {
                const isTarget = isNoteGlowingKey(k.note);

                return (
                  <button
                    key={k.note}
                    type="button"
                    className={`white-key ${pressedKeys[k.note] ? 'pressed' : ''} ${
                      isTarget ? 'target-guide' : ''
                    }`}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      handleKeyPress(k);
                    }}
                  >
                    <span className="key-note-name">{k.label}</span>
                    <span className="key-bind-hint">{k.keyBind}</span>
                  </button>
                );
              })}
            </div>

            <div className="black-keys">
              {blackKeys.map((k) => {
                const leftPos = ((k.whiteIndex + 0.68) / whiteKeys.length) * 100;
                const isTarget = isNoteGlowingKey(k.note);

                return (
                  <button
                    key={k.note}
                    type="button"
                    style={{ left: `${leftPos}%` }}
                    className={`black-key ${pressedKeys[k.note] ? 'pressed' : ''} ${
                      isTarget ? 'target-guide' : ''
                    }`}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      handleKeyPress(k);
                    }}
                  >
                    <span className="key-note-name">{k.label}</span>
                    <span className="key-bind-hint">{k.keyBind}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}