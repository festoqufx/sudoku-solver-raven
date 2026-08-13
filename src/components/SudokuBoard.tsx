import { useEffect, useRef } from 'react';
import { State } from '../INITIAL_STATE';
import { isDuplicate } from '../utilities/utilities';

export interface Props {
	state: State;
	setState: React.Dispatch<React.SetStateAction<State>>;
}

function SudokuBoard({ state, setState }: Props) {
	const inputRefs = useRef<Array<Array<HTMLInputElement | null>>>(
		Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => null)),
	);

	const selected = state.selected;

	useEffect(() => {
		if (!selected) return;
		const el = inputRefs.current[selected[0]]?.[selected[1]];
		if (el && document.activeElement !== el) {
			el.focus({ preventScroll: true });
		}
	}, [selected]);

	const pushHistory = (board: number[][]) => {
		setState((prev) => ({
			...prev,
			history: [...prev.history.slice(-49), prev.board.map((row) => [...row])],
			board,
			status: prev.status === 'solved' || prev.status === 'failed' ? 'idle' : prev.status,
			iterations: 0,
		}));
	};

	const setCellValue = (row: number, col: number, value: number) => {
		if (state.givens[row][col]) return;
		if (value < 0 || value > 9) return;

		const next = state.board.map((r) => [...r]);
		next[row][col] = value;
		pushHistory(next);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, row: number, col: number) => {
		const raw = e.target.value.replace(/\D/g, '');
		const last = raw.slice(-1);
		const value = last ? Number(last) : 0;
		if (value === 0 || (value >= 1 && value <= 9)) {
			setCellValue(row, col, value);
		}
	};

	const moveSelection = (row: number, col: number) => {
		const nextRow = Math.max(0, Math.min(8, row));
		const nextCol = Math.max(0, Math.min(8, col));
		setState((prev) => ({ ...prev, selected: [nextRow, nextCol] }));
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, row: number, col: number) => {
		switch (e.key) {
			case 'ArrowUp':
				e.preventDefault();
				moveSelection(row - 1, col);
				break;
			case 'ArrowDown':
				e.preventDefault();
				moveSelection(row + 1, col);
				break;
			case 'ArrowLeft':
				e.preventDefault();
				moveSelection(row, col - 1);
				break;
			case 'ArrowRight':
				e.preventDefault();
				moveSelection(row, col + 1);
				break;
			case 'Backspace':
			case 'Delete':
			case '0':
				e.preventDefault();
				setCellValue(row, col, 0);
				break;
			default:
				if (/^[1-9]$/.test(e.key)) {
					e.preventDefault();
					setCellValue(row, col, Number(e.key));
				}
		}
	};

	const selectedValue =
		selected && state.board[selected[0]][selected[1]] !== 0
			? state.board[selected[0]][selected[1]]
			: null;

	return (
		<div className='mx-auto w-full max-w-[min(100%,28rem)]'>
			<div
				role='grid'
				aria-label='Sudoku board'
				className='grid grid-cols-9 overflow-hidden rounded-2xl border-2 border-[var(--fg)] bg-[var(--surface)] shadow-[var(--shadow)]'
			>
				{state.board.map((row, rowIndex) =>
					row.map((cell, colIndex) => {
						const isHighlighted = isDuplicate(cell, rowIndex, colIndex, state.board);
						const isGiven = state.givens[rowIndex][colIndex];
						const isSelected = selected?.[0] === rowIndex && selected?.[1] === colIndex;
						const isPeer =
							!!selected &&
							(selected[0] === rowIndex ||
								selected[1] === colIndex ||
								(Math.floor(selected[0] / 3) === Math.floor(rowIndex / 3) &&
									Math.floor(selected[1] / 3) === Math.floor(colIndex / 3)));
						const isSameNumber = selectedValue !== null && cell === selectedValue && !isSelected;
						const thickRight = colIndex === 2 || colIndex === 5;
						const thickBottom = rowIndex === 2 || rowIndex === 5;

						return (
							<div
								key={`${rowIndex}-${colIndex}`}
								role='gridcell'
								aria-selected={isSelected}
								className={[
									'relative aspect-square border border-[var(--border-strong)]',
									thickRight ? 'border-r-2 border-r-[var(--fg)]' : '',
									thickBottom ? 'border-b-2 border-b-[var(--fg)]' : '',
									isSelected
										? 'bg-[var(--selected-bg)]'
										: isHighlighted
											? 'bg-[var(--conflict-bg)]'
											: isSameNumber
												? 'bg-[var(--same-bg)]'
												: isPeer
													? 'bg-[var(--peer-bg)]'
													: 'bg-[var(--surface)]',
								].join(' ')}
							>
								<input
									id={`cell-${rowIndex}-${colIndex}`}
									ref={(el) => {
										inputRefs.current[rowIndex][colIndex] = el;
									}}
									type='text'
									inputMode='numeric'
									pattern='[1-9]*'
									maxLength={1}
									aria-label={`Row ${rowIndex + 1} column ${colIndex + 1}`}
									readOnly={isGiven}
									value={cell || ''}
									onFocus={() => setState((prev) => ({ ...prev, selected: [rowIndex, colIndex] }))}
									onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
									onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
									className={[
										'h-full w-full bg-transparent text-center font-mono text-lg font-semibold outline-none transition sm:text-xl',
										isSelected ? 'text-[var(--selected-fg)]' : isHighlighted ? 'text-[var(--conflict-fg)]' : 'text-[var(--fg)]',
										isGiven ? 'cursor-default font-bold opacity-90' : 'cursor-text',
									].join(' ')}
								/>
							</div>
						);
					}),
				)}
			</div>
			<p className='mt-3 text-center text-xs text-[var(--muted)] sm:text-sm'>
				Arrow keys to move · 1–9 to enter · Delete to clear
			</p>
		</div>
	);
}

export default SudokuBoard;
