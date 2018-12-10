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
  {
    description: 'rect + fill',
    arguments: [
      {
        ...center,
        width: 100,
        height: 50,
        fill: 'black',
      },
    ],
    run(canvas) {
      const ctx = new Ctx(canvas);
      ctx.rect(...this.arguments);
    },
  },
  {
    description: 'rect + stroke',
    arguments: [
      {
        ...center,
        width: 100,
        height: 50,
        stroke: 'black',
        lineWidth: 5,
      },
    ],
    run(canvas) {
      const ctx = new Ctx(canvas);
      ctx.rect(...this.arguments);
    },
  },
  {
    description: 'rect + stroke + fill + angle',
    arguments: [
      {
        ...center,
        width: 100,
        height: 50,
        stroke: 'black',
        fill: 'green',
        lineWidth: 5,
        angle: Math.PI * 0.3,
        anchor: { x: 0.5, y: 0.5 },
      },
    ],
    run(canvas) {
      const ctx = new Ctx(canvas);
      ctx.rect(...this.arguments);
    },
  },
  {
    description: 'path + stroke',
    arguments: [
      {
        points: [
          { x: 10, y: 10 },
          { x: 200, y: 200 },
          { x: 40, y: 140 },
          { x: 160, y: 70 },
        ],
        stroke: 'black',
        lineWidth: 3,
      },
    ],
    run(canvas) {
      const ctx = new Ctx(canvas);
      ctx.path(...this.arguments);
    },
  },
  {
    description: 'path + stroke + fill + close path',
    arguments: [
      {
        points: [
          { x: 10, y: 10 },
          { x: 200, y: 200 },
          { x: 40, y: 140 },
          { x: 160, y: 70 },
        ],
        stroke: 'black',
        closePath: true,
        fill: 'red',
        lineWidth: 5,
      },
    ],
    run(canvas) {
      const ctx = new Ctx(canvas);
      ctx.path(...this.arguments);
    },
  },
];
