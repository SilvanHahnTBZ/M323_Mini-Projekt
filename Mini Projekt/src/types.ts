// Alle Datentypen sind readonly (immutable) – kein Objekt wird je direkt verändert.

// Funktionaler Datentyp: Result<T, E> – wie Either in Scala / Haskell.
// Entweder ein Erfolg (Ok) oder ein Fehler (Err), nie beides.
// Ermöglicht Fehlerbehandlung ohne Exceptions, rein durch Pattern Matching.
export type Result<T, E> =
  | { readonly kind: 'ok'; readonly value: T }
  | { readonly kind: 'err'; readonly error: E };

// Hilfsfunktionen um Result-Werte zu erstellen (wie Some/None in Scala)
export const ok = <T>(value: T): Result<T, never> => ({ kind: 'ok', value });
export const err = <E>(error: E): Result<never, E> => ({ kind: 'err', error });


export type Task = {
  readonly id: string;
  readonly name: string;
  readonly completed: boolean;
  readonly subtasks: readonly Task[];
};

// Der gesamte App-Zustand: Aufgabenliste + History-Stacks für Undo/Redo
export type AppState = {
  readonly tasks: readonly Task[];
  readonly undoStack: readonly (readonly Task[])[];  // vergangene tasks-Zustände
  readonly redoStack: readonly (readonly Task[])[];  // wiederherstellbare Zustände
};

// Alle möglichen Befehle als Union-Type – ermöglicht Pattern Matching
export type Command =
  | { readonly kind: 'add'; readonly name: string; readonly parentName?: string }
  | { readonly kind: 'complete'; readonly name: string }
  | { readonly kind: 'undo' }
  | { readonly kind: 'redo' }
  | { readonly kind: 'unknown'; readonly input: string };
