import { useEffect, useMemo, useRef } from 'react';
import {
	AiOutlineClear,
	AiOutlineCopy,
	AiOutlineLoading3Quarters,
	AiOutlineUndo,
} from 'react-icons/ai';
import { BiBulb } from 'react-icons/bi';
import { MdOutlineLightbulb } from 'react-icons/md';
import INITIAL_STATE, { DEFAULT_SETTINGS, State } from '../INITIAL_STATE';
import SudokuGenerator from '../algorithm/SudokuGenerator';
import SudokuSolver from '../algorithm/SudokuSolver';
import {
	cloneBoard,
	countConflicts,
	countFilled,
	createGivensMask,
	deserializeBoard,
	formatTime,
	serializeBoard,
	solveWithBacktracking,
} from '../utilities/board';
import { Props } from './SudokuBoard';

function Interactions({ setState, state }: Props) {
	const timerRef = useRef<number | null>(null);

	useEffect(() => {
		if (state.timerStartedAt && state.status !== 'solved') {
			timerRef.current = window.setInterval(() => {
				setState((prev) => {
					if (!prev.timerStartedAt) return prev;
					return { ...prev, elapsedMs: Date.now() - prev.timerStartedAt };
				});
			}, 250);
		}
		return () => {
			if (timerRef.current) window.clearInterval(timerRef.current);
		};
	}, [state.timerStartedAt, state.status, setState]);

	const conflicts = useMemo(() => countConflicts(state.board), [state.board]);
	const filled = useMemo(() => countFilled(state.board), [state.board]);
	const progress = Math.round((filled / 81) * 100);

	const ensureTimer = (prev: State): State => {
		if (prev.timerStartedAt) return prev;
		return { ...prev, timerStartedAt: Date.now(), elapsedMs: 0 };
	};

	const solveSudoku = (): void => {
		const snapshot = cloneBoard(state.board);
		const { maxIter, initTemp, coolingRate, reheatTo, reheatForX } = state;

		setState((prev) => ({
			...ensureTimer(prev),
			loading: { ...prev.loading, solve: true },
			status: 'solving',
			notes: '',
		}));

		window.setTimeout(() => {
			const solver = new SudokuSolver(snapshot, maxIter, initTemp, coolingRate, reheatTo, reheatForX);
			const [solvedBoard, ok, iterations] = solver.solveSudoku();

			setState((prev) => ({
				...prev,
				history: [...prev.history.slice(-49), cloneBoard(prev.board)],
				board: solvedBoard,
				status: ok ? 'solved' : 'failed',
				iterations,
				loading: { ...prev.loading, solve: false },
				elapsedMs: prev.timerStartedAt ? Date.now() - prev.timerStartedAt : prev.elapsedMs,
				notes: ok
					? `Solved in ${iterations.toLocaleString()} iterations.`
					: 'Search finished without a full solution. Try again or adjust settings.',
			}));
		}, 40);
	};

	const generateSudoku = (difficulty: 'easy' | 'medium' | 'hard'): void => {
		setState((prev) => ({
			...prev,
			loading: { ...prev.loading, [difficulty]: true },
		}));

		window.setTimeout(() => {
			const generator = new SudokuGenerator();
			const generatedPuzzle = generator.generate(difficulty);

			setState((prev) => ({
				...prev,
				board: generatedPuzzle,
				givens: createGivensMask(generatedPuzzle),
				history: [],
				selected: [0, 0],
				loading: { ...prev.loading, [difficulty]: false },
				status: 'idle',
				iterations: 0,
				difficulty,
				timerStartedAt: Date.now(),
				elapsedMs: 0,
				notes: '',
			}));
		}, 40);
	};

	const clearAnswers = (): void => {
		const next = cloneBoard(state.board);
		for (let r = 0; r < 9; r++) {
			for (let c = 0; c < 9; c++) {
				if (!state.givens[r][c]) next[r][c] = 0;
			}
		}
		setState((prev) => ({
			...prev,
			history: [...prev.history.slice(-49), cloneBoard(prev.board)],
			board: next,
			status: 'idle',
			iterations: 0,
		}));
	};

	const clearBoard = (): void => {
		setState((prev) => ({
			...prev,
			history: [...prev.history.slice(-49), cloneBoard(prev.board)],
			board: INITIAL_STATE.board.map((row) => [...row]),
			givens: INITIAL_STATE.givens.map((row) => [...row]),
			status: 'idle',
			iterations: 0,
			difficulty: null,
			timerStartedAt: null,
			elapsedMs: 0,
		}));
	};

	const undo = (): void => {
		setState((prev) => {
			if (prev.history.length === 0) return prev;
			const history = [...prev.history];
			const board = history.pop()!;
			return {
				...prev,
				history,
				board,
				status: 'idle',
				iterations: 0,
			};
		});
	};

	const applyHint = (): void => {
		const solution = solveWithBacktracking(state.board);
		if (!solution) {
			setState((prev) => ({ ...prev, notes: 'No valid solution from the current board.' }));
			return;
		}

		const empties: [number, number][] = [];
		for (let r = 0; r < 9; r++) {
			for (let c = 0; c < 9; c++) {
				if (state.board[r][c] === 0) empties.push([r, c]);
			}
		}
		if (empties.length === 0) {
			setState((prev) => ({ ...prev, notes: 'Board is already complete.' }));
			return;
		}

		const [row, col] = empties[Math.floor(Math.random() * empties.length)];
		const next = cloneBoard(state.board);
		next[row][col] = solution[row][col];

		setState((prev) => ({
			...ensureTimer(prev),
			history: [...prev.history.slice(-49), cloneBoard(prev.board)],
			board: next,
			selected: [row, col],
			status: 'idle',
			notes: `Hint placed at row ${row + 1}, column ${col + 1}.`,
		}));
	};

	const copyPuzzle = async (): Promise<void> => {
		const text = serializeBoard(state.board);
		try {
			await navigator.clipboard.writeText(text);
			setState((prev) => ({ ...prev, notes: 'Puzzle string copied to clipboard.' }));
		} catch {
			setState((prev) => ({ ...prev, notes: `Copy manually: ${text}` }));
		}
	};

	const pastePuzzle = async (): Promise<void> => {
		try {
			const text = await navigator.clipboard.readText();
			const board = deserializeBoard(text);
			if (!board) {
				setState((prev) => ({ ...prev, notes: 'Clipboard must contain an 81-character puzzle (digits or dots).' }));
				return;
			}
			setState((prev) => ({
				...prev,
				history: [...prev.history.slice(-49), cloneBoard(prev.board)],
				board,
				givens: createGivensMask(board),
				status: 'idle',
				iterations: 0,
				difficulty: null,
				timerStartedAt: Date.now(),
				elapsedMs: 0,
				notes: 'Puzzle pasted from clipboard.',
			}));
		} catch {
			setState((prev) => ({ ...prev, notes: 'Unable to read clipboard.' }));
		}
	};

	const placeNumber = (value: number): void => {
		const selected = state.selected;
		if (!selected) return;
		const [row, col] = selected;
		if (state.givens[row][col]) return;

		const next = cloneBoard(state.board);
		next[row][col] = value;

		setState((prev) => ({
			...ensureTimer(prev),
			history: [...prev.history.slice(-49), cloneBoard(prev.board)],
			board: next,
			status: 'idle',
			iterations: 0,
		}));
	};

	const resetSettings = () => {
		setState((prev) => ({
			...prev,
			...DEFAULT_SETTINGS,
		}));
	};

	const {
		loading: { solve, easy, medium, hard },
		openAS,
		status,
	} = state;

	const solveLabel =
		status === 'solving'
			? 'Solving…'
			: status === 'solved'
				? 'Solved — run again'
				: status === 'failed'
					? 'Not solved — try again'
					: 'Solve with Simulated Annealing';

	return (
		<div className='flex h-full flex-col gap-5'>
			<div>
				<h2 className='text-lg font-semibold tracking-tight text-[var(--fg)]'>Controls</h2>
				<p className='mt-1 text-sm leading-6 text-[var(--muted)]'>
					Generate a puzzle, enter digits, or let simulated annealing search for a solution.
				</p>
			</div>

			<div className='grid grid-cols-3 gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-3 text-center text-xs sm:text-sm'>
				<div>
					<p className='uppercase tracking-[0.18em] text-[var(--muted)]'>Time</p>
					<p className='mt-1 font-mono text-base font-semibold text-[var(--fg)]'>{formatTime(state.elapsedMs)}</p>
				</div>
				<div>
					<p className='uppercase tracking-[0.18em] text-[var(--muted)]'>Filled</p>
					<p className='mt-1 font-mono text-base font-semibold text-[var(--fg)]'>{progress}%</p>
				</div>
				<div>
					<p className='uppercase tracking-[0.18em] text-[var(--muted)]'>Conflicts</p>
					<p className='mt-1 font-mono text-base font-semibold text-[var(--fg)]'>{conflicts}</p>
				</div>
			</div>

			<div>
				<p className='mb-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]'>Generate</p>
				<div className='grid gap-2 sm:grid-cols-3'>
					{(
						[
							['easy', easy, 'Easy'],
							['medium', medium, 'Medium'],
							['hard', hard, 'Hard'],
						] as const
					).map(([key, loading, label]) => (
						<button
							key={key}
							type='button'
							onClick={() => generateSudoku(key)}
							className='inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm font-medium text-[var(--fg)] transition hover:bg-[var(--surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]'
						>
							{loading ? <AiOutlineLoading3Quarters className='animate-spin' aria-hidden /> : null}
							{label}
						</button>
					))}
				</div>
			</div>

			<div>
				<p className='mb-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]'>Number pad</p>
				<div className='grid grid-cols-5 gap-2 sm:grid-cols-10'>
					{[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
						<button
							key={n}
							type='button'
							onClick={() => placeNumber(n)}
							aria-label={n === 0 ? 'Clear cell' : `Enter ${n}`}
							className='rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2.5 font-mono text-sm font-semibold text-[var(--fg)] transition hover:bg-[var(--fg)] hover:text-[var(--bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]'
						>
							{n === 0 ? '⌫' : n}
						</button>
					))}
				</div>
			</div>

			<div className='grid gap-2 sm:grid-cols-2'>
				<button type='button' onClick={undo} disabled={state.history.length === 0} className='btn-secondary disabled:opacity-40'>
					<AiOutlineUndo aria-hidden /> Undo
				</button>
				<button type='button' onClick={applyHint} className='btn-secondary'>
					<MdOutlineLightbulb aria-hidden /> Hint
				</button>
				<button type='button' onClick={clearAnswers} className='btn-secondary'>
					<AiOutlineClear aria-hidden /> Clear Answers
				</button>
				<button type='button' onClick={clearBoard} className='btn-secondary'>
					Clear Board
				</button>
				<button type='button' onClick={copyPuzzle} className='btn-secondary'>
					<AiOutlineCopy aria-hidden /> Copy Puzzle
				</button>
				<button type='button' onClick={pastePuzzle} className='btn-secondary'>
					Paste Puzzle
				</button>
			</div>

			<div>
				<button
					type='button'
					onClick={() => setState((prev) => ({ ...prev, openAS: !prev.openAS }))}
					className='inline-flex items-center gap-2 text-sm font-medium text-[var(--fg)] underline decoration-[var(--border-strong)] underline-offset-4 transition hover:opacity-80'
					aria-expanded={openAS}
				>
					Advanced Settings
				</button>
				<p className='mt-1 text-xs leading-5 text-[var(--muted)]'>
					High temperatures with huge iteration counts can freeze the tab while searching.
				</p>
			</div>

			{openAS ? (
				<div className='space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4'>
					<div className='grid gap-3 sm:grid-cols-2'>
						<label className='block text-xs'>
							<span className='mb-1 block uppercase tracking-[0.18em] text-[var(--muted)]'>Max Iteration</span>
							<input
								value={state.maxIter}
								onChange={(e) => setState((prev) => ({ ...prev, maxIter: Number(e.target.value) || 0 }))}
								className='field'
								type='number'
								min={1000}
							/>
						</label>
						<label className='block text-xs'>
							<span className='mb-1 block uppercase tracking-[0.18em] text-[var(--muted)]'>Initial Temperature</span>
							<input
								value={state.initTemp}
								onChange={(e) => setState((prev) => ({ ...prev, initTemp: Number(e.target.value) || 0 }))}
								step='0.01'
								className='field'
								type='number'
								min={0.2}
								max={2}
							/>
						</label>
						<label className='block text-xs'>
							<span className='mb-1 block uppercase tracking-[0.18em] text-[var(--muted)]'>Cooling Rate</span>
							<input
								value={state.coolingRate}
								onChange={(e) => setState((prev) => ({ ...prev, coolingRate: Number(e.target.value) || 0 }))}
								step='0.001'
								className='field'
								type='number'
								min={0.05}
								max={0.999}
							/>
						</label>
						<label className='block text-xs'>
							<span className='mb-1 block uppercase tracking-[0.18em] text-[var(--muted)]'>Reheat To</span>
							<input
								value={state.reheatTo}
								onChange={(e) => setState((prev) => ({ ...prev, reheatTo: Number(e.target.value) || 0 }))}
								step='0.01'
								className='field'
								type='number'
								min={0.1}
								max={2}
							/>
						</label>
					</div>
					<label className='block text-xs'>
						<span className='mb-1 block uppercase tracking-[0.18em] text-[var(--muted)]'>Reheat every X iterations</span>
						<input
							value={state.reheatForX}
							onChange={(e) => setState((prev) => ({ ...prev, reheatForX: Number(e.target.value) || 0 }))}
							min={100}
							className='field'
							type='number'
						/>
					</label>
					<button type='button' onClick={resetSettings} className='btn-secondary w-full'>
						Reset Settings
					</button>
				</div>
			) : null}

			<button
				type='button'
				onClick={solveSudoku}
				disabled={solve}
				className='inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--fg)] px-4 py-3.5 text-sm font-semibold text-[var(--bg)] transition hover:opacity-90 disabled:cursor-wait disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]'
			>
				{solve ? <AiOutlineLoading3Quarters className='animate-spin' aria-hidden /> : <BiBulb aria-hidden />}
				{solveLabel}
			</button>

			{state.notes ? (
				<p className='rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm text-[var(--muted)]' role='status'>
					{state.notes}
				</p>
			) : null}

			{state.difficulty ? (
				<p className='text-xs uppercase tracking-[0.18em] text-[var(--muted)]'>
					Difficulty · {state.difficulty}
				</p>
			) : null}
		</div>
	);
}

export default Interactions;
