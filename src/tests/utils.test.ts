import { inverseLerp, lerp } from '../utils';

describe('lerp', () => {
  it('should lerp between two numbers', () => {
    expect(lerp(0, 10, 0)).toEqual(0);
    expect(lerp(0, 10, 0.5)).toEqual(5);
    expect(lerp(0, 10, 1)).toEqual(10);
  });

  it('should lerp between two numbers in reverse order', () => {
    expect(lerp(10, 0, 0)).toEqual(10);
    expect(lerp(10, 0, 0.5)).toEqual(5);
    expect(lerp(10, 0, 1)).toEqual(0);
  });

  it('should lerp between two negative numbers', () => {
    expect(lerp(-10, 0, 0)).toEqual(-10);
    expect(lerp(-10, 0, 0.5)).toEqual(-5);
    expect(lerp(-10, 0, 1)).toEqual(0);
  });

  it('should lerp between two mixed numbers', () => {
    expect(lerp(-5, 5, 0)).toEqual(-5);
    expect(lerp(-5, 5, 0.5)).toEqual(0);
    expect(lerp(-5, 5, 1)).toEqual(5);
  });
});

describe('inverseLerp', () => {
  it('should inverse lerp between two numbers', () => {
    expect(inverseLerp(0, 10, 0)).toEqual(0);
    expect(inverseLerp(0, 10, 5)).toEqual(0.5);
    expect(inverseLerp(0, 10, 10)).toEqual(1);
  });

  it('should inverse lerp between two numbers in reverse order', () => {
    // this is crap, but jest differentiates 0 and -0
    expect(inverseLerp(10, 0, 10) === 0).toEqual(true);
    expect(inverseLerp(10, 0, 5) === 0.5).toEqual(true);
    expect(inverseLerp(10, 0, 0) === 1).toEqual(true);
  });

  it('should inverse lerp between two negative numbers', () => {
    expect(inverseLerp(-10, 0, -10)).toEqual(0);
    expect(inverseLerp(-10, 0, -5)).toEqual(0.5);
    expect(inverseLerp(-10, 0, 0)).toEqual(1);
  });

  it('should inverse lerp between two mixed numbers', () => {
    expect(inverseLerp(-5, 5, -5)).toEqual(0);
    expect(inverseLerp(-5, 5, 0)).toEqual(0.5);
    expect(inverseLerp(-5, 5, 5)).toEqual(1);
  });
});
