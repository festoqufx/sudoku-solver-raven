import { useState } from 'react';

function Documentation() {
	const [showExplanation, setShowExplanation] = useState(false);

	return (
		<section className='space-y-4 text-[var(--fg)]'>
			<div className='space-y-2'>
				<h2 className='font-display text-2xl font-semibold tracking-tight sm:text-3xl'>Simulated Annealing</h2>
				<p className='max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base'>
					An optimization method inspired by metallurgy. It explores neighboring solutions—including temporarily worse
					ones—while gradually cooling so the search settles toward a strong answer.
				</p>
			</div>

			<button
				type='button'
				onClick={() => setShowExplanation((v) => !v)}
				className='text-sm font-medium underline decoration-[var(--border-strong)] underline-offset-4 transition hover:opacity-80'
				aria-expanded={showExplanation}
			>
				{showExplanation ? 'Hide detailed explanation' : 'Read detailed explanation'}
			</button>

			{showExplanation ? (
				<div className='space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-sm leading-7 text-[var(--muted)]'>
					<p>
						Imagine reshaping metal: overheating makes it soft and unstable; cooling too fast locks a poor shape. Slow
						cooling lets the material settle into a desirable form.
					</p>
					<p>
						Simulated annealing starts from an imperfect board, then proposes small swaps among empty cells. Better
						boards are accepted; worse boards may still be accepted early, helping escape local optima.
					</p>
					<p>
						As temperature falls, worse moves become rare. The search stops when the cost reaches zero (a valid Sudoku)
						or the iteration budget is exhausted.
					</p>
				</div>
			) : null}

			<div className='rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4'>
				<h3 className='text-base font-semibold text-[var(--fg)]'>Performance tip</h3>
				<p className='mt-2 text-sm leading-7 text-[var(--muted)]'>
					Avoid extreme temperatures with very large iteration counts—the browser tab can become unresponsive while the
					search runs on the main thread. Prefer generating a puzzle, then solving, or use Hint for a guided assist.
				</p>
			</div>
		</section>
	);
}

export default Documentation;
