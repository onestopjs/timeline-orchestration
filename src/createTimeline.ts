import { easeLinear } from './easings';
import getFramesAndRatio from './getFramesAndRatio';
import { EvaluateTimeline, Lerper, Options, TimelineFrame } from './types';
import { isFrameValueNumber, lerp as lerpNumber } from './utils';

// I want to have a special case for numbers so users don't have to
// provide their own lerp implementations for simple cases
export function createTimeline(
  frames: TimelineFrame<number>[],
  options?: Partial<Options<number>>
): (time: number) => number;
export function createTimeline<T>(
  frames: TimelineFrame<T>[],
  options: Options<T>
): (time: number) => T;

export function createTimeline<T>(
  frames: TimelineFrame<T>[],
  options?: Partial<Options<T>>
) {
  if (!frames || frames.length === 0) {
    throw new Error('You must provide frames.');
  }

  // do as much work as possible outside of EvaluateTimeline functions
  // because they will be run a lot of times
  const normalizedFrames = [...frames].sort((a, b) => a.time - b.time);
  const easingFn = options?.ease ?? easeLinear;

  if (isFrameValueNumber(normalizedFrames)) {
    const lerp =
      options && options.lerp
        ? // https://i.kym-cdn.com/photos/images/original/001/820/208/0d5.jpg
          (options.lerp as unknown as Lerper<number>)
        : lerpNumber;

    const evaluateNumberTimeline: EvaluateTimeline<number> = (time) => {
      const [frame1, frame2, ratio] = getFramesAndRatio(normalizedFrames, time);

      return lerp(frame1.value, frame2.value, easingFn(ratio), lerpNumber);
    };

    return evaluateNumberTimeline;
  }

  if (!options) {
    throw new Error(
      `The second (options) argument is required when the value is anything other than number.
      You specifically need to provide the "lerp" option.`
    );
  }

  if (!options.lerp) {
    throw new Error(
      `You need to provide the "lerp" option when the value is anything other than number.`
    );
  }

  const { lerp } = options;
  const evaluateTimeline: EvaluateTimeline<T> = (time) => {
    const [frame1, frame2, ratio] = getFramesAndRatio(normalizedFrames, time);

    return lerp(frame1.value, frame2.value, easingFn(ratio), lerpNumber);
  };

  return evaluateTimeline;
}
