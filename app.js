const visualizer = document.getElementById('visualizer');
const algorithmSelect = document.getElementById('algorithm');
const arraySizeInput = document.getElementById('array-size');
const speedInput = document.getElementById('speed');
const shuffleBtn = document.getElementById('shuffle-btn');
const startBtn = document.getElementById('start-btn');
const stepBtn = document.getElementById('step-btn');
const resetBtn = document.getElementById('reset-btn');
const exportBtn = document.getElementById('export-btn');

const stepsEl = document.getElementById('steps');
const comparisonsEl = document.getElementById('comparisons');
const swapsEl = document.getElementById('swaps');
const runtimeEl = document.getElementById('runtime');

let arr = [];
let stepQueue = [];
let currentStep = 0;
let isRunning = false;
let timer = null;
let stats = {
  steps: 0,
  comparisons: 0,
  swaps: 0,
  runtime: 0,
};
let startTime = 0;

function shuffleArray(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderArray(active = [], selected = [], done = []) {
  visualizer.innerHTML = '';
  arr.forEach((val, idx) => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${Math.round(val)}px`;
    if (done.includes(idx)) bar.classList.add('done');
    else if (active.includes(idx)) bar.classList.add('active');
    else if (selected.includes(idx)) bar.classList.add('selected');
    visualizer.appendChild(bar);
  });
}

if (type === "bubble") {
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      steps.push({arr: a.slice(), active: [j, j+1], selected: [], done: done.slice(), stats: {...stats}});
      stats.steps++;
      stats.comparisons++;
      if (a[j] > a[j+1]) {
        [a[j], a[j+1]] = [a[j+1], a[j]];
        stats.swaps++;
        steps.push({arr: a.slice(), active: [j, j+1], selected: [j, j+1], done: done.slice(), stats: {...stats}});
      }
    }
    done.push(len - i - 1);
  }
}

else if (type === "selection") {
  for (let i = 0; i < len - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < len; j++) {
      steps.push({arr: a.slice(), active: [minIdx, j], selected: [], done: [], stats: {...stats}});
      stats.steps++;
      stats.comparisons++;
      if (a[j] < a[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      stats.swaps++;
      steps.push({arr: a.slice(), active: [i, minIdx], selected: [i, minIdx], done: [], stats: {...stats}});
    }
  }
  // Done
  done = Array.from({length: len}, (_, i) => i);
  steps.push({arr: a.slice(), active: [], selected: [], done: done.slice(), stats: {...stats}});
}

// Final state (alle fertig)
done = Array.from({length: len}, (_, i) => i);
steps.push({arr: a.slice(), active: [], selected: [], done: done.slice(), stats: {...stats}});
return steps;
