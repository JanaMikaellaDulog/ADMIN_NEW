// map.js
document.addEventListener("DOMContentLoaded", () => {

  const mapContainer = document.getElementById('mapContainer');
  let map;
  let currentLayer;
  let markersLayer;
  let activeProject = null;

  // =========================
  // PROJECT MAP CONFIG
  // =========================
  const MAPS = {
    "STO.TOMAS PHASE 1": { image: '../assets/img/maps/subdivision1.png', size: [2000, 1500] },
    "Imperial Meadows": { image: '../assets/img/maps/ISM SITE MAP.jpg', size: [2000, 1500] },
    "Brgy. Tartaria": { image: '../assets/img/maps/Silang Cavite.jpg', size: [2000, 1500] },
    "Rancho Imperial": { image: '../assets/img/maps/Rancho imperial de Silang-Model with color.jpg', size: [2000, 1500] },
    "Tagaytay Meridien": { image: '../assets/img/maps/Tagaytay Meridien map 1.jpg', size: [2000, 1500] },
    "The Venetto Heights": { image: '../assets/img/maps/The-Venetto-Heights-Updated-2014-Model.jpg', size: [2000, 1500] },
    "Trece Martires": { image: '../assets/img/maps/W-Trece Martires.jpg', size: [2000, 1500] },
    "Padre Garcia": { image: '../assets/img/maps/PADRE GARCIA phase1.jpg', size: [2000, 1500] },
    "Priya Meridian": { image: '../assets/img/maps/Priya Meridian.jpg', size: [2000, 1500] },
    "Cinta Dessa": { image: '../assets/img/maps/Cinta Dessa.jpg', size: [2000, 1500] },
    "Brgy. STO.Domingo": { image: '../assets/img/maps/BrgySTO.Domingo,IrigaCity.jpg', size: [2000, 1500] },
    "Brgy. Estanza": { image: '../assets/img/maps/BRGY. ESTANZA LEGAZPI CITY.jpg', size: [2000, 1500] },
    "Homapon Legazpi City": { image: '../assets/img/maps/HOMAPON LEGAZPI CITY.jpg', size: [2000, 1500] },
    "VHS PH 2": { image: '../assets/img/maps/VHS PH 2.JPG', size: [2000, 1500] },
    "Sorsogon": { image: '../assets/img/maps/Sorsogon - with alteration_page-0001.jpg', size: [2000, 1500] },
    "Buragwis": { image: '../assets/img/maps/Buragwis_page-0001.jpg', size: [2000, 1500] },
    "Estanza PH 1 & 2": { image: '../assets/img/maps/Estanza ph 1 & 2_page-0001.jpg', size: [2000, 1500] },
    "Estanza Phase 1": { image: '../assets/img/maps/Estanza Phase 1_page-0001.jpg', size: [2000, 1500] },
    "Iriga Phase 1": { image: '../assets/img/maps/Iriga Phase 1_page-0001.jpg', size: [2000, 1500] },
    "Labo": { image: '../assets/img/maps/Labo_page-0001.jpg', size: [2000, 1500] },
    "LeGrand 1 & 2": { image: '../assets/img/maps/LeGrand 1 & 2_page-0001.jpg', size: [2000, 1500] },
    "OLV Buragwis": { image: '../assets/img/maps/OLV Buragwis_page-0001.jpg', size: [2000, 1500] },
    "Polangui": { image: '../assets/img/maps/Polangui_page-0001.jpg', size: [2000, 1500] },
    "San Fernando": { image: '../assets/img/maps/San Fernando_page-0001.jpg', size: [2000, 1500] }
  };

  // =========================
  // MAP INIT & MARKER LOGIC
  // =========================
  document.querySelectorAll('.location-card').forEach(card => {
    card.addEventListener('click', () => {
      const projectKey = card.dataset.location;
      const projectData = MAPS[projectKey];
      if (!projectData) return;

      activeProject = projectKey;
      mapContainer.style.display = 'block';

      if (!map) {
        map = L.map('mapContainer', { crs: L.CRS.Simple, minZoom: -1, maxZoom: 2 });
      }

      if (currentLayer) map.removeLayer(currentLayer);
      if (markersLayer) map.removeLayer(markersLayer);

      const bounds = [[0, 0], [projectData.size[1], projectData.size[0]]];
      currentLayer = L.imageOverlay(projectData.image, bounds).addTo(map);
      map.fitBounds(bounds);

      // --- NEW: Trigger Analytics Update ---
      if (typeof window.updateProjectCharts === "function") {
        window.updateProjectCharts(projectKey);
      }
      if (typeof window.updateGlobalRibbon === "function") {
        window.updateGlobalRibbon();
      }

      // =========================
      // DEBUG: Coordinate Logger
      // =========================
      map.off('click');
      let debugMarker = null;
      map.on('click', function(e) {
        const x = Math.round(e.latlng.lng);
        const y = Math.round(e.latlng.lat);
        console.log(`Clicked: [${y}, ${x}]`);
        if (debugMarker) map.removeLayer(debugMarker);
        debugMarker = L.marker([y, x]).addTo(map).bindTooltip(`[${y}, ${x}]`).openTooltip();
      });

      // =========================
      // RENDER PROJECT MARKERS
      // =========================
      markersLayer = L.layerGroup().addTo(map);
      const projectMarkers = PROJECT_MARKERS[projectKey] || [];

      projectMarkers.forEach(markerData => {
        const lotNum = String(markerData.lot).trim(); 
        const blockNum = String(markerData.block).trim();

        const lotInfo = (typeof window.getResidentByLotBlock === "function")
          ? window.getResidentByLotBlock(lotNum, blockNum, projectKey) 
          : null;

        let pinClass = "no-resident"; // Default Yellow
        let residentCount = 0;

        if (lotInfo) {
          residentCount = (lotInfo.residents) ? lotInfo.residents.length : 0;
          const status = String(lotInfo.status || "").toLowerCase().trim();
          
          if (status === "active") {
            pinClass = "active-resident";   // Green
          } else if (status === "inactive") {
            pinClass = "inactive-resident"; // Red
          }
        }

        const icon = L.divIcon({
          className: `custom-pin ${pinClass}`,
          html: `<div class="pin"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10] 
        });

        const marker = L.marker(markerData.pos, { icon });
        marker.bindTooltip(`Block ${blockNum} Lot ${lotNum} (${residentCount} residents)`);
        
        marker.on('click', () => {
          window.openLotModal(projectKey, blockNum, lotNum);
        });

        markersLayer.addLayer(marker);
      });
    });
  });
});