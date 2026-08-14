import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

export function initializeGSAPPlugins() {
  gsap.registerPlugin(ScrambleTextPlugin, ScrollTrigger, SplitText);
}
