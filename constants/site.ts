export const SITE = {
  name: 'Haris Saeed',
  role: 'Software Engineer',
  tagline: 'AI · Systems · Product',
  description:
    'Software engineer specializing in frontend engineering, full-stack systems, AI engineering, RAG, automation, and product development.',
};

export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Projects', href: '#projects' },
  { label: 'AI', href: '#ai' },
  { label: 'Lab', href: '#lab' },
  { label: 'Contact', href: '#contact' },
];

// TODO: replace with real profile links
export const SOCIAL_LINKS = {
  github: 'https://github.com/your-username',
  linkedin: 'https://www.linkedin.com/in/your-username',
  email: 'mailto:you@example.com',
};
