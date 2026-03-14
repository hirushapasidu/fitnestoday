// ========== FITNESS TODAY — CALCULATORS JS ==========

// ─── TAB SWITCHING ─────────────────────────────────────
function switchTool(id) {
  document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById(id);
  const btn = document.querySelector(`[data-tool="${id}"]`);
  if (panel) panel.classList.add('active');
  if (btn) btn.classList.add('active');
  window.scrollTo({ top: document.querySelector('.tools-hero').offsetHeight + 64, behavior: 'smooth' });
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTool(btn.dataset.tool));
});

// Handle URL hash on load
window.addEventListener('DOMContentLoaded', () => {
  const hash = location.hash.replace('#', '');
  const valid = ['tdee','macros','bmi','heartrate','hydration','sleep'];
  if (hash && valid.includes(hash)) switchTool(hash);
});

// ─── TOGGLE GROUPS ─────────────────────────────────────
document.querySelectorAll('.tog').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.dataset.group;
    document.querySelectorAll(`[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const hiddenInput = document.getElementById(group);
    if (hiddenInput) hiddenInput.value = btn.dataset.val;
  });
});

// Goal buttons (macros & hydration)
document.querySelectorAll('.goal-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const siblings = btn.parentElement.querySelectorAll('.goal-btn');
    siblings.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // Update hidden input based on dataset
    if (btn.dataset.goal !== undefined) {
      document.getElementById('macro-goal').value = btn.dataset.goal;
    }
    if (btn.dataset.exgoal !== undefined) {
      document.getElementById('hyd-exercise').value = btn.dataset.exgoal;
    }
  });
});

// ─── 1. TDEE CALCULATOR ────────────────────────────────
function calcTDEE() {
  const sex    = document.getElementById('tdee-sex').value;
  const age    = parseFloat(document.getElementById('tdee-age').value);
  const weight = parseFloat(document.getElementById('tdee-weight').value);
  const height = parseFloat(document.getElementById('tdee-height').value);
  const act    = parseFloat(document.getElementById('tdee-activity').value);

  if (!age || !weight || !height) return alert('Please fill in all fields.');

  // Mifflin-St Jeor BMR
  let bmr;
  if (sex === 'female') {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  } else {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  }
  const tdee = Math.round(bmr * act);

  document.getElementById('tdee-main-num').textContent = tdee.toLocaleString();
  document.getElementById('tdee-result').style.display = 'block';

  const breakdown = document.getElementById('tdee-breakdown');
  breakdown.innerHTML = `
    <div class="breakdown-item">
      <span class="bi-num">${Math.round(bmr)}</span>
      <span class="bi-label">BMR (kcal)</span>
    </div>
    <div class="breakdown-item">
      <span class="bi-num">${Math.round(tdee * 0.85)}</span>
      <span class="bi-label">Fat Loss Target</span>
    </div>
    <div class="breakdown-item">
      <span class="bi-num">${Math.round(tdee * 1.15)}</span>
      <span class="bi-label">Muscle Gain Target</span>
    </div>
  `;
}

// ─── 2. MACRO CALCULATOR ───────────────────────────────
function calcMacros() {
  const tdee   = parseFloat(document.getElementById('macro-tdee').value);
  const weight = parseFloat(document.getElementById('macro-weight').value);
  const goal   = document.getElementById('macro-goal').value;

  if (!tdee || !weight) return alert('Please enter your TDEE and weight.');

  const multipliers = { 'fat-loss': 0.80, 'maintenance': 1.0, 'muscle': 1.15 };
  const proteinFactors = { 'fat-loss': 2.0, 'maintenance': 1.8, 'muscle': 2.2 };

  const targetKcal = Math.round(tdee * multipliers[goal]);
  const protein    = Math.round(weight * proteinFactors[goal]);
  const fat        = Math.round(targetKcal * 0.25 / 9);
  const carbs      = Math.round((targetKcal - (protein * 4) - (fat * 9)) / 4);

  document.getElementById('macro-kcal').textContent = targetKcal.toLocaleString();
  document.getElementById('macro-result').style.display = 'block';

  const total = protein + fat + carbs;
  const bars = document.getElementById('macro-bars');
  bars.innerHTML = `
    <div class="macro-bar-item">
      <div class="mbi-header">
        <span class="mbi-name">🥩 Protein</span>
        <span class="mbi-amount">${protein}g · ${protein * 4} kcal</span>
      </div>
      <div class="mbi-track">
        <div class="mbi-fill" style="width:${(protein/total)*100}%;background:#D4714E;"></div>
      </div>
    </div>
    <div class="macro-bar-item">
      <div class="mbi-header">
        <span class="mbi-name">🌾 Carbohydrates</span>
        <span class="mbi-amount">${carbs}g · ${carbs * 4} kcal</span>
      </div>
      <div class="mbi-track">
        <div class="mbi-fill" style="width:${(carbs/total)*100}%;background:#C9A96E;"></div>
      </div>
    </div>
    <div class="macro-bar-item">
      <div class="mbi-header">
        <span class="mbi-name">🥑 Fats</span>
        <span class="mbi-amount">${fat}g · ${fat * 9} kcal</span>
      </div>
      <div class="mbi-track">
        <div class="mbi-fill" style="width:${(fat/total)*100}%;background:#7FAF7B;"></div>
      </div>
    </div>
  `;
}

// ─── 3. BMI & BODY FAT ─────────────────────────────────
function toggleBmiSex(sex) {
  document.getElementById('bmi-sex').value = sex;
  document.getElementById('bmi-hip-group').style.display = sex === 'female' ? 'block' : 'none';
  document.querySelectorAll('[data-group="bmi-sex"]').forEach(b => {
    b.classList.toggle('active', b.dataset.val === sex);
  });
}

function calcBMI() {
  const sex    = document.getElementById('bmi-sex').value;
  const height = parseFloat(document.getElementById('bmi-height').value) / 100; // m
  const weight = parseFloat(document.getElementById('bmi-weight').value);
  const waist  = parseFloat(document.getElementById('bmi-waist').value);
  const neck   = parseFloat(document.getElementById('bmi-neck').value);
  const hip    = parseFloat(document.getElementById('bmi-hip').value) || 0;

  if (!height || !weight || !waist || !neck) return alert('Please fill in all fields.');
  if (sex === 'female' && !hip) return alert('Please enter hip measurement.');

  const bmi = (weight / (height * height)).toFixed(1);
  let bmiCat, bmiColor;
  if (bmi < 18.5) { bmiCat = 'Underweight'; bmiColor = '#7FAF7B'; }
  else if (bmi < 25) { bmiCat = 'Normal'; bmiColor = '#7FAF7B'; }
  else if (bmi < 30) { bmiCat = 'Overweight'; bmiColor = '#C9A96E'; }
  else { bmiCat = 'Obese'; bmiColor = '#D4714E'; }

  // Navy Tape Method (cm)
  const heightCm = height * 100;
  let bf;
  if (sex === 'female') {
    bf = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(heightCm) - 78.387;
  } else {
    bf = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(heightCm) + 36.76;
  }
  bf = Math.max(5, Math.min(50, bf)).toFixed(1);

  let bfCat, bfColor;
  if (sex === 'female') {
    if (bf < 14) { bfCat = 'Essential'; bfColor = '#7FAF7B'; }
    else if (bf < 21) { bfCat = 'Athlete'; bfColor = '#7FAF7B'; }
    else if (bf < 25) { bfCat = 'Fitness'; bfColor = '#7FAF7B'; }
    else if (bf < 32) { bfCat = 'Average'; bfColor = '#C9A96E'; }
    else { bfCat = 'Obese'; bfColor = '#D4714E'; }
  } else {
    if (bf < 6) { bfCat = 'Essential'; bfColor = '#7FAF7B'; }
    else if (bf < 14) { bfCat = 'Athlete'; bfColor = '#7FAF7B'; }
    else if (bf < 18) { bfCat = 'Fitness'; bfColor = '#7FAF7B'; }
    else if (bf < 25) { bfCat = 'Average'; bfColor = '#C9A96E'; }
    else { bfCat = 'Obese'; bfColor = '#D4714E'; }
  }

  const leanMass = (weight * (1 - bf / 100)).toFixed(1);
  const fatMass  = (weight * bf / 100).toFixed(1);

  document.getElementById('bmi-result').style.display = 'block';
  document.getElementById('bmi-grid').innerHTML = `
    <div class="bmi-card">
      <div class="bmi-card-icon">⚖️</div>
      <span class="bmi-card-num">${bmi}</span>
      <span class="bmi-card-label">BMI</span>
      <span class="bmi-card-cat" style="background:${bmiColor}22;color:${bmiColor}">${bmiCat}</span>
    </div>
    <div class="bmi-card">
      <div class="bmi-card-icon">📏</div>
      <span class="bmi-card-num">${bf}%</span>
      <span class="bmi-card-label">Body Fat</span>
      <span class="bmi-card-cat" style="background:${bfColor}22;color:${bfColor}">${bfCat}</span>
    </div>
    <div class="bmi-card">
      <div class="bmi-card-icon">💪</div>
      <span class="bmi-card-num">${leanMass}</span>
      <span class="bmi-card-label">Lean Mass (kg)</span>
    </div>
    <div class="bmi-card">
      <div class="bmi-card-icon">🔥</div>
      <span class="bmi-card-num">${fatMass}</span>
      <span class="bmi-card-label">Fat Mass (kg)</span>
    </div>
  `;
}

// ─── 4. HEART RATE ZONES ───────────────────────────────
function calcHeartRate() {
  const age     = parseFloat(document.getElementById('hr-age').value);
  const resting = parseFloat(document.getElementById('hr-resting').value);

  if (!age || !resting) return alert('Please enter your age and resting heart rate.');

  const hrMax = 220 - age;
  const hrr   = hrMax - resting; // Heart Rate Reserve

  const zones = [
    { name: 'Zone 1', label: 'Active Recovery', pct: [0.50, 0.60], color: '#7FAF7B', desc: 'Very light effort. Walk, yoga, mobility work.' },
    { name: 'Zone 2', label: 'Fat Burning', pct: [0.60, 0.70], color: '#C9A96E', desc: 'Conversational pace. The longevity & fat loss zone.' },
    { name: 'Zone 3', label: 'Aerobic', pct: [0.70, 0.80], color: '#D4A04E', desc: 'Moderate-hard effort. Improves cardiovascular fitness.' },
    { name: 'Zone 4', label: 'Threshold', pct: [0.80, 0.90], color: '#D4714E', desc: 'Hard effort. Raises your lactate threshold.' },
    { name: 'Zone 5', label: 'Peak Power', pct: [0.90, 1.00], color: '#C0392B', desc: 'Maximum effort. Short sprints, HIIT intervals only.' },
  ];

  document.getElementById('hr-result').style.display = 'block';
  document.getElementById('hr-zones').innerHTML = zones.map(z => {
    const low  = Math.round(hrr * z.pct[0] + resting);
    const high = z.pct[1] === 1.00 ? hrMax : Math.round(hrr * z.pct[1] + resting);
    return `
      <div class="hr-zone" style="border-left-color:${z.color}">
        <div>
          <div class="hz-name" style="color:${z.color}">${z.name}</div>
          <small style="font-size:11px;color:var(--muted)">${z.label}</small>
        </div>
        <div class="hz-desc">${z.desc}</div>
        <div class="hz-range" style="color:${z.color}">${low}–${high}<small> bpm</small></div>
      </div>
    `;
  }).join('');
}

// ─── 5. HYDRATION CALCULATOR ───────────────────────────
function calcHydration() {
  const weight   = parseFloat(document.getElementById('hyd-weight').value);
  const climate  = parseFloat(document.getElementById('hyd-climate').value);
  const exercise = document.getElementById('hyd-exercise').value;

  if (!weight) return alert('Please enter your weight.');

  const baseL = weight * 0.035; // 35ml per kg
  const climateAdd = { '0': 0, '0.3': 0.3, '0.7': 0.6, '1.0': 1.0 }[String(climate)] ?? climate;
  const exAdd  = { 'none': 0, 'light': 0.35, 'moderate': 0.7, 'intense': 1.2 }[exercise] ?? 0;
  const totalL = (baseL + climateAdd + exAdd).toFixed(1);
  const cups   = Math.round(totalL / 0.24);

  document.getElementById('hyd-main').textContent = totalL;
  document.getElementById('hyd-result').style.display = 'block';

  const tips = [
    { icon: '🥤', text: `That's approximately <strong>${cups} cups</strong> of water per day` },
    { icon: '⏰', text: `Drink <strong>${(totalL / 8).toFixed(1)}L</strong> every 2 hours throughout the day` },
    { icon: '💡', text: 'Start with a large glass of water first thing in the morning' },
    { icon: '🍋', text: 'Add lemon or cucumber to make it easier to hit your goal' },
    { icon: '⚡', text: exercise !== 'none' ? 'Drink 500ml extra for every hour of exercise' : 'On training days, add 400–700ml for every hour of exercise' },
  ];

  document.getElementById('hyd-tips').innerHTML = tips.map(t =>
    `<div class="hyd-tip"><span class="hyd-tip-icon">${t.icon}</span><span>${t.text}</span></div>`
  ).join('');
}

