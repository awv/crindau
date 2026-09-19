// Survey Coordinates around Crindau, Newport
const surveyPoints = [
  {
    id: "crindau-house",
    title: "Crindau House",
    category: "manorial",
    period: "c.1580 – Present",
    lat: 51.6022,
    lng: -2.9980,
    desc: "Late sixteenth-century regional stone manor house, historic agrarian seat of the Herbert lineage.",
    url: "buildings/crindau-house.html"
  },
  {
    id: "crindau-gas-works",
    title: "Newport Gas Co. (Crindau Works)",
    category: "industrial",
    period: "1880s – mid-20th C.",
    lat: 51.6035,
    lng: -2.9915,
    desc: "Substantial municipal gas production plant with retort houses, purifiers, and direct wharfage.",
    url: "buildings/crindau-gas-works.html"
  },
  {
    id: "lovells-confectionery",
    title: "G.F. Lovell & Co. (Rexville Works)",
    category: "industrial",
    period: "1913 – 2005",
    lat: 51.6014,
    lng: -2.9950,
    desc: "Renowned toffee and confectionery works along Albany Street, creators of Milky Lunch.",
    url: "buildings/lovells-confectionery.html"
  },
  {
    id: "south-wales-glass",
    title: "South Wales Glass Works",
    category: "industrial",
    period: "Late 19th C.",
    lat: 51.6040,
    lng: -2.9930,
    desc: "Specialist bottle manufacturing plant employing local glassblowers and gatherers.",
    url: "buildings/south-wales-glass.html"
  },
  {
    id: "crindau-school",
    title: "Crindau Board School",
    category: "civic",
    period: "1901 – Present",
    lat: 51.5995,
    lng: -2.9972,
    desc: "Imposing red-brick school established by the Newport School Board on Ailesbury Street.",
    url: "buildings/crindau-school.html"
  },
  {
    id: "rexville-ground",
    title: "Rexville Ground (Lovells Athletic)",
    category: "sports",
    period: "1918 – 1969",
    lat: 51.6008,
    lng: -2.9935,
    desc: "Home pitch of the Lovells factory team, host to Southern League and Welsh Cup ties.",
    url: "buildings/rexville-ground.html"
  },
  {
    id: "albany-street-row",
    title: "Albany Street Domestic Row",
    category: "civic",
    period: "1887 – 1925",
    lat: 51.6019,
    lng: -2.9958,
    desc: "69 terraced domestic tenements and workshops connecting Malpas Road to the sidings.",
    url: "streets/albany-street.html"
  }
];

// SVG Icon templates by category
const pinIcons = {
  manorial: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M3 21h18M3 7v14M21 7v14M6 7V4l6-2 6 2v3"/></svg>`,
  industrial: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M2 20h20M4 20V10l4 4V4l6 6V6l6 6v8"/></svg>`,
  civic: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z"/></svg>`,
  sports: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20"/></svg>`
};

document.addEventListener('DOMContentLoaded', () => {
  // Centre map on Crindau coordinates
  const map = L.map('survey-map', {
    scrollWheelZoom: false
  }).setView([51.6018, -2.9955], 16);

  // Standard OpenStreetMap base with all terraces, railway sidings, and streets
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const markerLayer = L.layerGroup().addTo(map);

  function renderMarkers(selectedCategory = 'all') {
    markerLayer.clearLayers();
    let visibleCount = 0;

    surveyPoints.forEach(point => {
      if (selectedCategory !== 'all' && point.category !== selectedCategory) {
        return;
      }

      visibleCount++;

      // Custom Leaflet DivIcon
      const icon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="archival-marker-pin pin-${point.category}" style="width: 32px; height: 32px;">
            ${pinIcons[point.category] || pinIcons.civic}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([point.lat, point.lng], { icon: icon });

      // Dossier popup
      const popupHtml = `
        <span class="popup-tag">${point.category}</span>
        <h4 class="popup-title">${point.title}</h4>
        <span class="popup-period">${point.period}</span>
        <p class="popup-desc">${point.desc}</p>
        ${point.url ? `<a href="${point.url}" class="popup-link">Open Full Dossier &rarr;</a>` : '<em>Archival note on file</em>'}
      `;

      marker.bindPopup(popupHtml);
      markerLayer.addLayer(marker);
    });

    const counterEl = document.getElementById('point-counter');
    if (counterEl) {
      counterEl.textContent = `${visibleCount} Survey Coordinates Plotted`;
    }
  }

  // Initial markers draw
  renderMarkers();

  // Filter pills
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMarkers(btn.dataset.cat);
    });
  });

  // Cadastral GeoJSON Layer
  const cadastreLayerGroup = L.layerGroup().addTo(map);

  fetch('data/crindau-cadastre.geojson')
    .then(res => res.json())
    .then(geoData => {
      const geoLayer = L.geoJSON(geoData, {
        style: function (feature) {
          const isSurviving = feature.properties.status === 'surviving';
          return {
            className: isSurviving ? 'cadastre-poly-surviving' : 'cadastre-poly-demolished'
          };
        },
        onEachFeature: function (feature, layer) {
          const p = feature.properties;
          
          layer.on({
            mouseover: function (e) {
              e.target.setStyle({ fillOpacity: 0.55, weight: 3 });
            },
            mouseout: function (e) {
              geoLayer.resetStyle(e.target);
            },
            click: function () {
              if (p.url) {
                window.location.href = p.url;
              }
            }
          });

          layer.bindTooltip(`
            <strong style="font-family: var(--font-heading); font-size: 1rem; color: #1C1E1B;">${p.name}</strong><br/>
            <span style="font-family: var(--font-sans); font-size: 0.75rem; color: #832C1E; text-transform: uppercase;">${p.status} &bull; ${p.dates}</span>
          `, { sticky: true, className: 'leaflet-popup-content-wrapper' });
        }
      });

      cadastreLayerGroup.addLayer(geoLayer);

      // Checkbox listener
      const toggleBox = document.getElementById('toggle-footprints');
      if (toggleBox) {
        toggleBox.addEventListener('change', (e) => {
          if (e.target.checked) {
            map.addLayer(cadastreLayerGroup);
          } else {
            map.removeLayer(cadastreLayerGroup);
          }
        });
      }
    })
    .catch(err => console.error('Error loading cadastre GeoJSON:', err));
});