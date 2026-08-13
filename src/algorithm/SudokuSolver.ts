import { random, sample } from 'lodash';
import { Board, Coord, cloneBoard, getEmptyCoords } from '../utilities/board';

class SudokuSolver {
	maxIteration: number;
	initialTemperature: number;
	coolingRate: number;
	emptyCells: Coord[];
	initialBoard: Board;
	reheatTo: number;
	reheatAfterX: number;

	constructor(
		board: Board,
		maxIteration: number,
		initialTemperature: number,
		coolingRate: number,
		reheatTo: number,
		reheatAfterX: number,
	) {
		this.maxIteration = maxIteration;
		this.initialTemperature = initialTemperature;
		this.coolingRate = coolingRate;
		this.reheatTo = reheatTo;
		this.reheatAfterX = reheatAfterX;
		this.emptyCells = getEmptyCoords(board);
		this.initialBoard = this.initializeBoard(board);
	}

	initializeBoard(board: Board): Board {
		const newBoard = cloneBoard(board);

		board.forEach((row, y) => {
			const numbers: number[] = row.filter((col) => col !== 0);

			row.forEach((col, x) => {
				if (col === 0) {
					let candidate = random(1, 9);
					let guard = 0;
					while (numbers.includes(candidate) && guard < 20) {
						candidate = random(1, 9);
						guard += 1;
					}
					if (!numbers.includes(candidate)) {
						newBoard[y][x] = candidate;
						numbers.push(candidate);
					} else {
						// Fallback if row already has all digits somehow
						for (let n = 1; n <= 9; n++) {
							if (!numbers.includes(n)) {
								newBoard[y][x] = n;
								numbers.push(n);
								break;
							}
						}
					}
				}
			});
		});

		return newBoard;
	}

	getListCost(arr: number[]): number {
		let cost = 0;
		for (let i = 0; i < arr.length; i++) {
			for (let j = i + 1; j < arr.length; j++) {
				if (arr[i] === arr[j]) cost += 1;
			}
		}
		return cost;
	}

	getSudokuCost(board: Board): number {
		let cost = 0;

		for (let y = 0; y < 9; y++) {
			cost += this.getListCost(board[y]);
		}

		for (let x = 0; x < 9; x++) {
			const col = board.map((row) => row[x]);
			cost += this.getListCost(col);
		}

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				const subgrid: number[] = [];
				for (let y = i * 3; y < (i + 1) * 3; y++) {
					for (let x = j * 3; x < (j + 1) * 3; x++) {
						subgrid.push(board[y][x]);
					}
				}
				cost += this.getListCost(subgrid);
			}
		}

		return cost;
	}

	generateNeighbor(board: Board): Board {
		if (this.emptyCells.length < 2) return cloneBoard(board);

		const newBoard = cloneBoard(board);
		let cell1: Coord | undefined;
		let cell2: Coord | undefined;
		let attempts = 0;

		while (attempts < 50) {
			cell1 = sample(this.emptyCells);
			cell2 = sample(this.emptyCells);
			attempts += 1;
			if (cell1 && cell2 && (cell1[0] !== cell2[0] || cell1[1] !== cell2[1])) break;
		}

		if (cell1 && cell2) {
			const temp = newBoard[cell1[0]][cell1[1]];
			newBoard[cell1[0]][cell1[1]] = newBoard[cell2[0]][cell2[1]];
			newBoard[cell2[0]][cell2[1]] = temp;
		}

		return newBoard;
	}

	solveSudoku(): [Board, boolean, number] {
		if (this.emptyCells.length === 0) {
			const cost = this.getSudokuCost(this.initialBoard);
			return [cloneBoard(this.initialBoard), cost === 0, 0];
		}

		let currentState = cloneBoard(this.initialBoard);
		let currentCost = this.getSudokuCost(currentState);
		let currentTemperature = this.initialTemperature;
		let iteration = 0;

		while (iteration < this.maxIteration) {
			if (currentCost === 0) {
				return [currentState, true, iteration];
			}

			if (iteration > 0 && iteration % this.reheatAfterX === 0) {
				currentTemperature = this.reheatTo;
			}

			const newState = this.generateNeighbor(currentState);
			const newCost = this.getSudokuCost(newState);
			const deltaCost = newCost - currentCost;

			if (deltaCost < 0) {
				currentState = newState;
				currentCost = newCost;
			} else {
				const acceptanceProbability = Math.exp(-deltaCost / Math.max(currentTemperature, 1e-9));
				if (Math.random() < acceptanceProbability) {
					currentState = newState;
					currentCost = newCost;
				}
			}

			iteration += 1;
			currentTemperature *= this.coolingRate;
		}

		return [currentState, false, iteration];
	}
}

export default SudokuSolver;