// ─── 6. SLEEP & RECOVERY QUIZ ──────────────────────────
let sleepScores = [];
let currentQ    = 1;
const TOTAL_Q   = 8;

document.querySelectorAll('.quiz-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    const score = parseInt(btn.dataset.score);
    sleepScores.push(score);

    // Visual feedback
    btn.classList.add('selected');
    setTimeout(() => {
      if (currentQ < TOTAL_Q) {
        document.querySelector(`[data-q="${currentQ}"]`).style.display = 'none';
        currentQ++;
        document.querySelector(`[data-q="${currentQ}"]`).style.display = 'block';
        updateSleepProgress();
      } else {
        showSleepResult();
      }
    }, 350);
  });
});

function updateSleepProgress() {
  const pct = (currentQ / TOTAL_Q) * 100;
  document.getElementById('sleep-progress').style.width = pct + '%';
  document.getElementById('sleep-progress-text').textContent = `Question ${currentQ} of ${TOTAL_Q}`;
}

function showSleepResult() {
  const total   = sleepScores.reduce((a, b) => a + b, 0);
  const max     = TOTAL_Q * 3;
  const pct     = Math.round((total / max) * 100);

  document.getElementById('sleep-quiz').style.display = 'none';
  const result = document.getElementById('sleep-result');
  result.style.display = 'block';

  // Animate ring
  const circle = document.getElementById('score-ring-circle');
  const circumference = 326.7;
  const offset = circumference - (pct / 100) * circumference;
  document.getElementById('score-ring-num').textContent = pct;

  let color;
  if (pct >= 80) color = '#7FAF7B';
  else if (pct >= 55) color = '#C9A96E';
  else color = '#D4714E';

  circle.style.stroke = color;
  setTimeout(() => { circle.style.strokeDashoffset = offset; }, 100);

  let verdict, tips;
  if (pct >= 80) {
    verdict = { icon: '🌟', heading: 'Excellent Recovery', text: "You're doing great! Your sleep hygiene and training balance are on point. Keep maintaining your rest days and sleep schedule." };
    tips = ['✅ Maintain your current sleep schedule', '✅ Keep including active recovery days', '✅ Consider periodic HRV tracking to stay optimized'];
  } else if (pct >= 55) {
    verdict = { icon: '⚡', heading: 'Moderate Recovery', text: "You're managing okay but there's room to improve. Minor tweaks to sleep consistency or training volume could significantly boost your results." };
    tips = ['💡 Aim for 7–9 hours of sleep every night', '💡 Add one more full rest day per week', '💡 Try a 10-minute wind-down routine before bed', '💡 Reduce screen time 1 hour before sleep'];
  } else {
    verdict = { icon: '⚠️', heading: 'Poor Recovery — Overtrained', text: "You show signs of overtraining or chronic under-recovery. Your body needs more rest to adapt and improve. Without recovery, training becomes counterproductive." };
    tips = ['🔴 Take 3–5 full rest days immediately', '🔴 Prioritize 8 hours of sleep — non-negotiable', '🔴 Reduce training volume by 40% for 2 weeks', '🔴 Consider speaking with a sports medicine professional'];
  }

  document.getElementById('sleep-verdict').innerHTML = `
    <div style="font-size:48px;margin-bottom:12px">${verdict.icon}</div>
    <h3 style="color:${color}">${verdict.heading}</h3>
    <p>${verdict.text}</p>
    <div class="verdict-tips">
      ${tips.map(t => `<div class="vtip"><span class="vtip-icon">→</span><span>${t}</span></div>`).join('')}
    </div>
  `;
}

function resetSleepQuiz() {
  sleepScores = [];
  currentQ    = 1;
  document.querySelectorAll('.quiz-opt').forEach(b => b.classList.remove('selected'));
  document.getElementById('sleep-result').style.display = 'none';
  document.getElementById('sleep-quiz').style.display = 'block';
  document.querySelectorAll('.quiz-q').forEach((q, i) => {
    q.style.display = i === 0 ? 'block' : 'none';
  });
  document.getElementById('sleep-progress').style.width = '12.5%';
  document.getElementById('sleep-progress-text').textContent = 'Question 1 of 8';
}
