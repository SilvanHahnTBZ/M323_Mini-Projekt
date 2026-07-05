// Tests für commandHandler – prüft Result-Rückgaben (ok/err Pattern Matching)

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { handleCommand } from '../src/commandHandler.js';
import { initialState } from '../src/historyLogic.js';

describe('handleCommand – add', () => {
  test('gibt ok zurück und fügt Task hinzu', () => {
    const result = handleCommand(initialState, { kind: 'add', name: 'Sport' }, 1);
    assert.equal(result.kind, 'ok');
    if (result.kind === 'ok') {
      assert.equal(result.value.state.tasks.length, 1);
      assert.equal(result.value.state.tasks.at(0)!.name, 'Sport');
    }
  });

  test('gibt ok zurück für Subtask wenn Parent existiert', () => {
    const first = handleCommand(initialState, { kind: 'add', name: 'Projekt' }, 1);
    assert.equal(first.kind, 'ok');
    if (first.kind === 'ok') {
      const second = handleCommand(
        first.value.state,
        { kind: 'add', name: 'Meeting', parentName: 'Projekt' },
        2,
      );
      assert.equal(second.kind, 'ok');
      if (second.kind === 'ok') {
        assert.equal(second.value.state.tasks.at(0)!.subtasks.length, 1);
      }
    }
  });

  test('gibt err zurück wenn Parent nicht existiert', () => {
    const result = handleCommand(
      initialState,
      { kind: 'add', name: 'Sub', parentName: 'NichtVorhanden' },
      1,
    );
    assert.equal(result.kind, 'err');
  });
});

describe('handleCommand – complete', () => {
  test('gibt ok zurück wenn Task existiert', () => {
    const added = handleCommand(initialState, { kind: 'add', name: 'Sport' }, 1);
    assert.equal(added.kind, 'ok');
    if (added.kind === 'ok') {
      const completed = handleCommand(added.value.state, { kind: 'complete', name: 'Sport' }, 2);
      assert.equal(completed.kind, 'ok');
      if (completed.kind === 'ok') {
        assert.equal(completed.value.state.tasks.at(0)!.completed, true);
      }
    }
  });

  test('gibt err zurück wenn Task nicht existiert', () => {
    const result = handleCommand(initialState, { kind: 'complete', name: 'NichtVorhanden' }, 1);
    assert.equal(result.kind, 'err');
  });
});

describe('handleCommand – undo', () => {
  test('gibt ok zurück wenn undoStack nicht leer', () => {
    const added = handleCommand(initialState, { kind: 'add', name: 'Sport' }, 1);
    assert.equal(added.kind, 'ok');
    if (added.kind === 'ok') {
      const undone = handleCommand(added.value.state, { kind: 'undo' }, 1);
      assert.equal(undone.kind, 'ok');
      if (undone.kind === 'ok') {
        assert.equal(undone.value.state.tasks.length, 0);
      }
    }
  });

  test('gibt err zurück wenn undoStack leer', () => {
    const result = handleCommand(initialState, { kind: 'undo' }, 1);
    assert.equal(result.kind, 'err');
  });
});

describe('handleCommand – redo', () => {
  test('gibt ok zurück wenn redoStack nicht leer', () => {
    const added = handleCommand(initialState, { kind: 'add', name: 'Sport' }, 1);
    assert.equal(added.kind, 'ok');
    if (added.kind === 'ok') {
      const undone = handleCommand(added.value.state, { kind: 'undo' }, 1);
      assert.equal(undone.kind, 'ok');
      if (undone.kind === 'ok') {
        const redone = handleCommand(undone.value.state, { kind: 'redo' }, 1);
        assert.equal(redone.kind, 'ok');
        if (redone.kind === 'ok') {
          assert.equal(redone.value.state.tasks.length, 1);
        }
      }
    }
  });

  test('gibt err zurück wenn redoStack leer', () => {
    const result = handleCommand(initialState, { kind: 'redo' }, 1);
    assert.equal(result.kind, 'err');
  });
});

describe('handleCommand – unknown', () => {
  test('gibt immer err zurück', () => {
    const result = handleCommand(initialState, { kind: 'unknown', input: 'xyz' }, 1);
    assert.equal(result.kind, 'err');
  });
});
