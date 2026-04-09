/* ─────────────────────────────────────────
   CSV PARSER
───────────────────────────────────────── */
async function parseCSV(path) {
  const res = await fetch(path);
  const text = await res.text();
  const [headerLine, ...rows] = text.trim().split('\n');
  const headers = headerLine.split(',').map(h => h.trim());
  return rows.map(row => {
    const values = row.split(',').map(v => v.trim());
    return Object.fromEntries(
      headers.map((h, i) => [h, isNaN(values[i]) ? values[i] : Number(values[i])])
    );
  });
}

/* ─────────────────────────────────────────
   LOAD ALL CSVs THEN RENDER
───────────────────────────────────────── */
async function init() {
  const [
    applicationsPerPlatform,
    hiringFunnel,
    interviewRateRaw,
    offerRateRaw,
    responseRateRaw,
    responseRatePerPlatform,
  ] = await Promise.all([
    parseCSV('data/applications_per_platform.csv'),
    parseCSV('data/hiring_funnel.csv'),
    parseCSV('data/interview_rate_overall.csv'),
    parseCSV('data/offer_rate_overall.csv'),
    parseCSV('data/response_rate.csv'),
    parseCSV('data/response_rate_per_platform.csv'),
  ]);

  const interviewRate = interviewRateRaw[0].interview_rate;
  const offerRate     = offerRateRaw[0].offer_rate;
  const responseRate  = responseRateRaw[0];

  renderAll({ applicationsPerPlatform, hiringFunnel, interviewRate, offerRate, responseRate, responseRatePerPlatform });
}

/* ─────────────────────────────────────────
   CHART DEFAULTS
───────────────────────────────────────── */
Chart.defaults.font.family = "'DM Sans', sans-serif";
Chart.defaults.color = "#6b6760";
Chart.defaults.animation = { duration: 800, easing: 'easeInOutQuart' };

const PALETTE = {
  green:  "#2d5a3d",
  green2: "#5a8a6e",
  green3: "#a8c9b4",
  green4: "#d4e8db",
  border: "#e8e5df",
  warn:   "#c0392b",
  gold:   "#b8860b",
};

const NO_LEGEND = { display: false };

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function summaryRow(dotColor, label, value, sub, dotBorder) {
  return `
    <div class="sum-row">
      <span class="sum-dot" style="background:${dotColor};${dotBorder ? 'border:1.5px solid #ccc;' : ''}"></span>
      <span class="sum-label">${label}</span>
      <span class="sum-value">${value} <em>${sub}</em></span>
    </div>`;
}

