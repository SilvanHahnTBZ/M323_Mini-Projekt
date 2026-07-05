// Pure Funktion: parst eine Eingabezeile in einen Command-Typ.
// Pattern Matching über switch/match auf das erste Wort.

import { Command } from './types.js';

// Teilt den Input in Befehl und Argument (pure, keine Side-Effects)
export const parseCommand = (input: string): Command => {
  const trimmed = input.trim();
  const [verb, ...rest] = trimmed.split(/\s+/);
  const arg = rest.join(' ');

  // Pattern Matching: switch auf den Befehlsnamen
  // verb kann undefined sein wenn input leer ist → dann unknown zurückgeben
  switch ((verb ?? '').toLowerCase()) {
    case 'add': {
      if (!arg) return { kind: 'unknown', input: trimmed };
      // Subtask-Syntax: "add Parent/Subtask"
      const slashIndex = arg.indexOf('/');
      if (slashIndex !== -1) {
        const parentName = arg.slice(0, slashIndex).trim();
        const subtaskName = arg.slice(slashIndex + 1).trim();
        if (!parentName || !subtaskName) return { kind: 'unknown', input: trimmed };
        return { kind: 'add', name: subtaskName, parentName };
      }
      return { kind: 'add', name: arg };
    }
    case 'complete':
      if (!arg) return { kind: 'unknown', input: trimmed };
      return { kind: 'complete', name: arg };
    case 'undo':
      return { kind: 'undo' };
    case 'redo':
      return { kind: 'redo' };
    default:
      return { kind: 'unknown', input: trimmed };
  }
};
