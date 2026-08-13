# Sudoku Solver

A React + TypeScript web app for generating Sudoku puzzles and solving them with **simulated annealing**. The interface uses a clean black-and-white design with full **light** and **dark** mode support.

**Live demo:** [https://sudoku-solver-raven.vercel.app/](https://sudoku-solver-raven.vercel.app/)

## Features

- Generate Easy, Medium, and Hard puzzles instantly
- Solve with configurable simulated annealing parameters
- Light / dark theme (persisted, respects system preference on first visit)
- Keyboard navigation (arrows, 1–9, Delete) and on-screen number pad
- Conflict, peer, and same-number highlighting
- Undo, hint, clear answers / board
- Copy / paste 81-character puzzle strings
- Live timer, fill progress, and conflict counters
- Responsive layout for mobile and desktop

## Tech stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Lodash (sampling / random helpers in the annealer)

## Getting started

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## How solving works

Simulated annealing explores neighboring boards by swapping values in empty cells. Better boards are always accepted; worse boards may be accepted early (high temperature) so the search can escape local optima. Temperature cools over time; optional reheating periodically boosts exploration. A cost of `0` means a valid Sudoku.

Puzzle generation uses fast symmetry transforms of a known solution (digit remapping, band/stack/row/column shuffles), then removes cells by difficulty—so generation stays snappy in the browser.

## Accessibility

- Visible focus rings on interactive controls
- Theme toggle and board cells expose ARIA labels
- Strong monochrome contrast in both themes
- `prefers-reduced-motion` respected for animations

## Contributing

1. Open an issue for bugs or feature ideas
2. Submit a pull request with a clear description and tested changes
3. Keep code readable and avoid drive-by refactors unrelated to the change

## License

See [LICENSE](./LICENSE).
