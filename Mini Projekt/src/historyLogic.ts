// Pure Functions für Undo/Redo.
// Der aktuelle Zustand (tasks) wird vor jeder Aktion auf den undoStack gelegt.
// Redo-Stack wird bei jeder neuen Aktion geleert.

import { AppState, Task } from './types.js';

// Wendet eine Zustandsänderung an und speichert den alten Zustand im undoStack.
// Das ist eine HOF: sie nimmt eine Transformationsfunktion und gibt den neuen AppState zurück.
export const applyAction = (
  state: AppState,
  transform: (tasks: readonly Task[]) => readonly Task[],
): AppState => ({
  tasks: transform(state.tasks),
  undoStack: [...state.undoStack, state.tasks], // alter Zustand wird gespeichert
  redoStack: [],                                 // neue Aktion löscht Redo-History
});

// Macht die letzte Aktion rückgängig.
// Pattern: Stack-Logik mit immutable Arrays (kein pop/push, sondern slice)
export const undo = (state: AppState): AppState => {
  if (state.undoStack.length === 0) {
    // Nichts zum Rückgängigmachen
    return state;
  }
  // Letzten Zustand aus undoStack nehmen (rekursiv wäre auch möglich, hier klarer mit slice)
  // .at(-1) gibt undefined zurück wenn leer – wir haben aber oben schon geprüft dass length > 0
  const previousTasks = state.undoStack.at(-1)!;
  return {
    tasks: previousTasks,
    undoStack: state.undoStack.slice(0, -1),            // Stack ohne letztes Element
    redoStack: [state.tasks, ...state.redoStack],        // aktueller Zustand → redoStack
  };
};

// Stellt die letzte rückgängig gemachte Aktion wieder her.
export const redo = (state: AppState): AppState => {
  if (state.redoStack.length === 0) {
    return state;
  }
  const nextTasks = state.redoStack.at(0)!;
  return {
    tasks: nextTasks,
    undoStack: [...state.undoStack, state.tasks],  // aktueller Zustand → undoStack
    redoStack: state.redoStack.slice(1),            // erstes Element entfernen
  };
};

// Initialer App-Zustand (leere Listen)
export const initialState: AppState = {
  tasks: [],
  undoStack: [],
  redoStack: [],
};
