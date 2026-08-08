import { useState } from 'react';

function Documentation() {
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  return (
    <section className='mt-8 space-y-4 text-neutral-800'>
      <div className='space-y-2'>
        <h2 className='text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl'>Simulated Annealing</h2>
        <p className='text-sm leading-7 text-neutral-600 sm:text-base'>
          is an optimization algorithm that mimics the process of annealing in metallurgy. It explores different solutions, including worse ones, gradually reducing the acceptance of worse solutions over time. This helps it find the best solution to a problem, even in complex scenarios.
        </p>
      </div>

      <button onClick={() => setShowExplanation(!showExplanation)} className='text-sm font-medium text-neutral-700 underline decoration-neutral-300 underline-offset-4 transition hover:text-neutral-950'>
        {showExplanation ? 'Hide detailed explanation' : 'Detailed explanation'}
      </button>

      {showExplanation ? (
        <div className='rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-7 text-neutral-700'>
          <p>Imagine you have a metal object and you want to reshape it into a specific form. If you heat the metal too much, it becomes too soft and loses its shape. On the other hand, if you cool it too quickly, it may get stuck in an undesirable shape. The goal is to heat the metal and then cool it slowly to achieve the desired shape.</p>
          <p className='mt-3'>Simulated annealing works in a similar way. It starts with an initial solution to a problem, which may not be the best one. The algorithm then explores nearby solutions by making small changes to the current solution. These changes are like heating the metal in the analogy.</p>
          <p className='mt-3'>Next, the algorithm evaluates each new solution and compares it to the current one. If a new solution is better, it becomes the new current solution. But here is the interesting part: even if a new solution is worse, the algorithm still considers it. This is like cooling the metal slowly in the annealing process.</p>
          <p className='mt-3'>Sometimes, accepting worse solutions allows the algorithm to escape from <span className='font-semibold text-neutral-950'>local optima (suboptimal solutions)</span> and explore other parts of the solution space that may contain the <span className='font-semibold text-neutral-950'>global optimum (the best solution)</span>. As the algorithm progresses, it gradually reduces the likelihood of accepting worse solutions, emulating the cooling process.</p>
          <p className='mt-3'>Simulated annealing continues this process of exploring and gradually reducing the acceptance of worse solutions until it reaches a stopping criterion. This can be a certain number of iterations or when the algorithm has converged to an acceptable solution.</p>
        </div>
      ) : (
        <div className='h-2 rounded-full bg-neutral-100' />
      )}

      <div className='rounded-2xl border border-neutral-200 bg-neutral-50 p-4'>
        <h3 className='text-xl font-semibold text-neutral-950'>Warning</h3>
        <p className='mt-2 text-sm leading-7 text-neutral-600'>
          In order to prevent the page from becoming unresponsive, it is best to avoid raising the initial temperature and reheating it to extremely high levels. Working at excessively high temperatures will consistently produce suboptimal solutions, and when combined with a high number of iterations, it will significantly prolong the time required to complete the task.
        </p>
      </div>
    </section>
  );
}

export default Documentation;