let streetData = null;
let landmarksData = [];

document.addEventListener('DOMContentLoaded', async () => {
  initNav();
  await loadData();
  setupFilters();
  renderDirectory();
  renderLandmarks();
});

// Navigation Toggles
function initNav() {
  const buttons = document.querySelectorAll('.nav-btn');
  const panels = document.querySelectorAll('.view-panel');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const target = btn.dataset.view;
      document.getElementById(`view-${target}`).classList.add('active');
    });
  });

  // Drawer Close
  document.getElementById('drawer-close').addEventListener('click', closeDrawer);
  document.getElementById('drawer-backdrop').addEventListener('click', closeDrawer);
}

// Fetch JSON data
async function loadData() {
  try {
    const [streetRes, landmarksRes] = await Promise.all([
      fetch('data/albany-street.json'),
      fetch('data/landmarks.json')
    ]);

    streetData = await streetRes.json();
    landmarksData = await landmarksRes.json();
  } catch (err) {
    console.error('Error loading JSON files:', err);
  }
}

// Populate Year Filter Dropdown & Search Listeners
function setupFilters() {
  if (!streetData) return;

  const yearSelect = document.getElementById('year-filter');
  const searchInput = document.getElementById('directory-search');

  // Extract unique years
  const years = [...new Set(streetData.records.map(r => r.year))].filter(Boolean).sort();
  years.forEach(yr => {
    const opt = document.createElement('option');
    opt.value = yr;
    opt.textContent = yr;
    yearSelect.appendChild(opt);
  });

  yearSelect.addEventListener('change', renderDirectory);
  searchInput.addEventListener('input', renderDirectory);
}

// Render Directory Table Rows
function renderDirectory() {
  if (!streetData) return;

  const tbody = document.getElementById('directory-tbody');
  const selectedYear = document.getElementById('year-filter').value;
  const searchTerm = document.getElementById('directory-search').value.toLowerCase().trim();

  tbody.innerHTML = '';

  const filtered = streetData.records.filter(r => {
    const matchesYear = selectedYear === 'ALL' || r.year === selectedYear;
    const fullString = `${r.house_number} ${r.surname} ${r.forename} ${r.trade} ${r.building_name}`.toLowerCase();
    const matchesSearch = !searchTerm || fullString.includes(searchTerm);
    return matchesYear && matchesSearch;
  });

  filtered.forEach(record => {
    const tr = document.createElement('tr');
    tr.className = 'table-row-clickable';

    // Build occupant display
    const namePart = [record.forename, record.surname].filter(Boolean).join(' ');

    tr.innerHTML = `
      <td><strong>${record.year}</strong></td>
      <td><span class="badge-plot">${record.house_number || '—'}</span></td>
      <td>${namePart || '<em>Unrecorded</em>'}</td>
      <td>${record.trade ? `<span class="trade-pill">${record.trade}</span>` : '—'}</td>
      <td>${record.building_name || '—'}</td>
    `;

    // Click row to view all entries for that house number across time
    if (record.house_number) {
      tr.addEventListener('click', () => openPremisesDrawer(record.house_number));
    }

    tbody.appendChild(tr);
  });
}

// Render Major Works & Landmarks Cards
function renderLandmarks() {
  const container = document.getElementById('landmarks-grid');
  container.innerHTML = '';

  landmarksData.forEach(item => {
    const card = document.createElement('div');
    card.className = 'landmark-card';
    card.innerHTML = `
      <div>
        <div class="landmark-meta">${item.category}</div>
        <h3 class="landmark-title">${item.name}</h3>
        <div class="landmark-dates">${item.period}</div>
        <p class="landmark-desc">${item.summary}</p>
      </div>
      <div class="landmark-status">${item.status}</div>
    `;
    container.appendChild(card);
  });
}

// Slide-Out Drawer for Single Premises Timeline
function openPremisesDrawer(houseNo) {
  if (!streetData) return;

  const drawer = document.getElementById('property-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const content = document.getElementById('drawer-content');

  // Find all records matching this house number
  const matching = streetData.records
    .filter(r => r.house_number === houseNo)
    .sort((a, b) => parseInt(a.year) - parseInt(b.year));

  content.innerHTML = `
    <div class="drawer-header">
      <span class="meta-label">Premises Timeline</span>
      <h3>No. ${houseNo} Albany Street</h3>
    </div>
    <div class="drawer-body">
      ${matching.map(m => `
        <div class="drawer-timeline-item">
          <div class="drawer-timeline-year">${m.year}</div>
          <div style="font-weight: 600;">${[m.forename, m.surname].filter(Boolean).join(' ')}</div>${m.trade ? `<div>Trade: <em>${m.trade}</em></div>` : ''}
          ${m.building_name ? `<div>Premises/Building: ${m.building_name}</div>` : ''}
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