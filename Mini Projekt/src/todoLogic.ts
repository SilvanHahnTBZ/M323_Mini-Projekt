// Pure Functions für die Todo-Logik.
// Keine Side-Effects: jede Funktion nimmt Daten entgegen und gibt neue Daten zurück.

import { Task } from './types.js';

// --- Hilfsfunktionen ---

// Generiert eine einfache eindeutige ID (pure, deterministisch bei gleichem Counter)
export const makeId = (counter: number): string => `task-${counter}`;

// Erstellt einen neuen Task (pure constructor)
export const createTask = (id: string, name: string): Task => ({
  id,
  name,
  completed: false,
  subtasks: [],
});

// Prüft rekursiv, ob ein Task abgeschlossen ist.
// Ein Task gilt als completed wenn: completed === true ODER alle Subtasks completed sind (und mind. 1 vorhanden)
export const isEffectivelyCompleted = (task: Task): boolean => {
  if (task.subtasks.length === 0) {
    return task.completed;
  }
  // Rekursion: alle Subtasks müssen effectiv abgeschlossen sein
  return task.subtasks.every(isEffectivelyCompleted);
};

// --- Kern-Operationen (alle pure, geben neue readonly Task[] zurück) ---

// Fügt einen Top-Level-Task zur Liste hinzu (HOF: nutzt map intern nicht, aber immutable spread)
export const addTask = (tasks: readonly Task[], name: string, id: string): readonly Task[] => [
  ...tasks,
  createTask(id, name),
];

// Fügt einen Subtask zu einem bestehenden Task hinzu (rekursive Suche nach Parent)
export const addSubtask = (
  tasks: readonly Task[],
  parentName: string,
  subtaskName: string,
  id: string,
): readonly Task[] =>
  // map ist eine HOF: wendet Funktion auf jedes Element an, gibt neues Array zurück
  tasks.map((task) => {
    if (task.name === parentName) {
      // Gefunden: neuen Subtask anhängen (immutable)
      return { ...task, subtasks: [...task.subtasks, createTask(id, subtaskName)] };
    }
    if (task.subtasks.length > 0) {
      // Rekursion: in Subtasks suchen
      return { ...task, subtasks: addSubtask(task.subtasks, parentName, subtaskName, id) };
    }
    return task;
  });

// Markiert einen Task (oder Subtask) als completed.
// Nach dem Abhaken: wenn alle Subtasks eines Parents fertig sind, wird Parent auto-completed.
export const completeTask = (tasks: readonly Task[], name: string): readonly Task[] =>
  tasks.map((task) => {
    if (task.name === name) {
      // Diesen Task als completed markieren
      return { ...task, completed: true };
    }
    if (task.subtasks.length > 0) {
      // Rekursiv in Subtasks suchen
      const updatedSubtasks = completeTask(task.subtasks, name);
      // Prüfen ob nun alle Subtasks abgeschlossen sind → Parent auto-complete
      const allDone = updatedSubtasks.every(isEffectivelyCompleted);
      return {
        ...task,
        subtasks: updatedSubtasks,
        completed: allDone ? true : task.completed,
      };
    }
    return task;
  });

// Sucht rekursiv nach einem Task-Namen – gibt true zurück wenn gefunden
export const taskExists = (tasks: readonly Task[], name: string): boolean =>
  tasks.some(
    (task) => task.name === name || taskExists(task.subtasks, name),
  );

// Flacht alle Task-Namen rekursiv in eine Liste → demonstriert FlatMap + Rekursion
export const allTaskNames = (tasks: readonly Task[]): readonly string[] =>
  tasks.flatMap((task) => [task.name, ...allTaskNames(task.subtasks)]);

// Zählt alle Tasks + Subtasks rekursiv (demonstriert Rekursion + reduce)
export const countAllTasks = (tasks: readonly Task[]): number =>
  tasks.reduce((acc, task) => acc + 1 + countAllTasks(task.subtasks), 0);

// Filtert nur nicht-abgeschlossene Top-Level-Tasks (HOF: filter)
export const openTasks = (tasks: readonly Task[]): readonly Task[] =>
  tasks.filter((task) => !isEffectivelyCompleted(task));
