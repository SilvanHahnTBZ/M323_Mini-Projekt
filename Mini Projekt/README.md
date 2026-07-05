# Todo CLI – Undo/Redo
### M323 Mini Projekt | Silvan Hahn | TypeScript

---

## Starten

```bash
npm install
npm start
```

## Tests ausführen

```bash
npm test
```

---

## Befehle

| Befehl | Beschreibung |
|--------|-------------|
| `add <name>` | neuen task erstellen |
| `add <parent>/<subtask>` | subtask hinzufügen |
| `complete <name>` | task als erledigt markieren |
| `undo` | letzte aktion rückgängig |
| `redo` | wiederherstellen |
| `help` | alle befehle anzeigen |
| `exit` | beenden |

---

## Beispiel

```
> add Hausaufgaben
> add Hausaufgaben/Mathe
> add Hausaufgaben/Deutsch
> complete Mathe
> complete Deutsch
→ Hausaufgaben wird automatisch erledigt wenn alle subtasks fertig sind
> undo
> redo
```

---

## Projektstruktur

```
src/
├── types.ts           datentypen (Task, AppState, Command)
├── todoLogic.ts       logik (pure functions)
├── historyLogic.ts    undo / redo stack
├── parser.ts          eingabe → command
├── commandHandler.ts  command ausführen
├── display.ts         ausgabe formatieren
└── cli.ts             side effects (console.log, readline)
tests/
├── todoLogic.test.ts
├── historyLogic.test.ts
└── parser.test.ts
```

---

## Umgesetzte FP-Konzepte

| Konzept | wo |
|---------|-----|
| Pure Functions | alle dateien ausser `cli.ts` |
| Immutable Data | `readonly` überall, kein direktes verändern von objekten |
| Rekursion | `completeTask`, `addSubtask`, `taskExists`, `loop` in cli.ts |
| Pattern Matching | `switch` auf `command.kind` in parser + commandHandler |
| Map / FlatMap / Filter / Reduce | `todoLogic.ts` |
| Higher-Order Functions | `applyAction` nimmt transformationsfunktion als parameter |
| Side-Effects isoliert | nur `cli.ts` hat `console.log` |

---

## AI Verwendung

ich habe AI nur punktuell verwendet, nicht das ganze projekt auf einmal generieren lassen.

| was | modell | prompt                                                                                                                                       |
|-----|--------|----------------------------------------------------------------------------------------------------------------------------------------------|
| readonly typen | claude-sonnet-4-6 | "wie mache ich einen typ in typescript komplett immutable mit subtasks"                                                                      |
| undo/redo idee | claude-sonnet-4-6 | "wie funktioniert undo redo ohne mutation, nur mit arrays"                                                                                   |
| tests aufsetzen | claude-sonnet-4-6 | "wie kann ich typescript am einfachsten testen"                                                                                              |
| hof applyAction | claude-sonnet-4-6 | "macht es sinn eine funktion zu schreiben die eine andere funktion als parameter nimmt für die history"                                      |
| rekursion subtasks | claude-sonnet-4-6 | "wie traversiere ich einen baum rekursiv in typescript"                                                                                      |
| completeTask funktion | claude-sonnet-4-6 | "kannst du mir die completeTask funktion machen, sie soll rekursiv durch subtasks gehen und wenn alle fertig sind den parent auto completen" |
| kommentare todoLogic | claude-sonnet-4-6 | "schreibe mir kommentare für diese funktionen damit ich sie besser verstehe"                                                                 |
| renderTask verbessern | claude-sonnet-4-6 | "verbessere diese funktion, sie soll subtasks eingerückt anzeigen mit einem checkbox symbol"                                                 |
| parser fehler | claude-sonnet-4-6 | "warum gibt mein parser bei 'add' ohne argument keinen fehler zurück, kannst du das fixen"                                                   |
| test für auto-complete | claude-sonnet-4-6 | "kannst du mir einen test schreiben der prüft ob der parent automatisch completed wird wenn alle subtasks fertig sind"                       |
| display trennung | claude-sonnet-4-6 | "wie trenne ich die ausgabe von der logik, ich will kein console.log in den pure functions haben"                                            |
| readme | claude-sonnet-4-6 | "mach mir das readme schön und strukturierter den text hab ich ja schon geschrieben"                                                         |
| anforderungen check | claude-sonnet-4-6 | "kannst du schauen ob der code alle anforderungen erfüllt und den check in mein README schreiben"                                            |
| Result typ | claude-sonnet-4-6 | "was sind funktionale datentypen in typescript, so wie Option oder Either in scala, kannst du mir das zeigen" |
| commandHandler tests | claude-sonnet-4-6 | "kannst du tests für den commandHandler schreiben, die prüfen ob ok oder err zurückkommt" |

---

## Anforderungen – Selbstcheck

| Kriterium | erfüllt | wo im code |
|-----------|---------|------------|
| Pure Functions | ja      | alle dateien ausser `cli.ts` |
| Immutable Data | ja      | `readonly` bei allen typen, spread statt mutation |
| Rekursion | ja      | `completeTask`, `addSubtask`, `taskExists`, `allTaskNames`, `countAllTasks`, `loop` in cli.ts |
| Pattern Matching | ja      | `switch` auf `command.kind` in `parser.ts` und `commandHandler.ts` |
| Map / FlatMap / Filter / Reduce | ja      | `map`, `flatMap`, `filter`, `reduce`, `every`, `some` in `todoLogic.ts` und `display.ts` |
| Funktionale Datentypen | ja      | `Result<T, E>` typ in `types.ts` (wie Either in Scala), genutzt in `commandHandler.ts` |
| Higher-Order Functions | ja      | `applyAction` nimmt funktion als parameter, `isEffectivelyCompleted` wird an `every` übergeben |
| Side-Effects isoliert | ja      | `console.log` nur in `cli.ts` in der `print` funktion |
| Konsole als UI | ja      | readline in `cli.ts`, ausgabe zentral über `print` |
| Tests | ja      | 45 tests in `tests/` mit node built-in test runner |
| Libraries | ja      | nur `tsx` und `typescript` als dev tools, keine funktions-libraries |
