export type Board = number[][];
export type Coord = [number, number];

export const emptyBoard = (): Board =>
	Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0));

export const cloneBoard = (board: Board): Board => board.map((row) => [...row]);

export const boardsEqual = (a: Board, b: Board): boolean => {
	for (let r = 0; r < 9; r++) {
		for (let c = 0; c < 9; c++) {
			if (a[r][c] !== b[r][c]) return false;
		}
	}
	return true;
};

export const countFilled = (board: Board): number =>
	board.reduce((sum, row) => sum + row.filter((n) => n !== 0).length, 0);

export const getEmptyCoords = (board: Board): Coord[] => {
	const cells: Coord[] = [];
	for (let r = 0; r < 9; r++) {
		for (let c = 0; c < 9; c++) {
			if (!board[r][c]) cells.push([r, c]);
		}
	}
	return cells;
};

export const serializeBoard = (board: Board): string =>
	board.flat().map((n) => (n === 0 ? '.' : String(n))).join('');

export const deserializeBoard = (raw: string): Board | null => {
	const cleaned = raw.trim().replace(/[^0-9.]/g, '');
	if (cleaned.length !== 81) return null;

	const board = emptyBoard();
	for (let i = 0; i < 81; i++) {
		const ch = cleaned[i];
		board[Math.floor(i / 9)][i % 9] = ch === '.' || ch === '0' ? 0 : Number(ch);
	}
	return board;
};

export const createGivensMask = (board: Board): boolean[][] =>
	board.map((row) => row.map((cell) => cell !== 0));

/** Fast deterministic backtracking solver for hints / validation. */
export const solveWithBacktracking = (input: Board): Board | null => {
	const board = cloneBoard(input);

	const isValid = (row: number, col: number, value: number): boolean => {
		for (let i = 0; i < 9; i++) {
			if (board[row][i] === value || board[i][col] === value) return false;
		}
		const boxRow = Math.floor(row / 3) * 3;
		const boxCol = Math.floor(col / 3) * 3;
		for (let r = boxRow; r < boxRow + 3; r++) {
			for (let c = boxCol; c < boxCol + 3; c++) {
				if (board[r][c] === value) return false;
			}
		}
		return true;
	};

	const findEmpty = (): Coord | null => {
		for (let r = 0; r < 9; r++) {
			for (let c = 0; c < 9; c++) {
				if (board[r][c] === 0) return [r, c];
			}
		}
		return null;
	};

	const solve = (): boolean => {
		const empty = findEmpty();
		if (!empty) return true;
		const [row, col] = empty;
		for (let value = 1; value <= 9; value++) {
			if (isValid(row, col, value)) {
				board[row][col] = value;
				if (solve()) return true;
				board[row][col] = 0;
			}
		}
		return false;
	};

	return solve() ? board : null;
};

export const countConflicts = (board: Board): number => {
	let conflicts = 0;
	for (let r = 0; r < 9; r++) {
		for (let c = 0; c < 9; c++) {
			const value = board[r][c];
			if (value === 0) continue;
			if (isConflict(value, r, c, board)) conflicts += 1;
		}
	}
	return conflicts;
};

export const isConflict = (value: number, row: number, col: number, board: Board): boolean => {
	if (value === 0) return false;

	const rowHits = board[row].filter((n) => n === value).length;
	if (rowHits > 1) return true;

	const colHits = board.map((r) => r[col]).filter((n) => n === value).length;
	if (colHits > 1) return true;

	const boxRow = Math.floor(row / 3) * 3;
	const boxCol = Math.floor(col / 3) * 3;
	let boxHits = 0;
	for (let r = boxRow; r < boxRow + 3; r++) {
		for (let c = boxCol; c < boxCol + 3; c++) {
			if (board[r][c] === value) boxHits += 1;
		}
	}
	return boxHits > 1;
};

export const formatTime = (ms: number): string => {
	const totalSeconds = Math.floor(ms / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
