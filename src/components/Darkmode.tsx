import { BsMoonStarsFill, BsSunFill } from 'react-icons/bs';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();
	const isDark = theme === 'dark';

	return (
		<button
			type='button'
			onClick={toggleTheme}
			aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
			title={isDark ? 'Light mode' : 'Dark mode'}
			className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] transition hover:bg-[var(--surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]'
		>
			{isDark ? <BsSunFill className='h-4 w-4' aria-hidden /> : <BsMoonStarsFill className='h-4 w-4' aria-hidden />}
		</button>
	);
}
