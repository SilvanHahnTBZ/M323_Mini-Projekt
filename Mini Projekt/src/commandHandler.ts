// Verbindet Command mit AppState-Transformation.
// Pure Funktion: nimmt State + Command, gibt Result<{state, message}, string> zurück.
// Result ist ein funktionaler Datentyp (wie Either in Scala) – kein isError-Flag nötig.

import { AppState, Command, Result, ok, err } from './types.js';
import { addTask, addSubtask, completeTask, taskExists } from './todoLogic.js';
import { applyAction, undo, redo } from './historyLogic.js';

// Erfolgsfall: neuer State + Nachricht für die Anzeige
export type Success = { readonly state: AppState; readonly message: string };

// Rückgabetyp: entweder Erfolg oder Fehlermeldung als String
export type CommandResult = Result<Success, string>;

// Pattern Matching über switch auf command.kind (Discriminated Union).
// Gibt Result zurück statt einem boolean-Flag – funktionaler Ansatz.
export const handleCommand = (state: AppState, command: Command, idCounter: number): CommandResult => {
  switch (command.kind) {
    case 'add': {
      if (command.parentName !== undefined) {
        if (!taskExists(state.tasks, command.parentName)) {
          // Fehlerfall: err() erzeugt Result mit kind: 'err'
          return err(`Task "${command.parentName}" nicht gefunden.`);
        }
        const newState = applyAction(state, (tasks) =>
          addSubtask(tasks, command.parentName!, command.name, `${idCounter}`),
        );
        return ok({ state: newState, message: `Subtask "${command.name}" zu "${command.parentName}" hinzugefügt.` });
      }
      const newState = applyAction(state, (tasks) =>
        addTask(tasks, command.name, `${idCounter}`),
      );
      return ok({ state: newState, message: `Task "${command.name}" hinzugefügt.` });
    }

    case 'complete': {
      if (!taskExists(state.tasks, command.name)) {
        return err(`Task "${command.name}" nicht gefunden.`);
      }
      const newState = applyAction(state, (tasks) => completeTask(tasks, command.name));
      return ok({ state: newState, message: `Task "${command.name}" als erledigt markiert.` });
    }

    case 'undo': {
      if (state.undoStack.length === 0) {
        return err('Nichts zum Rückgängigmachen.');
      }
      return ok({ state: undo(state), message: 'Letzte Aktion rückgängig gemacht.' });
    }

    case 'redo': {
      if (state.redoStack.length === 0) {
        return err('Nichts zum Wiederherstellen.');
      }
      return ok({ state: redo(state), message: 'Aktion wiederhergestellt.' });
    }

    case 'unknown': {
      const hint = command.input === '' ? '' : ` Eingabe: "${command.input}"`;
      return err(`Unbekannter Befehl.${hint} Tippe "help" für Hilfe.`);
    }
  }
};
