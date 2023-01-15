import { createTimeline } from '../createTimeline';
import { easeInOut } from '../easings';

describe('basics', () => {
  it('should throw when no frames', () => {
    // @ts-ignore duh
    expect(() => createTimeline()).toThrowError();
  });

  it('should throw when 0 frames', () => {
    expect(() => createTimeline([])).toThrowError();
  });

  it('should return a function', () => {
    const fn = createTimeline([{ time: 0, value: 0 }]);
    expect(typeof fn).toBe('function');
  });

  it('should return value at bounds if time is out of bounds', () => {
    const fn = createTimeline([
      { time: 0, value: 0 },
      { time: 10, value: 100 }
    ]);

    expect(fn(-5)).toEqual(0);
    expect(fn(5000)).toEqual(100);
  });
});

describe('lerp between numbers', () => {
  it('should lerp between two numbers', () => {
    const fn = createTimeline([
      { time: 0, value: 0 },
      { time: 10, value: 100 }
    ]);

    expect(fn(0)).toEqual(0);
    expect(fn(2.5)).toEqual(25);
    expect(fn(5)).toEqual(50);
    expect(fn(7.5)).toEqual(75);
    expect(fn(10)).toEqual(100);
  });

  it('should lerp between many numbers', () => {
    const fn = createTimeline([
      { time: 0, value: 0 },
      { time: 5, value: 100 },
      { time: 10, value: 200 },
      { time: 15, value: 300 },
      { time: 20, value: 400 }
    ]);

    // first, test exact values
    expect(fn(0)).toEqual(0);
    expect(fn(5)).toEqual(100);
    expect(fn(10)).toEqual(200);
    expect(fn(15)).toEqual(300);
    expect(fn(20)).toEqual(400);

    // second, test values in between
    expect(fn(2.5)).toEqual(50);
    expect(fn(7.5)).toEqual(150);
    expect(fn(12.5)).toEqual(250);
    expect(fn(17.5)).toEqual(350);

    // third, test values ad-hoc, calculated them manually
    expect(fn(3)).toEqual(60);
    expect(fn(8)).toEqual(160);
    expect(fn(14)).toEqual(280);
    expect(fn(18)).toEqual(360);
  });
});

describe('lerp between ANY values', () => {
  it('should lerp between two complex values', () => {
    const fn = createTimeline(
      [
        { time: 0, value: { x: 0, y: 0 } },
        { time: 10, value: { x: 100, y: 200 } }
      ],
      {
        lerp: (a, b, ratio, lerpNumber) => {
          return {
            x: lerpNumber(a.x, b.x, ratio),
            y: lerpNumber(a.y, b.y, ratio)
          };
        }
      }
    );

    expect(fn(0)).toEqual({ x: 0, y: 0 });
    expect(fn(2.5)).toEqual({ x: 25, y: 50 });
    expect(fn(5)).toEqual({ x: 50, y: 100 });
    expect(fn(7.5)).toEqual({ x: 75, y: 150 });
    expect(fn(10)).toEqual({ x: 100, y: 200 });
  });

  it('should lerp between many complex values', () => {
    const fn = createTimeline(
      [
        { time: 0, value: { x: 0, y: 0 } },
        { time: 5, value: { x: 100, y: 200 } },
        { time: 10, value: { x: 200, y: 400 } },
        { time: 15, value: { x: 300, y: 600 } },
        { time: 20, value: { x: 400, y: 800 } }
      ],
      {
        lerp: (a, b, ratio, lerpNumber) => {
          return {
            x: lerpNumber(a.x, b.x, ratio),
            y: lerpNumber(a.y, b.y, ratio)
          };
        }
      }
    );

    // first, test exact values
    expect(fn(0)).toEqual({ x: 0, y: 0 });
    expect(fn(5)).toEqual({ x: 100, y: 200 });
    expect(fn(10)).toEqual({ x: 200, y: 400 });
    expect(fn(15)).toEqual({ x: 300, y: 600 });
    expect(fn(20)).toEqual({ x: 400, y: 800 });

    // second, test values in between
    expect(fn(2.5)).toEqual({ x: 50, y: 100 });
    expect(fn(7.5)).toEqual({ x: 150, y: 300 });
    expect(fn(12.5)).toEqual({ x: 250, y: 500 });
    expect(fn(17.5)).toEqual({ x: 350, y: 700 });

    // third, test values ad-hoc, calculated them manually
    expect(fn(3)).toEqual({ x: 60, y: 120 });
    expect(fn(8)).toEqual({ x: 160, y: 320 });
    expect(fn(14)).toEqual({ x: 280, y: 560 });
    expect(fn(18)).toEqual({ x: 360, y: 720 });
  });
});

describe('easing functions', () => {
  it('should do linear easing by default', () => {
    const fn = createTimeline([
      { time: 0, value: 0 },
      { time: 1, value: 10 }
    ]);

    expect(fn(0)).toEqual(0);
    expect(fn(0.1)).toEqual(1);
    expect(fn(0.9)).toEqual(9);
    expect(fn(1)).toEqual(10);
  });

  it('should respect easing function', () => {
    const fn = createTimeline(
      [
        { time: 0, value: 0 },
        { time: 1, value: 10 }
      ],
      { ease: easeInOut }
    );

    // this specific function mostly affects numbers close to 0 and 1
    // so those should be different than linear
    expect(fn(0.1)).not.toEqual(1);
    expect(fn(0.9)).not.toEqual(9);
  });

  it('should respect easing function for all elements', () => {
    const fn = createTimeline(
      [
        { time: 0, value: 0 },
        { time: 1, value: 10 },
        { time: 2, value: 20 }
      ],
      { ease: easeInOut }
    );

    expect(fn(0.1)).not.toEqual(1);
    expect(fn(0.9)).not.toEqual(9);
    expect(fn(1.1)).not.toEqual(11);
    expect(fn(1.9)).not.toEqual(19);
  });

  it('should follow the easing function at all times', () => {
    const fn = createTimeline(
      [
        { time: 0, value: 0 },
        { time: 1, value: 10 }
      ],
      { ease: easeInOut }
    );

    for (let i = 0; i <= 1; i += 0.1) {
      // according to jest: 0 !== -0
      // this ugliness avoids that
      expect(fn(i) === easeInOut(i) * 10).toEqual(true);
    }
  });
});
