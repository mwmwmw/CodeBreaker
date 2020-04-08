import React, { useState } from "react";

export const CODE_PIECES = "ABCDEF";

export const ANY_TOKEN = "O";
export const EXACT_TOKEN = "X";
export const BLANK_TOKEN = "-";

const getRandomChar = (letters = "") =>
  letters[Math.floor(Math.random() * letters.length)];

const getRandomCode = (letters, length) => {
  return new Array(length)
    .fill("-")
    .map(v => getRandomChar(letters))
    .join("");
};

const useCodeBreaker = (
  MAX_GUESSES = 10,
  CODE_LENGTH = 4,
  pieces = CODE_PIECES
) => {
  const [code, setCode] = useState(getRandomCode(pieces, CODE_LENGTH));
  const [history, setHistory] = useState([]);
  const [startTime, setStartTime] = useState(0);

  const { guess } = history.slice().pop() || {
    guess: new Array(CODE_LENGTH).fill(BLANK_TOKEN).join("")
  };

  const { clue, win, match, lose } = calculateRow(code, guess, history);

  function calculateRow(code, guess, history) {
    const clue = guess
      .split("")
      .map((g, i) =>
        g === code[i] ? EXACT_TOKEN : guess.includes(code[i]) ? ANY_TOKEN : ""
      )
      .sort(v => (v === EXACT_TOKEN ? -1 : 1))
      .join("");

    const match = guess === code;
    const win = match;
    const lose = history.length > MAX_GUESSES;
    return {
      clue,
      match,
      win,
      lose
    };
  }

  function newCode(length = CODE_LENGTH) {
    setCode(getRandomCode(pieces, length));
    setStartTime(0);
    setHistory([]);
  }

  function vegas(length = CODE_LENGTH) {
    return getRandomCode(pieces, length);
  }

  function makeGuess(guess) {
    const newHistory = history.slice();
    const start =
      startTime === 0 && history.length === 0 ? Date.now() : startTime;
    setStartTime(Date.now());
    const { clue, win, match, lose } = calculateRow(code, guess, history);
    const now = Date.now() - start;

    newHistory.push({
      guess,
      clue,
      match,
      win,
      lose,
      code,
      now
    });
    setHistory(newHistory);
  }

  return {
    win,
    lose,

    clue,
    match,

    code,
    newCode,

    history,
    makeGuess,

    vegas
  };
};

export default useCodeBreaker;
