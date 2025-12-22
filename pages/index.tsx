import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/all';
import gsap from 'gsap';

export default function Home() {
  useGSAP(() => {
    const splitText = new SplitText('.title', { type: 'chars words' });
    splitText.chars.forEach((characters) => {
      characters.classList.add('text-gradient');
    });
    gsap.from(splitText.chars, {
      yPercent: 100,
      duration: 1.8,
      ease: 'expo.out',
      stagger: 0.06,
    });

    gsap.to('.designation', {
      duration: 1,
      delay: 1.5,
      scrambleText: {
        text: 'Senior Software Enginner',
        chars: 'XOqweqwe',
        revealDelay: 0.1,
        speed: 0.1,
      },
    });
  }, []);

  return (
    <main>
      <section className='h-[100vh]  flex items-center justify-center flex-col'>
        <h1 className='title text-8xl font-bold '>Haris Saeed</h1>
        <h4 className='designation text-xl text-gradient'> </h4>
      </section>
    </main>
  );
}
