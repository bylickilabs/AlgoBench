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
