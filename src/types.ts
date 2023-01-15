export type TimelineFrame<T> = {
  time: number;
  value: T;
};

export type LerpNumber = (a: number, b: number, ratio: number) => number;

export type Lerper<T> = (
  a: T,
  b: T,
  ratio: number,
  lerpNumber: LerpNumber
) => T;

export type Options<T> = {
  lerp: Lerper<T>;
  ease?: EasingFn;
};

export type EvaluateTimeline<T> = (time: number) => T;

export type EasingFn = (x: number) => number;
