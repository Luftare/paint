const testCases = document.querySelector('.test-cases');
const image = document.querySelector('.test-image');
const canvasSize = { x: 300, y: 300 };
const center = { x: canvasSize.x / 2, y: canvasSize.y / 2 };

function drawGrid(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.fillRect(center.x - 0.5, 0, 1, canvasSize.y);
  ctx.fillRect(0, center.y - 0.5, canvasSize.x, 1);
}

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
        scale: 2,
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

tests.forEach(test => {
  const canvas = document.createElement('canvas');
  const title = document.createElement('div');
  const container = document.createElement('div');

  container.classList.add('case');
  title.classList.add('case__title');
  canvas.classList.add('case__canvas');

  canvas.width = canvasSize.x;
  canvas.height = canvasSize.y;
  title.innerHTML = test.description;

  drawGrid(canvas);

  test.run(canvas);

  container.appendChild(title);
  container.appendChild(canvas);
  testCases.appendChild(container);
});
