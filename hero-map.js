document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('hero-leaflet-map');
  if (!mapElement) return;

  // Centred on the core Crindau corridor (Albany St, Malpas Rd, and Crindau House)
  const crindauCentre = [51.5992, -2.9978];

  const map = L.map('hero-leaflet-map', {
    center: crindauCentre,
    zoom: 15,
    zoomControl: false,
    scrollWheelZoom: false,
    attributionControl: false
  });

  // Top-right zoom controls
  L.control.zoom({ position: 'topright' }).addTo(map);

  // Standard OpenStreetMap tiles (no API key required)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(map);

  // Load surveyed footprints if the GeoJSON file exists
  fetch('data/crindau-cadastre.geojson')
    .then(response => {
      if (!response.ok) throw new Error('GeoJSON not found');
      return response.json();
    })
    .then(data => {
      L.geoJSON(data, {
        style: {
          color: '#832C1E',
          weight: 2,
          fillColor: '#832C1E',
          fillOpacity: 0.22
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties && feature.properties.title) {
            const popupContent = `
              <div style="font-family: 'EB Garamond', serif; font-size: 1rem;">
                <strong style="color: #832C1E; font-family: 'Playfair Display', serif;">${feature.properties.title}</strong>
                ${feature.properties.url ? `<br><a href="${feature.properties.url}" style="font-family: 'Inter', sans-serif; font-size: 0.75rem; font-weight: 700; color: #832C1E; text-decoration: none;">View Monograph &rarr;</a>` : ''}
              </div>
            `;
            layer.bindPopup(popupContent);
          }
        }
      }).addTo(map);
    })
    .catch(() => {
      // Fallback anchor markers if crindau-cadastre.geojson is not yet present
      const anchors = [
        { name: "Crindau House (c.1580)", coords: [51.5996, -2.9972], url: "buildings/crindau-house.html" },
        { name: "G.F. Lovell & Co. (Rexville)", coords: [51.5971, -2.9948], url: "buildings/lovells-confectionery.html" },
        { name: "Newport Gas Works", coords: [51.5982, -2.9922], url: "buildings/crindau-gas-works.html" },
        { name: "Crindau Board School", coords: [51.5960, -2.9980], url: "buildings/crindau-school.html" }
      ];

      anchors.forEach(site => {
        const marker = L.circleMarker(site.coords, {
          radius: 6,
          fillColor: "#832C1E",
          color: "#2E2B25",
          weight: 1.5,
          opacity: 1,
          fillOpacity: 0.85
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: 'EB Garamond', serif;">
            <strong style="font-family: 'Playfair Display', serif; color: #832C1E;">${site.name}</strong><br>
            <a href="${site.url}" style="font-family: 'Inter', sans-serif; font-size: 0.75rem; font-weight: 700; color: #832C1E;">View Monograph &rarr;</a>
          </div>
        `);
      });
    });
});