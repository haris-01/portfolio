import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

export function initializeGSAPPlugins() {
  gsap.registerPlugin(ScrambleTextPlugin);
}
