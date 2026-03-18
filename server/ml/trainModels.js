// server/ml/trainModels.js
// Run once: node ml/trainModels.js
// Trains all 3 models and saves them as JSON files.

const brain  = require('brain.js');
const fs     = require('fs');
const path   = require('path');
const { makeTutorMatchData, makePerformanceData, makeTutorRecommendData } = require('./dataset');

const OUT = path.join(__dirname);

function save(filename, net) {
  fs.writeFileSync(path.join(OUT, filename), JSON.stringify(net.toJSON()));
  console.log(`  ✅  Saved ${filename}`);
}

// ── CONFIG ───────────────────────────────────────────────────────────────────
const CONFIG = {
  hiddenLayers: [16, 8],
  activation: 'sigmoid',
  learningRate: 0.01,
};

const TRAIN_OPTS = {
  iterations:    5000,
  errorThresh:   0.005,
  log:           true,
  logPeriod:     500,
};

// ── 1. TUTOR MATCH MODEL ─────────────────────────────────────────────────────
async function trainMatchModel() {
  console.log('\n🧠  Training Tutor Match Model...');
  const net  = new brain.NeuralNetwork(CONFIG);
  const data = makeTutorMatchData(600);
  net.train(data, TRAIN_OPTS);
  save('matchModel.json', net);
}

// ── 2. PERFORMANCE MODEL ─────────────────────────────────────────────────────
async function trainPerformanceModel() {
  console.log('\n🧠  Training Student Performance Model...');
  const net  = new brain.NeuralNetwork({ ...CONFIG, hiddenLayers: [12, 8] });
  const data = makePerformanceData(600);
  net.train(data, TRAIN_OPTS);
  save('perfModel.json', net);
}

// ── 3. RECOMMENDATION MODEL ───────────────────────────────────────────────────
async function trainRecommendModel() {
  console.log('\n🧠  Training Tutor Recommendation Model...');
  const net  = new brain.NeuralNetwork(CONFIG);
  const data = makeTutorRecommendData(600);
  net.train(data, TRAIN_OPTS);
  save('recommendModel.json', net);
}

// ── RUN ALL ───────────────────────────────────────────────────────────────────
(async () => {
  console.log('🚀  Starting model training...\n');
  await trainMatchModel();
  await trainPerformanceModel();
  await trainRecommendModel();
  console.log('\n✅  All models trained and saved!');
  console.log('   matchModel.json, perfModel.json, recommendModel.json');
})();