// Tests für pure Funktionen in todoLogic.ts
// Verwendet Node.js built-in test runner (keine externe Test-Library nötig)

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  createTask,
  addTask,
  addSubtask,
  completeTask,
  isEffectivelyCompleted,
  taskExists,
  allTaskNames,
  countAllTasks,
  openTasks,
} from '../src/todoLogic.js';

describe('createTask', () => {
  test('erstellt einen Task mit korrekten Standardwerten', () => {
    const task = createTask('1', 'Einkaufen');
    assert.equal(task.id, '1');
    assert.equal(task.name, 'Einkaufen');
    assert.equal(task.completed, false);
    assert.deepEqual(task.subtasks, []);
  });
});

describe('addTask', () => {
  test('fügt einen Task zur leeren Liste hinzu', () => {
    const tasks = addTask([], 'Einkaufen', '1');
    assert.equal(tasks.length, 1);
    assert.equal(tasks.at(0)!.name, 'Einkaufen');
  });

  test('mutiert die ursprüngliche Liste nicht (immutability)', () => {
    const original = Object.freeze([createTask('1', 'Alt')]);
    const updated = addTask(original, 'Neu', '2');
    assert.equal(original.length, 1);
    assert.equal(updated.length, 2);
  });
});

describe('addSubtask', () => {
  test('fügt einen Subtask zum richtigen Parent hinzu', () => {
    const tasks = addTask([], 'Projekt', '1');
    const withSub = addSubtask(tasks, 'Projekt', 'Meeting', '2');
    assert.equal(withSub.at(0)!.subtasks.length, 1);
    assert.equal(withSub.at(0)!.subtasks.at(0)!.name, 'Meeting');
  });

  test('gibt unveränderte Liste zurück wenn Parent nicht existiert', () => {
    const tasks = addTask([], 'Projekt', '1');
    const result = addSubtask(tasks, 'NichtVorhanden', 'Sub', '2');
    assert.equal(result.at(0)!.subtasks.length, 0);
  });
});

describe('completeTask', () => {
  test('markiert einen Task als completed', () => {
    const tasks = addTask([], 'Sport', '1');
    const completed = completeTask(tasks, 'Sport');
    assert.equal(completed.at(0)!.completed, true);
  });

  test('completed einen Task nicht wenn er nicht existiert', () => {
    const tasks = addTask([], 'Sport', '1');
    const result = completeTask(tasks, 'Lesen');
    assert.equal(result.at(0)!.completed, false);
  });

  test('auto-completed Parent wenn alle Subtasks fertig sind', () => {
    let tasks = addTask([], 'Projekt', '1');
    tasks = addSubtask(tasks, 'Projekt', 'Sub A', '2');
    tasks = addSubtask(tasks, 'Projekt', 'Sub B', '3');
    tasks = completeTask(tasks, 'Sub A');
    tasks = completeTask(tasks, 'Sub B');
    assert.equal(tasks.at(0)!.completed, true);
  });

  test('auto-completed Parent NICHT wenn nur ein Subtask fertig ist', () => {
    let tasks = addTask([], 'Projekt', '1');
    tasks = addSubtask(tasks, 'Projekt', 'Sub A', '2');
    tasks = addSubtask(tasks, 'Projekt', 'Sub B', '3');
    tasks = completeTask(tasks, 'Sub A');
    assert.equal(tasks.at(0)!.completed, false);
  });
});

describe('isEffectivelyCompleted', () => {
  test('gibt true zurück für completed Task ohne Subtasks', () => {
    const task = { ...createTask('1', 'Test'), completed: true };
    assert.equal(isEffectivelyCompleted(task), true);
  });

  test('gibt false zurück für offenen Task ohne Subtasks', () => {
    assert.equal(isEffectivelyCompleted(createTask('1', 'Test')), false);
  });

  test('gibt true wenn alle Subtasks completed sind (rekursiv)', () => {
    const sub = { ...createTask('2', 'Sub'), completed: true };
    const parent = { ...createTask('1', 'Parent'), subtasks: [sub] };
    assert.equal(isEffectivelyCompleted(parent), true);
  });
});

describe('taskExists', () => {
  test('findet einen Task in der Liste', () => {
    const tasks = addTask([], 'Sport', '1');
    assert.equal(taskExists(tasks, 'Sport'), true);
  });

  test('findet einen Subtask rekursiv', () => {
    let tasks = addTask([], 'Projekt', '1');
    tasks = addSubtask(tasks, 'Projekt', 'Meeting', '2');
    assert.equal(taskExists(tasks, 'Meeting'), true);
  });

  test('gibt false zurück wenn Task nicht existiert', () => {
    const tasks = addTask([], 'Sport', '1');
    assert.equal(taskExists(tasks, 'Lesen'), false);
  });
});

describe('allTaskNames', () => {
  test('gibt alle Namen inkl. Subtasks zurück (flatMap)', () => {
    let tasks = addTask([], 'Projekt', '1');
    tasks = addSubtask(tasks, 'Projekt', 'Meeting', '2');
    const names = allTaskNames(tasks);
    assert.deepEqual([...names], ['Projekt', 'Meeting']);
  });
});

describe('countAllTasks', () => {
  test('zählt Tasks und Subtasks rekursiv', () => {
    let tasks = addTask([], 'A', '1');
    tasks = addTask(tasks, 'B', '2');
    tasks = addSubtask(tasks, 'A', 'A1', '3');
    assert.equal(countAllTasks(tasks), 3);
  });
});

describe('openTasks', () => {
  test('filtert abgeschlossene Tasks heraus', () => {
    let tasks = addTask([], 'Sport', '1');
    tasks = addTask(tasks, 'Lesen', '2');
    tasks = completeTask(tasks, 'Sport');
    const open = openTasks(tasks);
    assert.equal(open.length, 1);
    assert.equal(open.at(0)!.name, 'Lesen');
  });
});
