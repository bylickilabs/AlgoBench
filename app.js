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