/* ─────────────────────────────────────────
   RENDER ALL
───────────────────────────────────────── */
function renderAll(data) {
  const { applicationsPerPlatform, hiringFunnel, interviewRate, offerRate, responseRate, responseRatePerPlatform } = data;
  const totalApplied = hiringFunnel[0].count;

  // ── KPIs ──
  document.getElementById('kpi-total').textContent     = totalApplied;
  document.getElementById('kpi-response').textContent  = (responseRate.response_rate * 100).toFixed(1) + '%';
  document.getElementById('kpi-interview').textContent = (interviewRate * 100).toFixed(1) + '%';
  document.getElementById('kpi-offer').textContent     = (offerRate * 100).toFixed(1) + '%';

  const responded  = Math.round(responseRate.response_rate * totalApplied);
  const interviewed = Math.round(interviewRate * totalApplied);
  const offered    = Math.round(offerRate * totalApplied);
  document.getElementById('kpi-response-sub').textContent  = `${responded} of ${totalApplied} applications`;
  document.getElementById('kpi-interview-sub').textContent = `${interviewed} interviews secured`;
  document.getElementById('kpi-offer-sub').textContent     = `${offered} offer${offered !== 1 ? 's' : ''} received`;

  // ── 1. HIRING FUNNEL (custom HTML) ──
  const funnelEl = document.getElementById('funnelChart');
  const funnelColors = [PALETTE.green, PALETTE.green2, PALETTE.gold, PALETTE.warn];
  hiringFunnel.forEach((row, i) => {
    const pct      = ((row.count / totalApplied) * 100).toFixed(1);
    const widthPct = (row.count / totalApplied) * 100;
    funnelEl.innerHTML += `
      <div class="funnel-row">
        <div class="funnel-label">${row.stage}</div>
        <div class="funnel-bar-wrap">
          <div class="funnel-bar" style="width:${widthPct}%; background:${funnelColors[i]};">
            <span>${row.count}</span>
          </div>
        </div>
        <div class="funnel-pct">${pct}%</div>
      </div>`;
  });

  // ── 2. PLATFORM DONUT ──
  const platformColors = [PALETTE.green, PALETTE.green2, PALETTE.green3];
  new Chart(document.getElementById('platformDonut'), {
    type: 'doughnut',
    data: {
      labels: applicationsPerPlatform.map(d => d.platform),
      datasets: [{
        data:            applicationsPerPlatform.map(d => d.num_of_applications),
        backgroundColor: platformColors,
        borderColor: '#ffffff', borderWidth: 3, hoverOffset: 4,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: true, aspectRatio: 2,
      cutout: '68%',
      plugins: { legend: NO_LEGEND, tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}` } } },
    },
  });

  const platSum = document.getElementById('platformDonutSummary');
  applicationsPerPlatform.forEach((d, i) => {
    const pct = ((d.num_of_applications / totalApplied) * 100).toFixed(0);
    platSum.innerHTML += summaryRow(platformColors[i], d.platform, d.num_of_applications, `(${pct}%)`);
  });

  // ── 3. PLATFORM GROUPED BAR ──
  new Chart(document.getElementById('platformBar'), {
    type: 'bar',
    data: {
      labels: applicationsPerPlatform.map(d => d.platform),
      datasets: [
        { label: 'Tech',     data: applicationsPerPlatform.map(d => d.num_of_tech),    backgroundColor: PALETTE.green,  borderRadius: 6, borderSkipped: false },
        { label: 'Non-Tech', data: applicationsPerPlatform.map(d => d.num_of_nontech), backgroundColor: PALETTE.green3, borderRadius: 6, borderSkipped: false },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: true, aspectRatio: 2,
      plugins: { legend: NO_LEGEND, tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}` } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: PALETTE.border }, border: { dash: [4, 4], display: false }, ticks: { font: { size: 11 }, stepSize: 10 } },
      },
    },
  });

  const barSum = document.getElementById('platformBarSummary');
  applicationsPerPlatform.forEach(d => {
    barSum.innerHTML += summaryRow(PALETTE.green,  `${d.platform} — Tech`,     d.num_of_tech,    `of ${d.num_of_applications}`);
    barSum.innerHTML += summaryRow(PALETTE.green3, `${d.platform} — Non-Tech`, d.num_of_nontech, `of ${d.num_of_applications}`);
  });

  // ── 4. RESPONSE RATE TABLE ──
  document.getElementById('responseTable').innerHTML = `
    <thead>
      <tr><th>Platform</th><th>Level</th><th style="text-align:right">Response %</th></tr>
    </thead>
    <tbody>
      ${[...responseRatePerPlatform]
        .sort((a, b) => b.response_rate - a.response_rate)
        .map(row => {
          const pct   = (row.response_rate * 100).toFixed(1);
          const cls   = row.response_rate >= 0.4 ? 'rate-high' : row.response_rate >= 0.2 ? 'rate-mid' : 'rate-low';
          const label = row.response_rate >= 0.4 ? 'High'      : row.response_rate >= 0.2 ? 'Mid'      : 'Low';
          return `
            <tr>
              <td>${row.platform}</td>
              <td><span class="rate-pill ${cls}">${label}</span></td>
              <td style="text-align:right">
                <span class="mini-bar-wrap"><span class="mini-bar" style="width:${row.response_rate * 100}%"></span></span>
                ${pct}%
              </td>
            </tr>`;
        }).join('')}
    </tbody>`;

  // ── 5. OVERALL RESPONSE DONUT ──
  const respondedCount  = Math.round(responseRate.response_rate * totalApplied);
  const noResponseCount = Math.round(responseRate.no_response_rate * totalApplied);

  new Chart(document.getElementById('responseDonut'), {
    type: 'doughnut',
    data: {
      labels: ['Responded', 'No Response'],
      datasets: [{
        data: [respondedCount, noResponseCount],
        backgroundColor: [PALETTE.green, PALETTE.border],
        borderColor: '#ffffff', borderWidth: 3, hoverOffset: 4,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: true, aspectRatio: 2,
      cutout: '68%',
      plugins: { legend: NO_LEGEND, tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}` } } },
    },
  });

  const respSum = document.getElementById('responseDonutSummary');
  [
    { label: 'Responded',   count: respondedCount,  color: PALETTE.green,  border: false },
    { label: 'No Response', count: noResponseCount, color: PALETTE.border, border: true  },
  ].forEach(item => {
    const pct = ((item.count / totalApplied) * 100).toFixed(0);
    respSum.innerHTML += summaryRow(item.color, item.label, item.count, `(${pct}%)`, item.border);
  });

  // ── 6. RESPONSE RATE HORIZONTAL BAR ──
  const sorted = [...responseRatePerPlatform].sort((a, b) => a.response_rate - b.response_rate);
  new Chart(document.getElementById('responseBar'), {
    type: 'bar',
    data: {
      labels: sorted.map(d => d.platform),
      datasets: [{
        data:            sorted.map(d => +(d.response_rate * 100).toFixed(1)),
        backgroundColor: sorted.map(d => d.response_rate >= 0.4 ? PALETTE.green : d.response_rate >= 0.2 ? PALETTE.gold : PALETTE.warn),
        borderRadius: 6, borderSkipped: false,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: true, aspectRatio: 1.4,
      plugins: { legend: NO_LEGEND, tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.x}% response rate` } } },
      scales: {
        x: {
          grid: { color: PALETTE.border }, border: { dash: [4, 4], display: false },
          ticks: { callback: v => v + '%', font: { size: 11 } }, max: 100,
        },
        y: { grid: { display: false }, ticks: { font: { size: 11 } } },
      },
    },
  });

  const respBarSum = document.getElementById('responseBarSummary');
  [...sorted].reverse().forEach(d => {
    const pct   = (d.response_rate * 100).toFixed(1);
    const color = d.response_rate >= 0.4 ? PALETTE.green : d.response_rate >= 0.2 ? PALETTE.gold : PALETTE.warn;
    respBarSum.innerHTML += summaryRow(color, d.platform, pct + '%', '');
  });
}

init();
