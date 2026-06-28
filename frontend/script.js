/* ─── TruthLens — script.js ─────────────────────────────────── */

const API_BASE = 'https://al-powered-fake-news-detection-2.onrender.com';

/* ── Element refs ───────────────────────────────────────────── */
const newsInput   = document.getElementById('newsInput');
const predictBtn  = document.getElementById('predictBtn');
const clearBtn    = document.getElementById('clearBtn');
const charCount   = document.getElementById('charCount');
const scanLine    = document.getElementById('scanLine');
const statusBadge = document.getElementById('statusBadge');
const statusLabel = statusBadge.querySelector('.status-label');

const loadingState = document.getElementById('loadingState');
const loaderSub    = document.getElementById('loaderSub');
const resultCard   = document.getElementById('resultCard');
const resultIcon   = document.getElementById('resultIcon');
const resultLabel  = document.getElementById('resultLabel');
const resultDesc   = document.getElementById('resultDesc');
const tryAgainBtn  = document.getElementById('tryAgainBtn');
const errorState   = document.getElementById('errorState');
const retryBtn     = document.getElementById('retryBtn');

/* [CHANGED] New elements for word counting and inline validation */
const wordCountEl      = document.getElementById('wordCount');
const wordMinNote      = document.getElementById('wordMinNote');
const wordProgressFill = document.getElementById('wordProgressFill');
const validationMsg    = document.getElementById('validationMsg');
const validationText   = document.getElementById('validationText');

/* [CHANGED] Minimum word threshold — adjust this single constant if needed */
const MIN_WORDS = 30;

/* ── Loading messages ───────────────────────────────────────── */
const loadingMessages = [
  'Vectorising text…',
  'Extracting language patterns…',
  'Running classifier…',
  'Finalising verdict…',
];
let loaderTimer = null;

/* ── [CHANGED] Word counter helper ──────────────────────────── */
function countWords(str) {
  // Split on whitespace, filter out empty strings
  return str.trim() === '' ? 0 : str.trim().split(/\s+/).length;
}

/* ── [CHANGED] Update word counter + progress bar on every keystroke ── */
newsInput.addEventListener('input', () => {
  const text = newsInput.value;
  const len  = text.length;
  const wc   = countWords(text);

  // Character counter (existing behaviour kept)
  charCount.textContent = len === 0
    ? '0 characters'
    : `${len.toLocaleString()} character${len === 1 ? '' : 's'}`;

  // Word counter display
  wordCountEl.textContent = wc;

  // Progress bar: fills to 100% at MIN_WORDS, then stays full
  const pct = Math.min((wc / MIN_WORDS) * 100, 100);
  wordProgressFill.style.width = pct + '%';

  // Colour the progress bar: red → amber → green
  if (wc === 0) {
    wordProgressFill.className = 'word-progress-fill';
  } else if (wc < MIN_WORDS) {
    wordProgressFill.className = 'word-progress-fill warn';
  } else {
    wordProgressFill.className = 'word-progress-fill ok';
  }

  // Show/hide the "minimum 30 required" note
  wordMinNote.style.display = wc >= MIN_WORDS ? 'none' : '';

  // Clear any stale validation message as the user types
  if (wc > 0) hideValidation();
});

/* ── Clear ──────────────────────────────────────────────────── */
clearBtn.addEventListener('click', () => {
  newsInput.value = '';
  charCount.textContent = '0 characters';
  /* [CHANGED] Reset word counter and progress bar */
  wordCountEl.textContent = '0';
  wordProgressFill.style.width = '0%';
  wordProgressFill.className = 'word-progress-fill';
  wordMinNote.style.display = '';
  newsInput.focus();
  hideResult();
  hideError();
  hideValidation();
});

/* ── Try Again ──────────────────────────────────────────────── */
tryAgainBtn.addEventListener('click', () => {
  hideResult();
  newsInput.value = '';
  charCount.textContent = '0 characters';
  /* [CHANGED] Reset word counter and progress bar */
  wordCountEl.textContent = '0';
  wordProgressFill.style.width = '0%';
  wordProgressFill.className = 'word-progress-fill';
  wordMinNote.style.display = '';
  hideValidation();
  newsInput.focus();
});

retryBtn.addEventListener('click', () => {
  hideError();
  runPrediction();
});

/* ── Predict ────────────────────────────────────────────────── */
predictBtn.addEventListener('click', runPrediction);

newsInput.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') runPrediction();
});

