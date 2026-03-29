import { createEl } from '../../../shared/dom';
import './stats-table.scss';

type GameResult = {
  game_id: number;
  user_id: string;
  score: number;
  topic: string;
  difficulty: string;
  topic_id: number;
  used_hints: string;
  wrong_answers_count: number;
};

export function createStatsTable(gameResult: GameResult[]) {
  const questionsPerRound = 10;
  const table = createEl('div', { className: 'stats-table' });
  const headers = [
    'Topic',
    'Score',
    'Wrong Answers',
    '50/50',
    'Call a friend',
    "I don't know",
  ];
  headers.forEach((text) => {
    const cell = createEl('div', { className: 'table-cell' });
    cell.textContent = text;
    table.append(cell);
  });

  gameResult.forEach((row) => {
    const score = questionsPerRound - row.wrong_answers_count;
    const usedHints = JSON.parse(row.used_hints);
    const values = [
      row.topic,
      score,
      row.wrong_answers_count,
      usedHints['50/50'],
      usedHints['call a friend'],
      usedHints["i don't know"],
    ];
    values.forEach((value) => {
      const cell = createEl('div', { className: 'table-cell' });
      cell.textContent = String(value);
      table.append(cell);
    });
  });

  function calculateTotalResults(gameResult: GameResult[]) {
    const total = gameResult.reduce(
      (acc, result) => {
        const usedHints = JSON.parse(result.used_hints);
        acc.score += result.score;
        acc.wrong += result.wrong_answers_count;
        acc['50/50'] += usedHints['50/50'];
        acc['call a friend'] += usedHints['call a friend'];
        acc["i don't know"] += usedHints["i don't know"];
        return acc;
      },
      { score: 0, wrong: 0, '50/50': 0, 'call a friend': 0, "i don't know": 0 }
    );
    return total;
  }
  const total = calculateTotalResults(gameResult);
  const cell = createEl('div', { className: 'total-cell' });
  cell.textContent = 'Total';
  table.append(cell);
  Object.values(total).forEach((value) => {
    const cell = createEl('div', { className: 'total-cell' });
    cell.textContent = String(value);
    table.append(cell);
  });

  return table;
}
