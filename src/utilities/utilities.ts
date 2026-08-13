import { isConflict } from './board';

/** Check if cell value has duplicates in its column, row, and box. */
export const isDuplicate = (
	value: number,
	row: number,
	col: number,
	board: number[][],
): boolean => isConflict(value, row, col, board);
