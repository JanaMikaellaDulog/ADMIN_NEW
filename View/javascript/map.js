// map.js
document.addEventListener("DOMContentLoaded", () => {
    const mapContainer = document.getElementById('mapContainer');
    const locationSelect = document.getElementById('locationSelect'); 
    let map;
    let currentLayer;
    let markersLayer;

    // --- FUNCTION TO CLOSE/HIDE MAP ---
    window.closeMapSection = function() {
    // 1. Hide the Map and its controls
    if (mapContainer) mapContainer.style.display = 'none';
    
    const mapControls = document.getElementById('map-controls');
    if (mapControls) mapControls.style.display = 'none';

    console.log("Map closed, but analytics remain visible.");
};

    window.handleLocationChange = function() {
        if (!locationSelect || !locationSelect.value) return;
        
        // FIXED: Using exact value to match "Rancho Imperial" (Removed .toUpperCase())
        const projectKey = locationSelect.value.trim(); 
        
        // Check if MAPS exists and contains our project
        const projectData = (typeof MAPS !== 'undefined') ? MAPS[projectKey] : null;

        if (!projectData) {
            console.error("Project Key not found in MAPS:", projectKey);
            if (typeof MAPS !== 'undefined') {
                console.log("Available keys in MAPS object:", Object.keys(MAPS));
            }
            alert(`Map data not found for "${projectKey}". Please check if the name in the Database matches the name in your MAPS configuration.`);
            return;
        }

        // --- SHOW UI ELEMENTS ---
        if (mapContainer) mapContainer.style.display = 'block';

        const mapControls = document.getElementById('map-controls');
        if (mapControls) mapControls.style.display = 'flex';

        const analyticsBox = document.getElementById('project-analytics-box');
        if (analyticsBox) analyticsBox.style.display = 'block';

        // Initialize Map if it doesn't exist
        if (!map && mapContainer) {
            map = L.map('mapContainer', { 
                crs: L.CRS.Simple, 
                minZoom: -1, 
                maxZoom: 2,
                zoomControl: true 
            });
            
            map.on('click', function(e) {
                console.log("Coordinates for marker.js:", [Math.round(e.latlng.lat), Math.round(e.latlng.lng)]);
            });
        }

        // Clear previous layers to prevent overlap
        if (currentLayer && map) map.removeLayer(currentLayer);
        if (markersLayer && map) map.removeLayer(markersLayer);

        // Add Image Overlay (The Subdivision Map)
        // Uses the database dimensions (e.g., [2000, 1500])
        const bounds = [[0, 0], [projectData.size[1], projectData.size[0]]];
        currentLayer = L.imageOverlay(projectData.image, bounds).addTo(map);
        map.fitBounds(bounds);

        // Update Charts (from projectAnalytics.js)
        if (typeof window.updateProjectCharts === "function") {
            window.updateProjectCharts(projectKey);
        }

        // Create new Layer Group for markers
        markersLayer = L.layerGroup().addTo(map);
        
        // Load Markers from marker.js using the exact Project Key
        const projectMarkers = (typeof PROJECT_MARKERS !== 'undefined') ? PROJECT_MARKERS[projectKey] || [] : [];
        console.log(`Found ${projectMarkers.length} markers for ${projectKey}`);

        projectMarkers.forEach(markerData => {
            const lotNum = String(markerData.lot).trim(); 
            const blockNum = String(markerData.block).trim();
            
            // This function checks window.residents (the database data)
            const lotInfo = (typeof window.getResidentByLotBlock === "function")
                ? window.getResidentByLotBlock(lotNum, blockNum, projectKey) 
                : null;

            let pinClass = "no-resident"; // Default Red
            let residentCount = 0;

            if (lotInfo) {
                residentCount = (lotInfo.residents) ? lotInfo.residents.length : 0;
                const status = String(lotInfo.status || "").toLowerCase().trim();
                
                // If found in database, turn Green
                if (status === "active") pinClass = "active-resident";
                else if (status === "inactive") pinClass = "inactive-resident";
            }

            // Create the Pin Icon
            const icon = L.divIcon({
                className: `custom-pin ${pinClass}`,
                html: `<div class="pin"></div>`, 
                iconSize: [20, 20],
                iconAnchor: [10, 10] 
            });

            // Add Marker to Map
            const marker = L.marker(markerData.pos, { icon });
            marker.bindTooltip(`Block ${blockNum} Lot ${lotNum} <br> ${residentCount > 0 ? residentCount + ' Resident(s)' : 'Vacant'}`);
            
            marker.on('click', (e) => {
                L.DomEvent.stopPropagation(e); 
                if (typeof window.openLotModal === "function") {
                    window.openLotModal(projectKey, blockNum, lotNum);
                }
            });
            
            markersLayer.addLayer(marker);
        });

        // Smooth scroll to map
        if (mapContainer) {
            mapContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
});