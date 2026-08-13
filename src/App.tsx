import { useState } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { BiErrorAlt } from 'react-icons/bi';
import INITIAL_STATE, { State } from './INITIAL_STATE';
import ThemeToggle from './components/Darkmode';
import Documentation from './components/Documentation';
import Interactions from './components/Interactions';
import SudokuBoard from './components/SudokuBoard';

function App() {
	const [state, setState] = useState<State>(INITIAL_STATE);

	return (
		<div className='app-shell min-h-screen text-[var(--fg)]'>
			<div className='mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8'>
				<header className='flex flex-col gap-6 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between'>
					<div className='max-w-2xl space-y-3'>
						<p className='text-xs font-medium uppercase tracking-[0.28em] text-[var(--muted)]'>Local search · puzzle lab</p>
						<h1 className='font-display text-4xl font-semibold tracking-tight sm:text-5xl'>Sudoku Solver</h1>
						<p className='text-sm leading-7 text-[var(--muted)] sm:text-base'>
							A clean monochrome workspace for generating boards and solving them with{' '}
							<a
								href='https://en.wikipedia.org/wiki/Simulated_annealing'
								target='_blank'
								rel='noreferrer'
								className='font-medium text-[var(--fg)] underline decoration-[var(--border-strong)] underline-offset-4'
							>
								simulated annealing
							</a>
							. Results are probabilistic—retry or tweak parameters if a run stalls.
						</p>
					</div>
					<ThemeToggle />
				</header>

				<main className='mt-8 flex-1'>
					<section className='grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]'>
						<div className='space-y-4'>
							<div className='flex items-center justify-between gap-3'>
								<h2 className='text-sm font-medium uppercase tracking-[0.2em] text-[var(--muted)]'>Board</h2>
								{state.status === 'solved' ? (
									<span className='inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium'>
										<AiFillCheckCircle className='h-3.5 w-3.5' aria-hidden />
										Solved · {state.iterations.toLocaleString()} iters
									</span>
								) : state.status === 'failed' ? (
									<span className='inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium'>
										<BiErrorAlt className='h-3.5 w-3.5' aria-hidden />
										Unsolved · try again
									</span>
								) : state.status === 'solving' ? (
									<span className='inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium'>
										Searching…
									</span>
								) : null}
							</div>
							<SudokuBoard state={state} setState={setState} />
						</div>

						<div className='rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] sm:p-6'>
							<Interactions state={state} setState={setState} />
						</div>
					</section>

					<section className='mt-10 border-t border-[var(--border)] pt-8'>
						{state.status === 'failed' ? (
							<p className='mb-6 flex items-start gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--muted)]' role='status'>
								<BiErrorAlt className='mt-0.5 h-4 w-4 shrink-0 text-[var(--fg)]' aria-hidden />
								<span>
									No complete solution in this run. The board may be invalid, or the annealing schedule needs a
									retry with different parameters.
								</span>
							</p>
						) : null}
						<Documentation />
					</section>
				</main>

				<footer className='mt-10 flex flex-col items-start justify-between gap-4 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted)] sm:flex-row sm:items-center'>
					<p>
						Built for exploring local search ·{' '}
						<span className='font-medium text-[var(--fg)]'>Sudoku Solver</span>
					</p>
					<a
						href='https://github.com/festoqufx/sudoku-solver'
						target='_blank'
						rel='noreferrer'
						className='inline-flex items-center rounded-full border border-[var(--fg)] bg-[var(--fg)] px-4 py-2 font-medium text-[var(--bg)] transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]'
					>
						View on GitHub
					</a>
				</footer>
			</div>
		</div>
	);
}

export default App;
