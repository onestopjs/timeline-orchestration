# timeline-orchestration

Small package to help with orchestrating complex sequences.

It aims to do so by leveraging the mental model of placing keyframes on a timeline.

Take a look at the [example](https://codesandbox.io/s/timeline-orchestration-example-91pkw3?file=/src/index.ts).

## What this is **not**

This package does **not** do any animations. It simply provides the values for your predefined sequence at any point. If you want to do animations, you must couple this package with any other animation solution. This library simply provides the **orchestration**.

The timeline part comes from the mental model which this package leverages - placing keyframes on a timeline.

## Mental model

[_I don't care, show me how to use it_](#usage)

As mentioned, this package mimics the logic of placing keyframes on an animation timeline - you set a keyframe at a specific time and value. You do this for every key point of your animation. Then, the animation software takes over and interpolates between all of your keyframes.

Imagine it like that:
![Timeline example](/docs/timeline.jpg)

This is what this package does, except you can use it for whatever you want, not just literally running animations. When defining "keyframes", you will use the word "time", which is not necessarily correct, but it helps follow the model.

## Use case

Why is this any better than any other animation library out there? Well, it's not. In fact, this is **not** an animation library. This is the point, you can break out of the dependency of having to literally run animations if you want to orchestrate any sequence of events, based on a value.

Imagine you have multiple elements, which have to go to different positions, based on how far you have scrolled. Using this package, you will define all the key positions for all the elements, _based on the scroll package_. In fact, this is the use case out of which this package was born.

Using any animation library, the element's position would depend on the _time since the animation started_.
However, using this package, the element's position would depend on _any value you want_, e.g. scroll position.

## Usage

### Simple numbers

In the case of orchestrating simple numbers, the configuration is quite simple:

```ts
import createTimeline from 'timeline-orchestration';

const evaluate = createTimeline([
  { time: 0, value: 0 },
  { time: 10, value: 500 },
  { time: 15, value: 1000 }
]);

evaluate(5);
// 5 is in the middle between 0 and 10, which we have defined
// so this function returns whatever is in the middle
// between 0 and 500 (their respective values),
// which in this case happens to be 250

evaluate(10);
// returns the value at 10, which is 500

evaluate(15);
// returns the value at 15, which is 1000
```

### Complex values

When orchestrating more complex values, the configuration is a bit more involved.

This is the most complex case, so if you understand this, you pretty much know how to use the package. Here is what it looks like:

```ts
import createTimeline, { Lerper } from 'timeline-orchestration';

interface Coordinates {
  x: number;
  y: number;
}

const lerpCoordinates: Lerper<Coordinates> = (a, b, ratio, lerpNumber) => {
  return { x: lerpNumber(a.x, b.x, ratio), y: lerpNumber(a.y, b.y, ratio) };
};

const evaluate = createTimeline(
  [
    { time: 0, value: { x: 0, y: 0 } },
    { time: 50, value: { x: 100, y: 0 } },
    { time: 100, value: { x: 100, y: 100 } },
    { time: 150, value: { x: 50, y: 60 } },
    { time: 200, value: { x: 0, y: 100 } },
    { time: 250, value: { x: 0, y: 0 } }
  ],
  { lerp: lerpCoordinates }
);
```

What is happening here?

Well, when you want to animate values, more complicated than a number, you have to give instructions on how to interpolate between them.

**Note**: `lerp` stands for "**l**inear int**erp**olation". When _lerping_ between two values, let's say X and Y, you have a third number, let's call it a _ratio_, which is between 0 and 1.\
If the ratio is 0, you get X.\
If the ratio is 1, you get Y.\
However, if the ratio is 0.5, you get the value that is in the middle of them.

Lerping between two numbers is easy, here is what it looks like:

```ts
const lerp = (a: number, b: number, ratio: number) => {
  return a + (b - a) * ratio;
};

lerp(10, 20, 0.5);
// 0.5 is halfway between 0 and 1,
// so this returns 15, which is halfway between 10 and 20
```

Because this case is so simple, it is handled out of the box.\
For more complex values, however, the package needs instructions on how to interpolate.\
This is done with the `lerp` option, which accepts a function with the following signature:

```ts
type Lerper<T> = (a: T, b: T, ratio: number, lerpNumber: LerpNumber) => T;
```

Shortly, a function that takes 2 of your special values (`a` and `b`) and a `ratio`, again between 0 and 1. It must return your special value, but interpolated between `a` and `b`, based on `ratio`.

In the example, we have `Coordinates`, which is just an object containing two numerical values. As shown, lerping between numerical values is easy, so we will just do that for the two numerical values. For convenience, in the fourth parameter, the package provides its own `lerp` function, which works for numbers like the one above, so you don't have to implement your own.

```ts
const lerpCoordinates = (
  a: Coordinates,
  b: Coordinates,
  ratio: number,
  lerpNumber: LerpNumber
) => {
  // we interpolate between a.x and b.x just like any other number
  // same for a.y and b.y
  // then we just package it back in a Coordinates object.
  return {
    x: lerpNumber(a.x, b.x, ratio),
    y: lerpNumber(a.y, b.y, ratio)
  };
};
```

Then you just provide this function to the `lerp` option (second argument of `createTimeline`) and you are done. You can now add all your keyframes and start orchestrating!

That was a lot to unpack, so take your time and experiment with it, or play with the example provided.

## API

### Default export

The default export is `createTimelines`, which has two overloads with following signatures:

```ts
function createTimeline(
  frames: TimelineFrame<number>[],
  options?: Partial<Options<number>>
): (time: number) => number;

function createTimeline<T>(
  frames: TimelineFrame<T>[],
  options: Options<T>
): (time: number) => T;
```

Shortly explained:

- first argument is array of "frames" - time and value.
- if your values are not numbers, you will need to provide an `options` object with `lerp` provided.

### TimelineFrame\<T\>

The type used when defining your frames. Array of this type is the first argument of `createTimeline`.

```ts
type TimelineFrame<T> = {
  time: number;
  value: T;
};
```

### Lerper\<T\>

The type used when defining your custom `lerp` function for complex values.

```ts
type Lerper<T> = (a: T, b: T, ratio: number, lerpNumber: LerpNumber) => T;
```

### Options\<T\>

```ts
type Options<T> = {
  lerp: Lerper<T>;
};
```

## Options

The options object is the second argument to `createTimeline`.\
If you are orchestrating numbers, no options are mandatory.\
However, if you are orchestrating complex values, the `lerp` option is **required**.

| option | default   | required                    | type        | description                                     |
| ------ | --------- | --------------------------- | ----------- | ----------------------------------------------- |
| lerp   | undefined | if your value is not number | Lerper\<T\> | function which lerps between your type of value |

## License

Licensed under the [MIT License](./LICENSE).
