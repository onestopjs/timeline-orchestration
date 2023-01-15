import { EasingFn } from './types';

// cool website:
// https://easings.net/

export const easeLinear: EasingFn = (x) => x;
export const easeIn: EasingFn = (x) => 1 - (Math.cos(Math.PI * x) + 1) / 2;
export const easeOut: EasingFn = (x) => Math.sin((x * Math.PI) / 2);
export const easeInOut: EasingFn = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
