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

  //NEW MAPS
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
// OPEN LOT MODAL FUNCTION (supports flattened residents)
// =========================
window.openLotModal = function(projectKey, block, lotNumber) {
  const modal = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');
  const title = document.getElementById('modalTitle');

  content.innerHTML = "";
  title.textContent = `${projectKey} - Lot ${lotNumber}`;

  // Find all residents for this lot (supports flattened or array style)
  const residentsInLot = residents.filter(r =>
    r.project === projectKey &&
    r.lot.toString() === lotNumber.toString() &&
    r.block.toString() === block.toString()
  );

  if (!residentsInLot.length) {
    content.innerHTML = "<p>No residents found in this lot.</p>";
    return;
  }

  // Collect resident names
  let residentNames = [];
  let statusSet = new Set();
  let waterBill = 0;
  let electricBill = 0;

  residentsInLot.forEach(r => {
    if (Array.isArray(r.residents)) {
      residentNames.push(...r.residents);
    } else {
      residentNames.push(r.name);
    }

    if (r.status) statusSet.add(r.status);
    waterBill += r.water ?? 0;
    electricBill += r.electricity ?? 0;
  });

  const status = statusSet.size === 1 ? [...statusSet][0] : "mixed";

  const html = `
    <div class="residents-container">
      <div class="resident-card">
        <div class="resident-card-content">
          <p><span class="label">Block:</span> <span class="value">${block}</span></p>
          <p><span class="label">Lot:</span> <span class="value">${lotNumber}</span></p>
          <p><span class="label">Residents:</span> <span class="value">${residentNames.join(", ")}</span></p>
          <p><span class="label">Status:</span> 
            <span class="value ${status === 'active' ? 'status-active' : status === 'inactive' ? 'status-inactive' : ''}">${status}</span>
          </p>
          <div class="billing-section">
            <p><span class="label">Electric Bill:</span> <span class="amount">₱ ${electricBill}</span></p>
            <p><span class="label">Water Bill:</span> <span class="amount">₱ ${waterBill}</span></p>
          </div>
        </div>
      </div>
    </div>
  `;

  content.innerHTML = html;
  modal.classList.add('show');
};
  // =========================
  // MODAL CLOSE LOGIC
  // =========================
  const modal = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });

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

      if (!map) map = L.map('mapContainer', { crs: L.CRS.Simple, minZoom: -1, maxZoom: 2 });
      

      if (currentLayer) map.removeLayer(currentLayer);
      if (markersLayer) map.removeLayer(markersLayer);

      const bounds = [[0, 0], [projectData.size[1], projectData.size[0]]];
      currentLayer = L.imageOverlay(projectData.image, bounds).addTo(map);
      map.fitBounds(bounds);

      // =========================
      // DEBUG: Log coordinates on map click
      // =========================
      map.off('click');

        let debugMarker = null;

        map.on('click', function(e) {
          const x = Math.round(e.latlng.lng);
          const y = Math.round(e.latlng.lat);

          console.log(`Clicked coordinates: [${y}, ${x}]`);

          // Remove previous marker if exists
          if (debugMarker) {
            map.removeLayer(debugMarker);
          }

          // Create new preview marker
          debugMarker = L.marker([y, x]).addTo(map)
            .bindTooltip(`[${y}, ${x}]`, { permanent: true })
            .openTooltip();
        });

      markersLayer = L.layerGroup().addTo(map);

      const projectMarkers = PROJECT_MARKERS[projectKey] || [];
      projectMarkers.forEach(markerData => {
        const lotNumber = markerData.name?.replace("Lot ", "") ?? "";
        const blockNumber = markerData.block ?? "";

        const lotInfo = residents.find(r =>
          r.project === projectKey &&
          r.lot === lotNumber &&
          r.block === blockNumber
        );

      let pinClass = "no-resident"; // yellow default
      let residentCount = 0;
      if (lotInfo) {
        residentCount = lotInfo.residents.length;
        pinClass = lotInfo.status === "active" ? "active-resident" :
                  lotInfo.status === "inactive" ? "inactive-resident" :
                  "mixed-resident";
      }

      const icon = L.divIcon({
        className: `custom-pin ${pinClass}`,
        html: `<div class="pin"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 20]
      });

      const marker = L.marker(markerData.pos, { icon });
      marker.bindTooltip(`${markerData.name} (${residentCount} resident${residentCount !== 1 ? "s" : ""})`);
      marker.on('click', () => window.openLotModal(projectKey, markerData.block, lotNumber));

      markersLayer.addLayer(marker);
      });
    });
  });

});