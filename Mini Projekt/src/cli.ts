// Side-Effects sind hier isoliert: readline, console.log, process.exit.
// Alle Berechnungen delegieren an pure Funktionen in anderen Modulen.

import * as readline from 'node:readline';
import { AppState } from './types.js';
import { parseCommand } from './parser.js';
import { handleCommand } from './commandHandler.js';
import { renderState, renderError, renderHelp } from './display.js';
import { initialState } from './historyLogic.js';

// Zentraler Ausgabepunkt – console.log nur hier (Anforderung: Ausgaben an einer Stelle)
const print = (text: string): void => {
  console.log(text);
};

// Rekursive Hauptschleife: verarbeitet eine Zeile, ruft sich dann mit neuem State auf.
// Kein while-Loop – funktionale Rekursion statt imperativem Loop.
const loop = (rl: readline.Interface, state: AppState, idCounter: number): void => {
  rl.question('> ', (input) => {
    const trimmed = input.trim();

    if (trimmed === 'exit' || trimmed === 'quit') {
      print('Auf Wiedersehen!');
      rl.close();
      return;
    }

    if (trimmed === 'help' || trimmed === '') {
      print(trimmed === 'help' ? renderHelp() : '');
      loop(rl, state, idCounter);
      return;
    }

    const command = parseCommand(trimmed);
    const result = handleCommand(state, command, idCounter);

    // Pattern Matching auf Result<Success, string> – kein boolean-Flag
    switch (result.kind) {
      case 'ok':
        print(renderState(result.value.state, result.value.message));
        loop(rl, result.value.state, command.kind === 'add' ? idCounter + 1 : idCounter);
        break;
      case 'err':
        print(renderError(result.error));
        print(renderState(state, 'Zustand unverändert'));
        loop(rl, state, idCounter);
        break;
    }
  });
};

// Einstiegspunkt – einzige Funktion mit direkten Side-Effects
const main = (): void => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  print('=== Todo CLI mit Undo/Redo ===');
  print('Tippe "help" für alle Befehle.\n');
  print(renderState(initialState, 'Gestartet'));

  loop(rl, initialState, 1);
};

main();
