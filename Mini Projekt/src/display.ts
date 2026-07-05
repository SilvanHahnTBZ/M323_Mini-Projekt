// Pure Funktionen für die Ausgabe.
// Kein console.log hier – nur Strings erzeugen. Die CLI-Schicht gibt sie aus.
// So ist Businesslogik von Benutzeroberfläche getrennt.

import { AppState, Task } from './types.js';
import { isEffectivelyCompleted } from './todoLogic.js';

// Rendert einen einzelnen Task inkl. Subtasks als String (rekursiv, mit Einrückung)
const renderTask = (task: Task, indent: number): string => {
  const prefix = '  '.repeat(indent);
  const checkbox = isEffectivelyCompleted(task) ? '[x]' : '[ ]';
  const line = `${prefix}${checkbox} ${task.name}`;

  if (task.subtasks.length === 0) {
    return line;
  }

  // Rekursion: Subtasks mit erhöhter Einrückung rendern, dann per join verbinden
  const subtaskLines = task.subtasks.map((sub) => renderTask(sub, indent + 1));
  return [line, ...subtaskLines].join('\n');
};

// Rendert die gesamte Task-Liste als String
export const renderTaskList = (tasks: readonly Task[]): string => {
  if (tasks.length === 0) {
    return '(Keine Aufgaben vorhanden)';
  }
  // map (HOF) + join kombiniert alle Task-Strings
  return tasks.map((task) => renderTask(task, 0)).join('\n');
};

// Erzeugt den vollständigen Ausgabe-String nach einer Aktion
export const renderState = (state: AppState, message: string): string => {
  const separator = '─'.repeat(40);
  const undoInfo = `Undo: ${state.undoStack.length} | Redo: ${state.redoStack.length}`;
  return [
    separator,
    `→ ${message}`,
    separator,
    renderTaskList(state.tasks),
    '',
    undoInfo,
  ].join('\n');
};

// Fehlermeldung als String (kein console.error hier, Trennung bleibt gewahrt)
export const renderError = (message: string): string => `✗ Fehler: ${message}`;

// Hilfeanzeige
export const renderHelp = (): string =>
  [
    'Befehle:',
    '  add <name>                  Neuen Task hinzufügen',
    '  add <parent>/<subtask>      Subtask zu bestehendem Task hinzufügen',
    '  complete <name>             Task als erledigt markieren',
    '  undo                        Letzte Aktion rückgängig machen',
    '  redo                        Rückgängig gemachte Aktion wiederherstellen',
    '  help                        Diese Hilfe anzeigen',
    '  exit                        Programm beenden',
  ].join('\n');
