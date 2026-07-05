// Tests für Undo/Redo Logik

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { applyAction, undo, redo, initialState } from '../src/historyLogic.js';
import { addTask } from '../src/todoLogic.js';

describe('applyAction', () => {
  test('wendet Transformation an und speichert alten State im undoStack', () => {
    const state = applyAction(initialState, (tasks) => addTask(tasks, 'Sport', '1'));
    assert.equal(state.tasks.length, 1);
    assert.equal(state.undoStack.length, 1);        // alter Zustand gespeichert
    assert.equal(state.undoStack.at(0)!.length, 0); // alter Zustand war leer
    assert.equal(state.redoStack.length, 0);        // redo geleert
  });

  test('löscht redoStack bei neuer Aktion', () => {
    let state = applyAction(initialState, (tasks) => addTask(tasks, 'A', '1'));
    state = undo(state);
    assert.equal(state.redoStack.length, 1);
    state = applyAction(state, (tasks) => addTask(tasks, 'B', '2'));
    assert.equal(state.redoStack.length, 0);
  });
});

describe('undo', () => {
  test('macht letzte Aktion rückgängig', () => {
    let state = applyAction(initialState, (tasks) => addTask(tasks, 'Sport', '1'));
    state = applyAction(state, (tasks) => addTask(tasks, 'Lesen', '2'));
    state = undo(state);
    assert.equal(state.tasks.length, 1);
    assert.equal(state.tasks.at(0)!.name, 'Sport');
  });

  test('verschiebt aktuellen State in redoStack beim Undo', () => {
    let state = applyAction(initialState, (tasks) => addTask(tasks, 'Sport', '1'));
    const tasksBeforeUndo = state.tasks;
    state = undo(state);
    assert.equal(state.redoStack.length, 1);
    assert.deepEqual([...state.redoStack.at(0)!], [...tasksBeforeUndo]);
  });

  test('gibt unveränderten State zurück wenn undoStack leer', () => {
    const result = undo(initialState);
    assert.deepEqual(result, initialState);
  });

  test('mehrfaches Undo funktioniert', () => {
    let state = applyAction(initialState, (tasks) => addTask(tasks, 'A', '1'));
    state = applyAction(state, (tasks) => addTask(tasks, 'B', '2'));
    state = applyAction(state, (tasks) => addTask(tasks, 'C', '3'));
    state = undo(state);
    state = undo(state);
    assert.equal(state.tasks.length, 1);
    assert.equal(state.tasks.at(0)!.name, 'A');
  });
});

describe('redo', () => {
  test('stellt rückgängig gemachte Aktion wieder her', () => {
    let state = applyAction(initialState, (tasks) => addTask(tasks, 'Sport', '1'));
    state = undo(state);
    assert.equal(state.tasks.length, 0);
    state = redo(state);
    assert.equal(state.tasks.length, 1);
    assert.equal(state.tasks.at(0)!.name, 'Sport');
  });

  test('gibt unveränderten State zurück wenn redoStack leer', () => {
    const result = redo(initialState);
    assert.deepEqual(result, initialState);
  });

  test('undo → redo → undo funktioniert korrekt', () => {
    let state = applyAction(initialState, (tasks) => addTask(tasks, 'Sport', '1'));
    state = undo(state);
    state = redo(state);
    state = undo(state);
    assert.equal(state.tasks.length, 0);
  });
});
