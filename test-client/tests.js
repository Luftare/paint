const image = document.querySelector('.test-image');
const canvasSize = { x: 300, y: 300 };
const center = { x: canvasSize.x / 2, y: canvasSize.y / 2 };

const tests = [
  {
    description: 'image',
    arguments: [
      {
        position: center,
        image,
      },
    ],
    run(canvas, Paint) {
      const paint = new Paint(canvas);
      paint.image(...this.arguments);
    },
  },
  {
    description: 'image',
    arguments: [
      {
        position: center,
        image,
        alpha: 0.5,
      },
    ],
    run(canvas, Paint) {
      const paint = new Paint(canvas);
      paint.image(...this.arguments);
    },
  },
  {
    description: 'image',
    arguments: [
      {
        position: center,
        image,
        scale: 2,
      },
    ],
    run(canvas, Paint) {
      const paint = new Paint(canvas);
      paint.image(...this.arguments);
    },
  },
  {
    description: 'image',
    arguments: [
      {
        position: center,
        anchor: {
          x: 0.5,
          y: 0.5,
        },
        image,
      },
    ],
    run(canvas, Paint) {
      const paint = new Paint(canvas);
      paint.image(...this.arguments);
    },
  },
  {
    description: 'image',
    arguments: [
      {
        position: center,
        angle: Math.PI * 0.25,
        image,
      },
    ],
    run(canvas, Paint) {
      const paint = new Paint(canvas);
      paint.image(...this.arguments);
    },
  },
  {
    description: 'image',
    arguments: [
      {
        position: center,
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
    run(canvas, Paint) {
      const paint = new Paint(canvas);
      paint.image(...this.arguments);
    },
  },
  {
    description: 'rect',
    arguments: [
      {
        position: center,
        width: 100,
        height: 50,
        fill: 'black',
      },
    ],
    run(canvas, Paint) {
      const paint = new Paint(canvas);
      paint.rect(...this.arguments);
    },
  },
  {
    description: 'rect',
    arguments: [
      {
        position: center,
        width: 50,
        height: 50,
        scale: 2,
        stroke: 'black',
        lineWidth: 5,
        scaleLineWidth: true,
      },
    ],
    run(canvas, Paint) {
      const paint = new Paint(canvas);
      paint.rect(...this.arguments);
    },
  },
  {
    description: 'rect',
    arguments: [
      {
        position: center,
        width: 100,
        height: 50,
        stroke: 'black',
        fill: 'green',
        scale: 2,
        lineWidth: 5,
        angle: Math.PI * 0.3,
        anchor: { x: 0.5, y: 0.5 },
      },
    ],
    run(canvas, Paint) {
      const paint = new Paint(canvas);
      paint.rect(...this.arguments);
    },
  },
  {
    description: 'path',
    arguments: [
      {
        points: [
          { x: 10, y: 10 },
          { x: 200, y: 200 },
          { x: 40, y: 140 },
          { x: 160, y: 70 },
        ],
        stroke: 'black',
        lineWidth: 16,
        lineCap: 'round',
        lineJoin: 'round',
      },
    ],
    run(canvas, Paint) {
      const paint = new Paint(canvas);
      paint.path(...this.arguments);
    },
  },
  {
    description: 'path',
    arguments: [
      {
        points: [
          { x: 0, y: 0 },
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
    run(canvas, Paint) {
      const paint = new Paint(canvas);
      paint.path(...this.arguments);
    },
  },
  {
    description: 'path',
    arguments: [
      {
        points: [
          { x: 0, y: 0 },
          { x: 200, y: 200 },
          { x: 40, y: 140 },
          { x: 160, y: 70 },
        ],
        stroke: 'black',
        closePath: true,
        anchor: { x: 0.5, y: 0.5 },
        angle: 0.5,
        position: center,
        fill: 'red',
        lineWidth: 5,
      },
    ],
    run(canvas, Paint) {
      const paint = new Paint(canvas);
      paint.path(...this.arguments);
    },
  },
  {
    description: 'path',
    arguments: [
      {
        points: [
          { x: 0, y: 0 },
          { x: 200, y: 200 },
          { x: 40, y: 140 },
          { x: 160, y: 70 },
        ],
        stroke: 'black',
        closePath: true,
        anchor: { x: 0.5, y: 0.5 },
        angle: 0.5,
        position: center,
        scale: 0.5,
        scaleLineWidth: true,
        fill: 'red',
        lineWidth: 5,
      },
    ],
    run(canvas, Paint) {
      const paint = new Paint(canvas);
      paint.path(...this.arguments);
    },
  },
  {
    description: 'circle',
    arguments: [
      {
        position: center,
        radius: 55,
        stroke: 'black',
        fill: 'red',
        lineWidth: 5,
      },
    ],
    run(canvas, Paint) {
      const paint = new Paint(canvas);
      paint.circle(...this.arguments);
    },
  },
  {
    description: 'circle',
    arguments: [
      {
        position: center,
        radius: 55,
        stroke: 'black',
        fill: 'red',
        scale: 0.5,
        lineWidth: 5,
        scaleLineWidth: true,
      },
    ],
    run(canvas, Paint) {
      const paint = new Paint(canvas);
      paint.circle(...this.arguments);
    },
  },
  {
    description: 'view transform',
    arguments: [
      {
        angle: 0.3,
        offset: { x: 50, y: 50 },
        scale: 0.5,
      },
    ],
    run(canvas, Paint) {
      const paint = new Paint(canvas);
      paint.setViewScale(this.arguments[0].scale);
      paint.setViewOffset(
        this.arguments[0].offset.x,
        this.arguments[0].offset.y
      );
      paint.setViewAngle(this.arguments[0].angle);

      paint.rect({
        position: center,
        width: 150,
        height: 100,
        fill: 'black',
        anchor: { x: 0.5, y: 0.5 },
      });
    },
  },
];
