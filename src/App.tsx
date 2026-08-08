import { useState } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { BiErrorAlt } from 'react-icons/bi';
import INITIAL_STATE, { State } from './INITIAL_STATE';
import Darkmode from './components/Darkmode';
import Documentation from './components/Documentation';
import Interactions from './components/Interactions';
import SudokuBoard from './components/SudokuBoard';

function App() {
	const [state, setState] = useState<State>(INITIAL_STATE);

	return (
		<div className='min-h-screen bg-[linear-gradient(135deg,#f5f5f5_0%,#ffffff_100%)] text-neutral-900'>
			<div className='mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8'>
				<header className='rounded-[2rem] border border-neutral-200 bg-white/90 px-6 py-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] backdrop-blur sm:px-8'>
					<div className='flex flex-col items-center gap-3 text-center'>
						<div className='flex items-center gap-3'>
							<span className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-base font-semibold text-neutral-900'>S</span>
							<div className='flex items-center gap-2'>
								<Darkmode />
								<h1 className='text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl'>Sudoku Solver</h1>
							</div>
						</div>
						<p className='max-w-3xl text-sm leading-6 text-neutral-600 sm:text-base'>
							Please be aware that this solver may not always solve the Sudoku, as it uses{' '}
							<a href='https://en.wikipedia.org/wiki/Simulated_annealing' target='_blank' rel='noreferrer' className='font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition hover:text-neutral-700'>
								simulated annealing
							</a>{' '}
							for solving, a local search algorithm.
						</p>
					</div>
				</header>

				<main className='mt-6 flex-1'>
					<section className='grid gap-6 lg:grid-cols-[1.15fr_0.85fr]'>
						<div className='rounded-[2rem] border border-neutral-200 bg-white p-4 shadow-[0_10px_40px_rgba(0,0,0,0.04)] sm:p-6'>
							<SudokuBoard state={state} setState={setState} />
						</div>
						<div className='rounded-[2rem] border border-neutral-200 bg-white p-4 shadow-[0_10px_40px_rgba(0,0,0,0.04)] sm:p-6'>
							<Interactions state={state} setState={setState} />
						</div>
					</section>

					<section className='mt-6 rounded-[2rem] border border-neutral-200 bg-white p-4 shadow-[0_10px_40px_rgba(0,0,0,0.04)] sm:p-6'>
						{state.notSolved ? (
							<p className='flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700'>
								<BiErrorAlt className='h-4 w-4 text-neutral-950' />
								<span>Sudoku board may be invalid or there is something wrong with the parameters.</span>
							</p>
						) : state.solved ? (
							<p className='flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700'>
								<AiFillCheckCircle className='h-4 w-4 text-neutral-950' />
								<span>Iterations: {state.iterations}</span>
							</p>
						) : <div className='h-2 rounded-full bg-neutral-100' />}

						<Documentation />
					</section>
				</main>

				<footer className='mt-6 border-t border-neutral-200 pt-6'>
					<div className='flex flex-col items-center justify-between gap-3 text-center text-sm text-neutral-600 sm:flex-row sm:text-left'>
						<p>
							Made with <span className='font-semibold text-neutral-950'>Ravenom</span>
						</p>
						<a href='https://github.com/festoqufx/lotto-probability-pick' target='_blank' rel='noreferrer' className='inline-flex items-center rounded-full border border-neutral-300 bg-neutral-950 px-4 py-2 font-medium text-white transition hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2'>
							Star on GitHub
						</a>
					</div>
				</footer>
			</div>
		</div>
	);
}

export default App;
