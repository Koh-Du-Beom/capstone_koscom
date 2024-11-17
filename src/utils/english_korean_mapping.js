// utils/english_korean_mapping.js

import Hangul from 'hangul-js';

export function engToKor(input) {
  const keyMap = {
    'r': 'ㄱ', 'R': 'ㄲ', 's': 'ㄴ', 'e': 'ㄷ', 'E': 'ㄸ', 'f': 'ㄹ',
    'a': 'ㅁ', 'q': 'ㅂ', 'Q': 'ㅃ', 't': 'ㅅ', 'T': 'ㅆ', 'd': 'ㅇ',
    'w': 'ㅈ', 'W': 'ㅉ', 'c': 'ㅊ', 'z': 'ㅋ', 'x': 'ㅌ', 'v': 'ㅍ', 'g': 'ㅎ',
    'k': 'ㅏ', 'o': 'ㅐ', 'i': 'ㅑ', 'O': 'ㅒ', 'j': 'ㅓ', 'p': 'ㅔ',
    'u': 'ㅕ', 'P': 'ㅖ', 'h': 'ㅗ', 'y': 'ㅛ', 'n': 'ㅜ', 'b': 'ㅠ',
    'm': 'ㅡ', 'l': 'ㅣ',
  };

  const jamo = [];
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (keyMap[ch]) {
      jamo.push(keyMap[ch]);
    } else {
      jamo.push(ch);
    }
  }

  const assembled = Hangul.assemble(jamo);
  return assembled;
}
