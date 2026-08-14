import { SITE, NAV_ITEMS } from '@/constants/site';
import { INTRO_SCENE } from '@/constants/scenes/intro';
import { scrollState } from '@/lib/scrollState';

export default function Nav() {
  const handleSkip = () => {
    scrollState.progress = 1;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <nav className='fixed top-0 inset-x-0 z-20 flex items-center justify-between px-6 py-5 text-ink'>
      <span className='text-sm font-semibold tracking-wide'>{SITE.name}</span>
      <ul className='hidden md:flex items-center gap-6 text-xs uppercase tracking-wider'>
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className='hover:text-accent focus-visible:text-accent outline-none transition-colors'
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <button
        type='button'
        onClick={handleSkip}
        className='text-xs uppercase tracking-wider text-warmgray hover:text-accent focus-visible:text-accent outline-none transition-colors'
      >
        {INTRO_SCENE.skipLabel}
      </button>
    </nav>
  );
}
