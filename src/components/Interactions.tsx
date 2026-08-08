import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import INITIAL_STATE from '../INITIAL_STATE';
import SudokuGenerator from './../algorithm/SudokuGenerator';
import SudokuSolver from './../algorithm/SudokuSolver';
import { Props } from './SudokuBoard';

function Interactions({ setState, state }: Props) {
	const solveSudoku = (): void => {
		setState((prevState) => ({ ...prevState, loading: { ...prevState.loading, solve: true } }));

		setTimeout(() => {
			const solver = new SudokuSolver(state.board, state.maxIter, state.initTemp, state.coolingRate, state.reheatTo, state.reheatForX);
			const solvedBoard = solver.solveSudoku();

			setState((prevState) => ({
				...prevState,
				solved: solvedBoard[1],
				notSolved: !solvedBoard[1],
				iterations: solvedBoard[2],
				board: solvedBoard[0],
				emptyCells: solver.emptyCells,
				loading: { ...prevState.loading, solve: false },
			}));
		}, 100);
	};

	const generateSudoku = (difficulty: string): void => {
		const generator = new SudokuGenerator();

		setState((prevState) => ({
			...prevState,
			emptyCells: [],
			loading: { ...prevState.loading, [difficulty]: true },
		}));

		setTimeout(() => {
			let generatedPuzzle: number[][];

			if (difficulty === 'easy') {
				generatedPuzzle = generator.generateEasyPuzzle();
			} else if (difficulty === 'medium') {
				generatedPuzzle = generator.generateMediumPuzzle();
			} else if (difficulty === 'hard') {
				generatedPuzzle = generator.generateHardPuzzle();
			}

			setState((prevState) => ({
				...prevState,
				board: generatedPuzzle,
				loading: { ...prevState.loading, [difficulty]: false },
				solved: false,
				notSolved: false,
			}));
		}, 100);
	};

	const clearAnswers = (): void => {
		const newBoard = [...state.board];
		state.emptyCells?.forEach((cell) => {
			newBoard[cell[0]][cell[1]] = 0;
		});

		setState((prevState) => ({
			...prevState,
			board: newBoard,
			solved: false,
			loading: { ...prevState.loading, solve: false },
			notSolved: false,
		}));
	};

	const clearBoard = (): void => {
		const newBoard = [...state.board];
		for (let y = 0; y < state.board.length; y++) {
			for (let x = 0; x < state.board.length; x++) {
				newBoard[y][x] = 0;
			}
		}
		setState((prevState) => ({
			...prevState,
			board: newBoard,
			solved: false,
			loading: { ...prevState.loading, solve: false },
			notSolved: false,
		}));
	};

	const resetSettings = () => {
		setState((prevState) => ({
			...prevState,
			maxIter: INITIAL_STATE.maxIter,
			initTemp: INITIAL_STATE.initTemp,
			coolingRate: INITIAL_STATE.coolingRate,
			reheatForX: INITIAL_STATE.reheatForX,
			reheatTo: INITIAL_STATE.reheatTo,
		}));
	};

	const {
		loading: { solve, easy, medium, hard },
		openAS,
		solved,
		notSolved,
	} = state;

	return (
		<div className='space-y-4 self-center'>
			<div className='space-y-2'>
				<h2 className='text-lg font-semibold text-neutral-950'>Generate a Sudoku puzzle</h2>
				<p className='text-sm leading-6 text-neutral-600'>Start with a fresh board, then adjust the solver settings or solve instantly.</p>
			</div>

			<div className='grid gap-2 sm:grid-cols-3'>
				<button onClick={() => generateSudoku('easy')} className='flex items-center justify-center gap-2 rounded-2xl border border-neutral-300 bg-neutral-950 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700'>
					{easy ? <AiOutlineLoading3Quarters className='animate-spin' /> : null} Easy
				</button>
				<button onClick={() => generateSudoku('medium')} className='flex items-center justify-center gap-2 rounded-2xl border border-neutral-300 bg-white px-3 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100'>
					{medium ? <AiOutlineLoading3Quarters className='animate-spin' /> : null} Medium
				</button>
				<button onClick={() => generateSudoku('hard')} className='flex items-center justify-center gap-2 rounded-2xl border border-neutral-300 bg-white px-3 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100'>
					{hard ? <AiOutlineLoading3Quarters className='animate-spin' /> : null} Hard
				</button>
			</div>

			<div className='grid gap-2 sm:grid-cols-2'>
				<button onClick={clearAnswers} className='rounded-2xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100'>Clear Answers</button>
				<button onClick={clearBoard} className='rounded-2xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100'>Clear Board</button>
			</div>

			<button onClick={() => setState((prevState) => ({ ...prevState, openAS: !prevState.openAS }))} className='flex items-center gap-2 text-sm font-medium text-neutral-700 transition hover:text-neutral-950'>
				<span className='text-base'>⚙️</span>
				<span className='underline underline-offset-4'>Advanced Settings</span>
			</button>
			<p className='text-xs leading-5 text-neutral-500'>Exercise caution when making modifications to these settings, as it has the potential to make the page unresponsive.</p>

			{openAS ? (
				<div className='rounded-2xl border border-neutral-200 bg-neutral-50 p-4'>
					<div className='grid gap-2 sm:grid-cols-2'>
						<div>
							<label className='mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-neutral-500'>Max Iteration</label>
							<input value={state.maxIter} onChange={(e) => setState((prevState) => ({ ...prevState, maxIter: parseFloat(e.target.value) }))} className='w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none ring-0 focus:border-neutral-900' type='number' min='1000' placeholder='Max Iteration' />
						</div>
						<div>
							<label className='mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-neutral-500'>Initial Temperature</label>
							<input value={state.initTemp} onChange={(e) => setState((prevState) => ({ ...prevState, initTemp: parseFloat(e.target.value) }))} step='0.01' className='w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-900' type='number' min='0.2' max='2' placeholder='Initial Temperature' />
						</div>
					</div>

					<div className='mt-2 grid gap-2 sm:grid-cols-2'>
						<div>
							<label className='mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-neutral-500'>Cooling Rate</label>
							<input value={state.coolingRate} onChange={(e) => setState((prevState) => ({ ...prevState, coolingRate: parseFloat(e.target.value) }))} step='0.001' className='w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-900' type='number' min='0.05' max='0.999' placeholder='Cooling Rate' />
						</div>
						<div>
							<label className='mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-neutral-500'>Reheat</label>
							<input value={state.reheatTo} onChange={(e) => setState((prevState) => ({ ...prevState, reheatTo: parseFloat(e.target.value) }))} step='0.01' className='w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-900' type='number' min='0.1' max='2' placeholder='Reheat' />
						</div>
					</div>

					<div className='mt-2'>
						<label className='mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-neutral-500'>Reheat for every x iterations</label>
						<input value={state.reheatForX} onChange={(e) => setState((prevState) => ({ ...prevState, reheatForX: parseFloat(e.target.value) }))} min='100' className='w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-900' type='number' placeholder='Reheat for every x iterations' />
					</div>

					<button onClick={resetSettings} className='mt-3 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100'>Reset</button>
				</div>
			) : (
				<button onClick={() => setState((prevState) => ({ ...prevState, openAS: !prevState.openAS }))} className='h-2 w-full rounded-full bg-neutral-100 transition hover:bg-neutral-200' />
			)}

			<button onClick={solveSudoku} disabled={solve || solved || notSolved ? true : false} className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${solved ? 'bg-neutral-900 text-white' : notSolved ? 'bg-neutral-900 text-white' : 'bg-neutral-950 text-white hover:bg-neutral-700'} ${solve ? 'opacity-90' : ''}`}>
				{solve && !solved && !notSolved ? (
					<span className='flex items-center justify-center gap-2'><AiOutlineLoading3Quarters className='animate-spin' /> Loading</span>
				) : solved ? 'Sudoku Solved!' : notSolved ? 'Sudoku not Solved!' : 'Solve'}
			</button>
		</div>
	);
}

export default Interactions;