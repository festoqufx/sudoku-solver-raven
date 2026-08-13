import { Board, emptyBoard } from './utilities/board';

export type Difficulty = 'easy' | 'medium' | 'hard' | null;
export type SolveStatus = 'idle' | 'solving' | 'solved' | 'failed';

export interface State {
	board: Board;
	givens: boolean[][];
	history: Board[];
	selected: [number, number] | null;
	loading: {
		solve: boolean;
		easy: boolean;
		medium: boolean;
		hard: boolean;
	};
	openAS: boolean;
	status: SolveStatus;
	iterations: number;
	maxIter: number;
	initTemp: number;
	coolingRate: number;
	reheatTo: number;
	reheatForX: number;
	difficulty: Difficulty;
	timerStartedAt: number | null;
	elapsedMs: number;
	notes: string;
}

const emptyGivens = (): boolean[][] =>
	Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => false));

export const DEFAULT_SETTINGS = {
	maxIter: 500000,
	initTemp: 0.85,
	coolingRate: 0.999,
	reheatTo: 0.65,
	reheatForX: 5000,
} as const;

const INITIAL_STATE: State = {
	board: emptyBoard(),
	givens: emptyGivens(),
	history: [],
	selected: [0, 0],
	loading: {
		solve: false,
		easy: false,
		medium: false,
		hard: false,
	},
	openAS: false,
	status: 'idle',
	iterations: 0,
	...DEFAULT_SETTINGS,
	difficulty: null,
	timerStartedAt: null,
	elapsedMs: 0,
	notes: '',
};

export default INITIAL_STATE;
