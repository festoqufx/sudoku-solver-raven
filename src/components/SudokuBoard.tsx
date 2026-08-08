import { State } from '../INITIAL_STATE';
import { isDuplicate } from '../utilities/utilities';

export interface Props {
state: State;
setState: React.Dispatch<React.SetStateAction<State>>;
}

function SudokuBoard({ state, setState }: Props) {
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, row: number, col: number): void => {
const value = parseInt(e.target.value) || 0;

setState((prevState) => {
const newBoard = [...prevState.board];
newBoard[row][col] = value;
return { ...prevState, board: newBoard };
});
};

return (
<div className='mx-auto overflow-x-auto self-center'>
<table className='mx-auto border-collapse rounded-2xl border border-neutral-300 bg-white p-2'>
<tbody>
{state.board.map((row, rowIndex) => (
<tr key={rowIndex}>
{row.map((cell, colIndex) => {
const isHighlighted = isDuplicate(cell, rowIndex, colIndex, state.board);
const isGenerated = state.emptyCells?.some((cellCoord: [number, number]) => cellCoord[0] === rowIndex && cellCoord[1] === colIndex);

return (
<td key={colIndex} className={`border border-neutral-300 ${colIndex === 2 || colIndex === 5 ? 'border-e-4 border-neutral-400' : ''} ${rowIndex === 2 || rowIndex === 5 ? 'border-b-4 border-neutral-400' : ''}`}>
<input
id='sudokuNumbers'
type='number'
min='1'
max='9'
value={cell || ''}
onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
className={`h-10 w-10 text-center text-base font-medium text-neutral-950 outline-none sm:h-12 sm:w-12 ${isHighlighted ? 'bg-neutral-100' : ''} ${isGenerated ? 'bg-neutral-50' : ''}`}
/>
</td>
);
})}
</tr>
))}
</tbody>
</table>
</div>
);
}

export default SudokuBoard;