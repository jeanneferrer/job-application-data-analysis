// TODO: remove extra "charts" rendered and add loading state while fetching/parsing data, understand chart.js
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

  // Flatten single-row CSVs into plain values
  const interviewRate = interviewRateRaw[0].interview_rate;
  const offerRate     = offerRateRaw[0].offer_rate;
  const responseRate  = responseRateRaw[0];

  renderAll({
    applicationsPerPlatform,
    hiringFunnel,
    interviewRate,
    offerRate,
    responseRate,
    responseRatePerPlatform,
  });
}

Chart.defaults.font.family = "'DM Sans', sans-serif";
Chart.defaults.color = "#6b6760";

const PALETTE = {
  green:  "#2d5a3d",
  green2: "#5a8a6e",
  green3: "#a8c9b4",
  border: "#e8e5df",
  warn:   "#c0392b",
  gold:   "#b8860b",
};

function renderAll(data) {
  const {
    applicationsPerPlatform,
    hiringFunnel,
    interviewRate,
    offerRate,
    responseRate,
    responseRatePerPlatform,
  } = data;

  const totalApplied = hiringFunnel[0].count;

  // ── KPIs ──
  document.querySelector('#kpi-total').textContent     = totalApplied;
  document.querySelector('#kpi-response').textContent  = (responseRate.response_rate * 100).toFixed(1) + '%';
  document.querySelector('#kpi-interview').textContent = (interviewRate * 100).toFixed(1) + '%';
  document.querySelector('#kpi-offer').textContent     = (offerRate * 100).toFixed(1) + '%';

  // ── 1. HIRING FUNNEL ──
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
      </div>
    `;
  });

  // ── 2. PLATFORM DONUT ──
  new Chart(document.getElementById('platformDonut'), {
    type: 'doughnut',
    data: {
      labels: applicationsPerPlatform.map(d => d.platform),
      datasets: [{
        data:            applicationsPerPlatform.map(d => d.num_of_applications),
        backgroundColor: [PALETTE.green, PALETTE.green2, PALETTE.green3],
        borderColor:     '#ffffff',
        borderWidth:     3,
        hoverOffset:     6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 10, boxHeight: 10, borderRadius: 99, useBorderRadius: true, padding: 14, font: { size: 11 } },
        },
        tooltip: { callbacks: { label: ctx => ` ${ctx.parsed} applications` } },
      },
    },
  });

  // ── 3. PLATFORM GROUPED BAR ──
  new Chart(document.getElementById('platformBar'), {
    type: 'bar',
    data: {
      labels: applicationsPerPlatform.map(d => d.platform),
      datasets: [
        {
          label: 'Tech',
          data:            applicationsPerPlatform.map(d => d.num_of_tech),
          backgroundColor: PALETTE.green,
          borderRadius:    6,
          borderSkipped:   false,
        },
        {
          label: 'Non-Tech',
          data:            applicationsPerPlatform.map(d => d.num_of_nontech),
          backgroundColor: PALETTE.green3,
          borderRadius:    6,
          borderSkipped:   false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 10, boxHeight: 10, borderRadius: 99, useBorderRadius: true, padding: 16, font: { size: 11 } },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: PALETTE.border }, border: { dash: [4, 4], display: false }, ticks: { font: { size: 11 }, stepSize: 10 } },
      },
    },
  });

  // ── 4. RESPONSE RATE TABLE ──
  const tableEl = document.getElementById('responseTable');
  tableEl.innerHTML = `
    <thead>
      <tr>
        <th>Platform</th>
        <th>Rate</th>
        <th style="text-align:right">Response %</th>
      </tr>
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
                <span class="mini-bar-wrap">
                  <span class="mini-bar" style="width:${row.response_rate * 100}%"></span>
                </span>
                ${pct}%
              </td>
            </tr>
          `;
        }).join('')}
    </tbody>
  `;

  // ── 5. OVERALL RESPONSE DONUT ──
  new Chart(document.getElementById('responseDonut'), {
    type: 'doughnut',
    data: {
      labels: ['Responded', 'No Response'],
      datasets: [{
        data: [
          Math.round(responseRate.response_rate * totalApplied),
          Math.round(responseRate.no_response_rate * totalApplied),
        ],
        backgroundColor: [PALETTE.green, PALETTE.border],
        borderColor:     '#ffffff',
        borderWidth:     3,
        hoverOffset:     6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 10, boxHeight: 10, borderRadius: 99, useBorderRadius: true, padding: 16, font: { size: 11 } },
        },
        tooltip: { callbacks: { label: ctx => ` ${ctx.parsed} applications` } },
      },
    },
  });

  // ── 6. RESPONSE RATE HORIZONTAL BAR ──
  const sorted = [...responseRatePerPlatform].sort((a, b) => a.response_rate - b.response_rate);

  new Chart(document.getElementById('responseBar'), {
    type: 'bar',
    data: {
      labels: sorted.map(d => d.platform),
      datasets: [{
        label: 'Response Rate',
        data:            sorted.map(d => +(d.response_rate * 100).toFixed(1)),
        backgroundColor: sorted.map(d =>
          d.response_rate >= 0.4 ? PALETTE.green :
          d.response_rate >= 0.2 ? PALETTE.gold  : PALETTE.warn
        ),
        borderRadius:  6,
        borderSkipped: false,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.x}% response rate` } },
      },
      scales: {
        x: {
          grid: { color: PALETTE.border },
          border: { dash: [4, 4], display: false },
          ticks: { callback: v => v + '%', font: { size: 11 } },
          max: 100,
        },
        y: { grid: { display: false }, ticks: { font: { size: 11 } } },
      },
    },
  });
}

init();
