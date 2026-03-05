// mapModal.js
(function () {
    const modalOverlay = document.getElementById("modalOverlay");
    const modalContent = document.getElementById("modalContent");
    const modalTitle = document.getElementById("modalTitle");
    const modalCloseBtn = document.getElementById("modalClose");

    if (!modalOverlay || !modalContent) {
        console.error("Critical Error: Modal elements missing from DOM.");
        return;
    }

    // ==========================================================
    // CLOSE MAP LOGIC
    // ==========================================================
    window.closeMapSection = function() {
        const mapContainer = document.getElementById('mapContainer');
        const analyticsBox = document.getElementById('project-analytics-box');
        const mapControls = document.getElementById('map-controls');
        const locationSelect = document.getElementById('locationSelect'); 
        
        if(mapContainer) mapContainer.style.display = 'none';
        if(analyticsBox) analyticsBox.style.display = 'none';
        if(mapControls) mapControls.style.display = 'none';
        
        if(locationSelect) locationSelect.selectedIndex = 0;
        
        if (typeof window.updateGlobalRibbon === "function") {
            window.updateGlobalRibbon(); 
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ==========================================================
    // RESIDENT LOOKUP ENGINE
    // ==========================================================
    window.getResidentByLotBlock = function (lotNumber, blockNumber, projectKey) {
        const source = window.residents || window.residentsData;
        if (!source) return null;

        return source.find(res => {
            const resProject = String(res.project || "").trim().toLowerCase();
            const resLot = String(res.lot || "").trim().toLowerCase();
            const resBlock = String(res.block || "").trim().toLowerCase();

            const searchProject = String(projectKey || "").trim().toLowerCase();
            const searchLot = String(lotNumber || "").trim().toLowerCase();
            const searchBlock = String(blockNumber || "").trim().toLowerCase();

            return resProject === searchProject && resLot === searchLot && resBlock === searchBlock;
        });
    };

    // ============================
    // MODAL CONTROL
    // ============================
    window.closeModal = function() {
        modalOverlay.classList.remove("show");
        modalContent.innerHTML = ""; 
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener("click", window.closeModal);
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) window.closeModal();
    });

    // ==========================================================
    // RESIDENT FORM (Add / Edit) - Fixes the "null" property error
    // ==========================================================
    window.openResidentForm = function(resident = null) {
        if (modalTitle) modalTitle.innerText = resident ? "Edit Resident Details" : "Register New Resident";
        
        // Generate Form HTML first
        let formHTML = `
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <div class="detail-group">
                    <label style="display:block; font-size:11px; font-weight:bold; margin-bottom:5px; color:#64748b;">FULL NAME</label>
                    <input type="text" id="form-name" class="clean-dropdown" placeholder="e.g. John Doe">
                </div>
                <div class="detail-group">
                    <label style="display:block; font-size:11px; font-weight:bold; margin-bottom:5px; color:#64748b;">PROJECT LOCATION</label>
                    <input type="text" id="form-project" class="clean-dropdown" placeholder="e.g. Imperial Meadows">
                </div>
                <div style="display: flex; gap: 10px;">
                    <div style="flex:1;">
                        <label style="display:block; font-size:11px; font-weight:bold; margin-bottom:5px; color:#64748b;">BLOCK</label>
                        <input type="text" id="form-block" class="clean-dropdown">
                    </div>
                    <div style="flex:1;">
                        <label style="display:block; font-size:11px; font-weight:bold; margin-bottom:5px; color:#64748b;">LOT</label>
                        <input type="text" id="form-lot" class="clean-dropdown">
                    </div>
                </div>
                <button class="primary-btn" style="margin-top: 10px;" onclick="window.saveResidentData ? window.saveResidentData() : alert('Save logic not connected')">
                    ${resident ? 'Update Resident' : 'Add Resident'}
                </button>
            </div>
        `;

        modalContent.innerHTML = formHTML;
        modalOverlay.classList.add("show");

        // ONLY fill values after HTML is injected to prevent "null" error
        if (resident) {
            const nameField = document.getElementById('form-name');
            const projectField = document.getElementById('form-project');
            const blockField = document.getElementById('form-block');
            const lotField = document.getElementById('form-lot');

            if(nameField) nameField.value = resident.name || "";
            if(projectField) projectField.value = resident.project || "";
            if(blockField) blockField.value = resident.block || "";
            if(lotField) lotField.value = resident.lot || "";
        }
    };

    // ============================
    // MAP PIN MODAL
    // ============================
    window.openLotModal = function (projectKey, block, lotNumber) {
        const bNum = String(block).trim(); 
        const lNum = String(lotNumber).trim();
        const lotData = window.getResidentByLotBlock(lNum, bNum, projectKey);

        if (modalTitle) modalTitle.innerText = `Block ${bNum} - Lot ${lNum}`;

        let contentHTML = `
            <div class="detail-group"><b>Project:</b> ${projectKey}</div>
            <div class="detail-group"><b>Address:</b> Block ${bNum} | Lot ${lNum}</div>
        `;

        if (!lotData) {
            contentHTML += `
                <div class="detail-group"><b>Client:</b> —</div>
                <div class="detail-group"><b>Status:</b> <span class="status-tag vacant">Vacant</span></div>
            `;
        } else {
            const clientName = lotData.name || (Array.isArray(lotData.residents) ? lotData.residents.join(", ") : "Unknown");
            const totalElectric = Number(lotData.electricity) || 0;
            const totalWater = Number(lotData.water) || 0;
            const status = (lotData.status || "inactive").toLowerCase();

            contentHTML += `
                <div class="detail-group"><b>Client(s):</b> ${clientName}</div>
                <div class="detail-group"><b>Status:</b> <span class="status-tag ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></div>
                <div class="detail-group"><b>Electricity:</b> ₱ ${totalElectric.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                <div class="detail-group"><b>Water:</b> ₱ ${totalWater.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            `;
        }

        modalContent.innerHTML = contentHTML;
        modalOverlay.classList.add("show");
    };
})();