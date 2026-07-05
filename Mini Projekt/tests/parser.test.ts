// Tests für den Command-Parser

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { parseCommand } from '../src/parser.js';

describe('parseCommand', () => {
  test('parst "add <name>" korrekt', () => {
    const cmd = parseCommand('add Einkaufen');
    assert.equal(cmd.kind, 'add');
    if (cmd.kind === 'add') {
      assert.equal(cmd.name, 'Einkaufen');
      assert.equal(cmd.parentName, undefined);
    }
  });

  test('parst "add <parent>/<subtask>" korrekt', () => {
    const cmd = parseCommand('add Projekt/Meeting');
    assert.equal(cmd.kind, 'add');
    if (cmd.kind === 'add') {
      assert.equal(cmd.name, 'Meeting');
      assert.equal(cmd.parentName, 'Projekt');
    }
  });

  test('parst "complete <name>" korrekt', () => {
    const cmd = parseCommand('complete Sport');
    assert.equal(cmd.kind, 'complete');
    if (cmd.kind === 'complete') assert.equal(cmd.name, 'Sport');
  });

  test('parst "undo" korrekt', () => {
    assert.equal(parseCommand('undo').kind, 'undo');
  });

  test('parst "redo" korrekt', () => {
    assert.equal(parseCommand('redo').kind, 'redo');
  });

  test('gibt unknown bei unbekanntem Befehl zurück', () => {
    const cmd = parseCommand('delete Sport');
    assert.equal(cmd.kind, 'unknown');
  });

  test('ist case-insensitive beim Befehlswort', () => {
    assert.equal(parseCommand('ADD Sport').kind, 'add');
    assert.equal(parseCommand('UNDO').kind, 'undo');
  });

  test('gibt unknown bei "add" ohne Argument zurück', () => {
    assert.equal(parseCommand('add').kind, 'unknown');
  });
});
