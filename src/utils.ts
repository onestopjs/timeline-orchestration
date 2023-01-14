import { LerpNumber, TimelineFrame } from './types';

export const lerp: LerpNumber = (value1, value2, ratio) => {
  return value1 + (value2 - value1) * ratio;
};

export const inverseLerp: LerpNumber = (value1, value2, amount) => {
  return (amount - value1) / (value2 - value1);
};

export const isFrameValueNumber = (
  frames: TimelineFrame<any>[]
): frames is TimelineFrame<number>[] =>
  frames.length > 0 && typeof frames[0].value === 'number';
