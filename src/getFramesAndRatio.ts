import { TimelineFrame } from './types';
import { inverseLerp } from './utils';

const getFramesAndRatio = <T>(
  timeline: TimelineFrame<T>[],
  x: number
): [TimelineFrame<T>, TimelineFrame<T>, number] => {
  if (x <= timeline[0].time) return [timeline[0], timeline[0], 0];
  if (x >= timeline[timeline.length - 1].time)
    return [timeline[timeline.length - 1], timeline[timeline.length - 1], 0];

  let current = 0;
  while (current < timeline.length - 1) {
    if (x <= timeline[current].time) {
      break;
    }
    current++;
  }

  const sectorCompletion = inverseLerp(
    timeline[current - 1].time,
    timeline[current].time,
    x
  );

  return [timeline[current - 1], timeline[current], sectorCompletion];
};

export default getFramesAndRatio;