async function runPrediction() {
  const text = newsInput.value.trim();
  const wc   = countWords(text);

  /* [CHANGED] Guard 1: empty input */
  if (!text || wc === 0) {
    showValidation('Please enter a news article.');
    newsInput.focus();
    shakeTextarea();
    return;
  }

  /* [CHANGED] Guard 2: too few words — block before hitting the model */
  if (wc < MIN_WORDS) {
    showValidation(
      `Please paste a complete news article (minimum ${MIN_WORDS} words). ` +
      `This model is trained on full news articles. You have entered ${wc} word${wc === 1 ? '' : 's'}.`
    );
    shakeTextarea();
    return;
  }

  /* All guards passed — proceed with prediction */
  hideValidation();
  hideResult();
  hideError();
  setLoading(true);
  triggerScan();

  try {
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server error (${response.status})`);
    }

    const data = await response.json();
    showResult(data.prediction);
    setOnline(true);

  } catch (err) {
    if (isNetworkError(err)) {
      setOnline(false);
      showError();
    } else {
      showError(err.message);
    }
  } finally {
    setLoading(false);
  }
}

/* ── Health check on load ───────────────────────────────────── */
async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { signal: AbortSignal.timeout(4000) });
    setOnline(res.ok);
  } catch {
    setOnline(false);
  }
}

/* ── Helpers ────────────────────────────────────────────────── */
function isNetworkError(err) {
  return (
    err instanceof TypeError ||
    err.message.includes('Failed to fetch') ||
    err.message.includes('NetworkError') ||
    err.message.includes('ERR_CONNECTION')
  );
}

function setLoading(active) {
  predictBtn.disabled = active;

  if (active) {
    loadingState.classList.remove('hidden');
    let idx = 0;
    loaderSub.textContent = loadingMessages[0];
    loaderTimer = setInterval(() => {
      idx = (idx + 1) % loadingMessages.length;
      loaderSub.textContent = loadingMessages[idx];
    }, 700);
  } else {
    loadingState.classList.add('hidden');
    clearInterval(loaderTimer);
  }
}

function showResult(prediction) {
  const isReal = prediction.toUpperCase().includes('REAL');

  resultCard.classList.remove('hidden', 'real', 'fake');
  resultCard.classList.add(isReal ? 'real' : 'fake');

  resultIcon.textContent  = isReal ? '✅' : '❌';
  resultLabel.textContent = isReal ? 'REAL NEWS' : 'FAKE NEWS';
  resultDesc.textContent  = isReal
    ? 'The model found no strong indicators of misinformation in this article.'
    : 'The model detected patterns commonly associated with fabricated or misleading content.';

  resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideResult() {
  resultCard.classList.add('hidden');
  resultCard.classList.remove('real', 'fake');
}

function showError(msg) {
  if (msg) {
    const p = errorState.querySelector('p');
    p.textContent = msg;
  }
  errorState.classList.remove('hidden');
}

function hideError() {
  errorState.classList.add('hidden');
  const p = errorState.querySelector('p');
  p.innerHTML = 'Could not reach <code>http://127.0.0.1:5000</code>. Make sure the Flask server is running, then try again.';
}

/* [CHANGED] Show/hide inline validation message */
function showValidation(msg) {
  validationText.textContent = msg;
  validationMsg.classList.remove('hidden');
}

function hideValidation() {
  validationMsg.classList.add('hidden');
  validationText.textContent = '';
}

function setOnline(online) {
  statusBadge.classList.remove('online', 'offline');
  statusBadge.classList.add(online ? 'online' : 'offline');
  statusLabel.textContent = online ? 'Backend online' : 'Backend offline';
}

function triggerScan() {
  scanLine.classList.remove('active');
  void scanLine.offsetWidth; // force reflow
  scanLine.classList.add('active');
  scanLine.addEventListener('animationend', () => scanLine.classList.remove('active'), { once: true });
}

function shakeTextarea() {
  const wrap = document.getElementById('textareaWrap');
  wrap.style.animation = 'none';
  void wrap.offsetWidth;
  wrap.style.animation = 'shake 0.35s ease';
  wrap.addEventListener('animationend', () => { wrap.style.animation = ''; }, { once: true });
}

/* ── Shake keyframe (injected dynamically) ──────────────────── */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%      { transform: translateX(-6px); }
  40%      { transform: translateX(6px); }
  60%      { transform: translateX(-4px); }
  80%      { transform: translateX(4px); }
}`;
document.head.appendChild(shakeStyle);

/* ── Init ───────────────────────────────────────────────────── */
checkHealth();
newsInput.focus();
