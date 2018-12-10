const image = document.querySelector('.test-image');
const canvasSize = { x: 300, y: 300 };
const center = { x: canvasSize.x / 2, y: canvasSize.y / 2 };

const tests = [
  {
    description: 'Image',
    arguments: [
      {
        ...center,
        image,
      },
    ],
    run(canvas) {
      const ctx = new Ctx(canvas);
      ctx.draw(...this.arguments);
    },
  },
  {
    description: 'Alpha',
    arguments: [
      {
        ...center,
        image,
        alpha: 0.5,
      },
    ],
    run(canvas) {
      const ctx = new Ctx(canvas);
      ctx.draw(...this.arguments);
    },
  },
  {
    description: 'Scale',
    arguments: [
      {
        ...center,
        image,
        scale: 2,
      },
    ],
    run(canvas) {
      const ctx = new Ctx(canvas);
      ctx.draw(...this.arguments);
    },
  },
  {
    description: 'Anchor',
    arguments: [
      {
        ...center,
        anchor: {
          x: 0.5,
          y: 0.5,
        },
        image,
      },
    ],
    run(canvas) {
      const ctx = new Ctx(canvas);
      ctx.draw(...this.arguments);
    },
  },
  {
    description: 'Angle',
    arguments: [
      {
        ...center,
        angle: Math.PI * 0.25,
        image,
      },
    ],
    run(canvas) {
      const ctx = new Ctx(canvas);
      ctx.draw(...this.arguments);
    },
  },
  {
    description: 'Angle + anchor + scale + alpha',
    arguments: [
      {
        ...center,
        anchor: {
          x: 0.5,
          y: 0.5,
        },
        angle: Math.PI * 0.25,
        scale: 1.5,
        alpha: 0.5,
        image,
      },
    ],
    run(canvas) {
      const ctx = new Ctx(canvas);
      ctx.draw(...this.arguments);
    },
  },
];
