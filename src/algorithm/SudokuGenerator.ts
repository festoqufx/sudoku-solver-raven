import { Board, cloneBoard } from '../utilities/board';

type Difficulty = 'easy' | 'medium' | 'hard';

const REMOVALS: Record<Difficulty, number> = {
	easy: 36,
	medium: 46,
	hard: 54,
};

/** A valid completed Sudoku used as a seed for fast generation. */
const BASE_SOLUTION: Board = [
	[5, 3, 4, 6, 7, 8, 9, 1, 2],
	[6, 7, 2, 1, 9, 5, 3, 4, 8],
	[1, 9, 8, 3, 4, 2, 5, 6, 7],
	[8, 5, 9, 7, 6, 1, 4, 2, 3],
	[4, 2, 6, 8, 5, 3, 7, 9, 1],
	[7, 1, 3, 9, 2, 4, 8, 5, 6],
	[9, 6, 1, 5, 3, 7, 2, 8, 4],
	[2, 8, 7, 4, 1, 9, 6, 3, 5],
	[3, 4, 5, 2, 8, 6, 1, 7, 9],
];

const shuffle = <T,>(items: T[]): T[] => {
	const arr = [...items];
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
};

class SudokuGenerator {
	private shuffleDigits(board: Board): Board {
		const map = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
		return board.map((row) => row.map((n) => map[n - 1]));
	}

	private shuffleBands(board: Board): Board {
		const bands = [0, 1, 2];
		const shuffledBands = shuffle(bands);
		const next = cloneBoard(board);
		for (let b = 0; b < 3; b++) {
			for (let r = 0; r < 3; r++) {
				next[b * 3 + r] = [...board[shuffledBands[b] * 3 + r]];
			}
		}
		return next;
	}

	private shuffleStacks(board: Board): Board {
		const stacks = [0, 1, 2];
		const shuffledStacks = shuffle(stacks);
		return board.map((row) => {
			const nextRow = Array(9).fill(0);
			for (let s = 0; s < 3; s++) {
				for (let c = 0; c < 3; c++) {
					nextRow[s * 3 + c] = row[shuffledStacks[s] * 3 + c];
				}
			}
			return nextRow;
		});
	}

	private shuffleRowsWithinBands(board: Board): Board {
		const next = cloneBoard(board);
		for (let band = 0; band < 3; band++) {
			const rows = shuffle([0, 1, 2]);
			const snapshot = [
				[...board[band * 3]],
				[...board[band * 3 + 1]],
				[...board[band * 3 + 2]],
			];
			for (let r = 0; r < 3; r++) {
				next[band * 3 + r] = snapshot[rows[r]];
			}
		}
		return next;
	}

	private shuffleColsWithinStacks(board: Board): Board {
		let next = cloneBoard(board);
		for (let stack = 0; stack < 3; stack++) {
			const cols = shuffle([0, 1, 2]);
			next = next.map((row) => {
				const snapshot = [row[stack * 3], row[stack * 3 + 1], row[stack * 3 + 2]];
				const copy = [...row];
				for (let c = 0; c < 3; c++) {
					copy[stack * 3 + c] = snapshot[cols[c]];
				}
				return copy;
			});
		}
		return next;
	}

	private createSolvedBoard(): Board {
		let board = cloneBoard(BASE_SOLUTION);
		board = this.shuffleDigits(board);
		board = this.shuffleBands(board);
		board = this.shuffleStacks(board);
		board = this.shuffleRowsWithinBands(board);
		board = this.shuffleColsWithinStacks(board);
		return board;
	}

	private pokeHoles(board: Board, cellsToRemove: number): Board {
		const puzzle = cloneBoard(board);
		const positions = shuffle(
			Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9] as [number, number]),
		);

		let removed = 0;
		for (const [row, col] of positions) {
			if (removed >= cellsToRemove) break;
			if (puzzle[row][col] !== 0) {
				puzzle[row][col] = 0;
				removed += 1;
			}
		}
		return puzzle;
	}

	public generate(difficulty: Difficulty): Board {
		const solved = this.createSolvedBoard();
		return this.pokeHoles(solved, REMOVALS[difficulty]);
	}

	public generateEasyPuzzle(): Board {
		return this.generate('easy');
	}

	public generateMediumPuzzle(): Board {
		return this.generate('medium');
	}

	public generateHardPuzzle(): Board {
		return this.generate('hard');
	}
}

export default SudokuGenerator;
