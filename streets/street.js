let streetData = null;

document.addEventListener('DOMContentLoaded', async () => {
  initDrawer();
  await loadStreetData();
  setupFilters();
  renderTable();
});

function initDrawer() {
  document.getElementById('drawer-close').addEventListener('click', closeDrawer);
  document.getElementById('drawer-backdrop').addEventListener('click', closeDrawer);
}

async function loadStreetData() {
  try {
    const res = await fetch('../data/albany-street.json');
    streetData = await res.json();
    
    if (streetData.summary) {
      if (streetData.summary.recordsCount) document.getElementById('stat-records').textContent = streetData.summary.recordsCount;
      if (streetData.summary.houseCount) document.getElementById('stat-properties').textContent = streetData.summary.houseCount;
    }
  } catch (err) {
    console.error('Error fetching street directory JSON:', err);
  }
}

function setupFilters() {
  if (!streetData || !streetData.records) return;

  const yearSelect = document.getElementById('street-year-filter');
  const searchInput = document.getElementById('street-search');

  const years = [...new Set(streetData.records.map(r => r.year))].filter(Boolean).sort();
  years.forEach(yr => {
    const opt = document.createElement('option');
    opt.value = yr;
    opt.textContent = `Directory of ${yr}`;
    yearSelect.appendChild(opt);
  });

  yearSelect.addEventListener('change', () => renderTable());
  searchInput.addEventListener('input', () => renderTable());
}

function renderTable() {
  if (!streetData || !streetData.records) return;

  const tbody = document.getElementById('street-tbody');
  const selectedYear = document.getElementById('street-year-filter').value;
  const query = document.getElementById('street-search').value.toLowerCase().trim();

  tbody.innerHTML = '';

  const filtered = streetData.records.filter(r => {
    const matchesYear = selectedYear === 'ALL' || r.year === selectedYear;
    const searchString = `${r.house_number} ${r.surname} ${r.forename} ${r.trade} ${r.building_name}`.toLowerCase();
    const matchesQuery = !query || searchString.includes(query);
    return matchesYear && matchesQuery;
  });

  filtered.forEach(record => {
    const tr = document.createElement('tr');
    const name = [record.forename, record.surname].filter(Boolean).join(' ');

    tr.innerHTML = `
      <td class="col-yr">${record.year}</td>
      <td class="col-no"><span class="plot-badge">${record.house_number || '—'}</span></td>
      <td class="col-name">${name || '<em>Unrecorded</em>'}</td>
      <td class="col-trade">${record.trade ? `<span class="trade-pill">${record.trade}</span>` : '—'}</td>
      <td class="col-notes">${record.building_name || '—'}</td>
    `;

    if (record.house_number) {
      tr.addEventListener('click', () => openPlotDrawer(record.house_number));
    }

    tbody.appendChild(tr);
  });
}

function openPlotDrawer(houseNo) {
  if (!streetData) return;

  const drawer = document.getElementById('property-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const content = document.getElementById('drawer-content');

  const matching = streetData.records
    .filter(r => r.house_number === houseNo)
    .sort((a, b) => parseInt(a.year) - parseInt(b.year));

  content.innerHTML = `
    <div class="drawer-header">
      <span class="section-tag">OCCUPANT TIMELINE</span>
      <h3>No. ${houseNo} Albany Street</h3>
    </div>
    <div>
      ${matching.map(m => `
        <div class="drawer-timeline-row">
          <div class="timeline-year">${m.year}</div>
          <div class="timeline-person">${[m.forename, m.surname].filter(Boolean).join(' ')}</div>${m.trade ? `<div style="font-size:0.9rem; color:var(--text-secondary);">Trade: <strong>${m.trade}</strong></div>` : ''}
          ${m.building_name ? `<div style="font-size:0.85rem; color:var(--text-muted); margin-top:2px;">Notes: ${m.building_name}</div>` : ''}
        </div>
      `).join('')}
    </div>
  `;

  drawer.classList.add('active');
  backdrop.classList.add('active');
}

function closeDrawer() {
  document.getElementById('property-drawer').classList.remove('active');
  document.getElementById('drawer-backdrop').classList.remove('active');
}