const testCases = document.querySelector('.test-cases');
const image = document.querySelector('.test-image');
const canvasSize = { x: 300, y: 300 };
const center = { x: canvasSize.x / 2, y: canvasSize.y / 2 };

resemble.outputSettings({ useCrossOrigin: false });

window.addEventListener('load', runAllTests);

function drawGrid(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.fillRect(center.x - 0.5, 0, 1, canvasSize.y);
  ctx.fillRect(0, center.y - 0.5, canvasSize.x, 1);
}

function updateTestSnapshot(testIndex, updatedImageDataUrl) {
  return new Promise(resolve => {
    fetch('snapshots', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        testIndex,
        updatedImageDataUrl,
      }),
    }).then(resolve);
  });
}

function imagesMatch(dataUrlA, dataUrlB) {
  return new Promise(resolve => {
    resemble(dataUrlA)
      .compareTo(dataUrlB)
      .ignoreColors()
      .onComplete(function(data) {
        resolve(data.rawMisMatchPercentage < 0.1);
      });
  });
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

function runAllTests() {
  testCases.innerHTML = '';

  tests.forEach((test, testIndex) => {
    const canvas = document.createElement('canvas');
    const title = document.createElement('div');
    const container = document.createElement('div');
    const updateSnapshotButton = document.createElement('button');
    const snapshotImage = document.createElement('img');
    const snapshotTitle = document.createElement('div');

    container.classList.add('case');
    title.classList.add('case__title');
    snapshotTitle.classList.add('case__snapshot-title');
    canvas.classList.add('case__canvas');
    updateSnapshotButton.classList.add('case__update-snapshot');

    canvas.width = canvasSize.x;
    canvas.height = canvasSize.y;
    title.innerHTML = test.description;
    updateSnapshotButton.innerHTML = 'update snapshot';
    snapshotTitle.innerHTML = 'Snapshot';
    updateSnapshotButton.hidden = true;
    snapshotTitle.hidden = true;

    updateSnapshotButton.addEventListener('click', () => {
      updateTestSnapshot(testIndex, canvas.toDataURL()).then(runAllTests);
    });

    container.appendChild(title);
    container.appendChild(canvas);
    container.appendChild(snapshotTitle);
    container.appendChild(snapshotImage);
    container.appendChild(updateSnapshotButton);
    testCases.appendChild(container);

    drawGrid(canvas);

    test.run(canvas);

    fetch(`snapshots/${testIndex}`)
      .then(res => res.text())
      .then(snapshotImageDataUrl => {
        if (!snapshotImageDataUrl) {
          updateSnapshotButton.hidden = false;
          updateSnapshotButton.innerHTML = 'add snapshot';
          return;
        }
        const localImageDataUrl = canvas.toDataURL();
        imagesMatch(localImageDataUrl, snapshotImageDataUrl).then(
          snapshotsMatch => {
            if (snapshotsMatch) {
              container.classList.add('case--unchanged-snapshot');
            } else {
              container.classList.add('case--changed-snapshot');
              snapshotTitle.hidden = false;
              updateSnapshotButton.hidden = false;
              snapshotImage.src = snapshotImageDataUrl;
            }
          }
        );
      });
  });
}
