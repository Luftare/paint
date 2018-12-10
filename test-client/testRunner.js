const testCases = document.querySelector('.test-cases');
const testRecaps = document.querySelector('.test-recaps');

resemble.outputSettings({
  errorColor: {
    red: 255,
    green: 0,
    blue: 0,
  },
  errorType: 'movement',
  transparency: 1,
  useCrossOrigin: false,
  outputDiff: true,
});

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

function getImagesMatchData(dataUrlA, dataUrlB) {
  return new Promise(resolve => {
    resemble(dataUrlA)
      .compareTo(dataUrlB)
      .ignoreColors()
      .onComplete(function(data) {
        resolve({
          doMatch: data.rawMisMatchPercentage < 0.5,
          diffImageUrl: data.getImageDataUrl(),
        });
      });
  });
}

function runAllTests() {
  testCases.innerHTML = '';
  testRecaps.innerHTML = '';

  tests.forEach((test, testIndex) => {
    const testId = `test-${testIndex}`;
    const container = document.createElement('div');
    container.classList.add('case');
    container.id = testId;
    container.innerHTML = `
        <div class="case__overview">
          <div class="case__title">#${testIndex}: ${test.description}</div>
          <button class="case__update-snapshot" hidden>Update snapshot</button>
        </div>
        <div>
          <div>Output</div>
          <canvas class="case__canvas"></canvas>
        </div>
        <div>
          <div>Snapshot</div>
          <img class="case__snapshot" style="width: ${
            canvasSize.x
          }px; height: ${canvasSize.y}px;"/>
        </div>
        <div>
          <div>Snapshot diff</div>
          <img class="case__snapshot-diff" style="width: ${
            canvasSize.x
          }px; height: ${canvasSize.y}px;"/>
        </div>
    `;

    const recap = document.createElement('a');
    recap.href = `#${testId}`;
    recap.classList.add('test-recap');
    recap.innerHTML = `#${testIndex}: ${test.description}`;

    testCases.appendChild(container);
    testRecaps.appendChild(recap);

    const canvas = container.querySelector('.case__canvas');
    const updateSnapshotButton = container.querySelector(
      '.case__update-snapshot'
    );
    const snapshot = container.querySelector('.case__snapshot');
    const snapshotDiff = container.querySelector('.case__snapshot-diff');

    canvas.width = canvasSize.x;
    canvas.height = canvasSize.y;

    updateSnapshotButton.addEventListener('click', () => {
      updateTestSnapshot(testIndex, canvas.toDataURL()).then(runAllTests);
    });

    drawGrid(canvas);

    test.run(canvas);

    fetch(`snapshots/${testIndex}`)
      .then(res => res.text())
      .then(snapshotImageDataUrl => {
        if (!snapshotImageDataUrl) {
          updateSnapshotButton.hidden = false;
          updateSnapshotButton.innerHTML = 'Add snapshot';
          snapshot.classList.add('case__snapshot--missing');
          testRecaps.return;
        }

        snapshot.src = snapshotImageDataUrl;

        const localImageDataUrl = canvas.toDataURL();

        getImagesMatchData(localImageDataUrl, snapshotImageDataUrl).then(
          ({ doMatch, diffImageUrl }) => {
            snapshotDiff.src = diffImageUrl;
            if (doMatch) {
              container.classList.add('case--unchanged-snapshot');
              recap.classList.add('test-recap--success');
            } else {
              container.classList.add('case--changed-snapshot');
              recap.classList.add('test-recap--fail');
              updateSnapshotButton.hidden = false;
            }
          }
        );
      });
  });
}
