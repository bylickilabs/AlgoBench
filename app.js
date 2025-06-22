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

// --- Util ---
function shuffleArray(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// --- Visualizer ---
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

// --- Algorithm Steps (Step queue: {arr, active, selected, done, stats}) ---
function prepareSteps() {
  const type = algorithmSelect.value;
  let steps = [];
  let a = arr.slice();
  let len = a.length;
  let done = [];
  let stats = {steps: 0, comparisons: 0, swaps: 0};

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

  // Final state (all done)
  done = Array.from({length: len}, (_, i) => i);
  steps.push({arr: a.slice(), active: [], selected: [], done: done.slice(), stats: {...stats}});
  return steps;
}

// --- Control ---
function resetArray(size = +arraySizeInput.value) {
  arr = [];
  for (let i = 0; i < size; i++) arr.push(Math.round(Math.random() * 220) + 60);
  arr = shuffleArray(arr);
  stepQueue = [];
  currentStep = 0;
  stats = {steps: 0, comparisons: 0, swaps: 0, runtime: 0};
  updateStats();
  renderArray();
}
function updateStats() {
  stepsEl.textContent = stats.steps;
  comparisonsEl.textContent = stats.comparisons;
  swapsEl.textContent = stats.swaps;
  runtimeEl.textContent = stats.runtime;
}
function playSteps() {
  if (!stepQueue.length) return;
  isRunning = true;
  startBtn.disabled = true;
  stepBtn.disabled = true;
  resetBtn.disabled = true;
  let delay = 150 - +speedInput.value;
  function next() {
    if (currentStep >= stepQueue.length) {
      isRunning = false;
      startBtn.disabled = false;
      stepBtn.disabled = false;
      resetBtn.disabled = false;
      stats.runtime = Date.now() - startTime;
      updateStats();
      renderArray([], [], Array.from({length: arr.length}, (_, i) => i));
      return;
    }
    const step = stepQueue[currentStep];
    arr = step.arr.slice();
    stats = {...stats, ...step.stats};
    updateStats();
    renderArray(step.active, step.selected, step.done);
    currentStep++;
    timer = setTimeout(next, delay);
  }
  startTime = Date.now();
  next();
}
function stepOnce() {
  if (!stepQueue.length || currentStep >= stepQueue.length) return;
  const step = stepQueue[currentStep];
  arr = step.arr.slice();
  stats = {...stats, ...step.stats};
  updateStats();
  renderArray(step.active, step.selected, step.done);
  currentStep++;
  if (currentStep >= stepQueue.length) {
    stats.runtime = Date.now() - startTime;
    updateStats();
    renderArray([], [], Array.from({length: arr.length}, (_, i) => i));
  }
}

function resetSorting() {
  clearTimeout(timer);
  resetArray();
  renderArray();
  startBtn.disabled = false;
  stepBtn.disabled = false;
  resetBtn.disabled = false;
  stats.runtime = 0;
  updateStats();
}

// --- Event Handler ---
shuffleBtn.onclick = resetSorting;
resetBtn.onclick = resetSorting;
startBtn.onclick = () => {
  clearTimeout(timer);
  stepQueue = prepareSteps();
  currentStep = 0;
  stats.runtime = 0;
  updateStats();
  playSteps();
};
stepBtn.onclick = () => {
  if (!stepQueue.length || currentStep >= stepQueue.length) {
    stepQueue = prepareSteps();
    currentStep = 0;
    stats.runtime = 0;
    updateStats();
    startTime = Date.now();
  }
  stepOnce();
};
arraySizeInput.onchange = resetSorting;
algorithmSelect.onchange = resetSorting;

speedInput.oninput = function() {
  // optional live preview for speed
};

exportBtn.onclick = () => {
  const out = {
    algorithm: algorithmSelect.value,
    arraySize: arr.length,
    steps: stats.steps,
    comparisons: stats.comparisons,
    swaps: stats.swaps,
    runtime: stats.runtime,
    timestamp: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(out, null, 2)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "algobench-stats.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 600);
};

// --- Init ---
resetArray();
renderArray();
updateStats();
