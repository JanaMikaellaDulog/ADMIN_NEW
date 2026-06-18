(function () {
    // 1. Pointing to the IDs restored in admin.php
    let markerModal, markerContent, markerTitle;

    document.addEventListener("DOMContentLoaded", () => {
        markerModal = document.getElementById("modalOverlay");
        markerContent = document.getElementById("markerModalContent") || document.getElementById("modalContent");
        markerTitle = document.getElementById("modalTitle");

        if (!markerModal || !markerContent) {
            console.warn("Notice: Modal elements (#modalOverlay) not found in admin.php.");
        }

        if (markerModal) {
            markerModal.addEventListener("click", (e) => {
                if (e.target === markerModal) window.closeMarkerModal();
            });
        }

        const closeBtn = document.getElementById("modalClose");
        if (closeBtn) {
            closeBtn.onclick = () => window.closeMarkerModal();
        }
    });

    // ==========================================================
    // FIXED RESIDENT LOOKUP ENGINE (Using Subdivision ID: 2)
    // ==========================================================
   window.getResidentByLotBlock = function (lotNumber, blockNumber, projectID) {
    const source = window.residents || [];
    
    // Normalize targets to strings for strict matching
    const targetProjectID = String(projectID).trim();
    const targetLot = String(lotNumber).trim();
    const targetBlock = String(blockNumber).trim();

    return source.find(res => {
        const resSubID = String(res.subdivision_id || "").trim();
        const resLot = String(res.lot_no || "").trim();
        const resBlock = String(res.block_no || "").trim();

        // Exact match on ID, Lot, and Block
        return resSubID === targetProjectID && 
               resLot === targetLot && 
               resBlock === targetBlock;
    });
};

    // ============================
    // MODAL CONTROLS
    // ============================
    window.closeMarkerModal = function() {
        if (markerModal) markerModal.classList.remove("show");
    };

    /**
     * MASTER REDIRECT: Fixed index finding to ensure edit mode works
     */
    window.jumpToManagement = function(resident = null, block = null, lot = null, projectID = null) {
        window.closeMarkerModal();

        if (typeof window.closeMapSection === "function") {
            window.closeMapSection();
        }

        setTimeout(() => {
            if (resident) {
                if (typeof window.editResident === "function") {
                    // Find by resident_id for accuracy
                    const idx = window.residents.findIndex(r => r.resident_id === resident.resident_id);
                    if (idx !== -1) window.editResident(idx);
                }
            } else {
                const addModal = document.getElementById("addResidentModal");
                if (addModal) {
                    if (block) document.getElementById("addBlock").value = block;
                    if (lot) document.getElementById("addLot").value = lot;
                    if (projectID) {
                        const projectDropdown = document.getElementById("addProject");
                        if (projectDropdown) {
                            // If it's Padre Garcia, force it to 2
                            projectDropdown.value = (projectID.toLowerCase().includes("padre garcia")) ? "2" : projectID;
                        }
                    }
                    addModal.classList.add("show");
                }
            }
        }, 150);
    };

    // ==========================================================
    // MAP PIN MODAL (The UI Builder)
    // ==========================================================
    window.openLotModal = function(project, block, lot) {
    if (!markerModal || !markerContent) return;

    markerTitle.innerText = `Property Detail View`;
    
    const resident = window.getResidentByLotBlock(lot, block, project);

    if (resident) {
        const status = (resident.resident_status || "Active").trim();
        const statusClass = status.toLowerCase() === 'active' ? 'active' : 'inactive';
        
        // Billing Formatting
        const totalBill = resident.total_bill ? `₱ ${Number(resident.total_bill).toLocaleString()}` : "₱ 0.00";
        const currentBill = resident.current_bill ? `₱ ${Number(resident.current_bill).toLocaleString()}` : "₱ 0.00";
        const balance = resident.remaining_balance ? `₱ ${Number(resident.remaining_balance).toLocaleString()}` : "₱ 0.00";

        markerContent.innerHTML = `
            <div class="details-section" style="max-height: 70vh; overflow-y: auto; padding-right: 5px;">
                
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px;">
                    <div>
                        <span style="color: #64748b; font-size: 11px; font-weight: bold; text-transform: uppercase;">Resident Name</span>
                        <h2 style="margin: 0; color: #0f172a; font-size: 18px;">${resident.buyer_name || "N/A"}</h2>
                        <span class="status-tag ${statusClass}" style="margin-top: 5px;">${status}</span>
                    </div>
                    <div style="text-align: right;">
                        <span style="color: #64748b; font-size: 11px; font-weight: bold; text-transform: uppercase;">Resident ID</span>
                        <div style="color: #475569; font-weight: 600;">#${resident.resident_id || '---'}</div>
                    </div>
                </div>

                <h3 style="font-size: 12px; color: #3b82f6; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">Property Details</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <div>
                        <label style="display:block; font-size: 10px; color: #64748b;">PROJECT</label>
                        <span style="font-size: 13px; font-weight: 600;">${project}</span>
                    </div>
                    <div>
                        <label style="display:block; font-size: 10px; color: #64748b;">TCT NO.</label>
                        <span style="font-size: 13px; font-weight: 600;">${resident.tct_no || '---'}</span>
                    </div>
                    <div>
                        <label style="display:block; font-size: 10px; color: #64748b;">PHASE / BLK / LOT</label>
                        <span style="font-size: 13px; font-weight: 600;">P${resident.phase || '1'} | B${block} L${lot}</span>
                    </div>
                    <div>
                        <label style="display:block; font-size: 10px; color: #64748b;">DATE REGISTERED</label>
                        <span style="font-size: 13px; font-weight: 600;">${resident.created_at || '---'}</span>
                    </div>
                </div>

                <h3 style="font-size: 12px; color: #3b82f6; margin-bottom: 10px; text-transform: uppercase;">Contact & Ownership</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; padding: 0 5px;">
                    <div style="grid-column: span 2;">
                        <label style="display:block; font-size: 10px; color: #64748b;">NEW BUYER / ASSUMED BY</label>
                        <span style="font-size: 13px;">${resident.new_buyer_assumed || 'None'}</span>
                    </div>
                    <div>
                        <label style="display:block; font-size: 10px; color: #64748b;">REPRESENTATIVE</label>
                        <span style="font-size: 13px;">${resident.buyer_representative || '---'}</span>
                    </div>
                    <div>
                        <label style="display:block; font-size: 10px; color: #64748b;">PHONE</label>
                        <span style="font-size: 13px; font-weight: 600;">${resident.contact_no || '---'}</span>
                    </div>
                    <div>
                        <label style="display:block; font-size: 10px; color: #64748b;">EMAIL</label>
                        <span style="font-size: 13px;">${resident.email_address || '---'}</span>
                    </div>
                    <div>
                        <label style="display:block; font-size: 10px; color: #64748b;">SOCIAL MEDIA</label>
                        <span style="font-size: 13px;">${resident.social_media || '---'}</span>
                    </div>
                </div>

                <div style="background: #1e293b; color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="font-size: 11px; margin-bottom: 12px; color: #94a3b8; border-bottom: 1px solid #334155; padding-bottom: 5px; text-transform: uppercase;">Utility & Billing State</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div>
                            <label style="display:block; font-size: 9px; color: #94a3b8;">ACCOUNT NO.</label>
                            <span style="font-size: 12px; font-weight: 600;">${resident.account_number || '---'}</span>
                        </div>
                        <div>
                            <label style="display:block; font-size: 9px; color: #94a3b8;">BILL STATUS</label>
                            <span style="font-size: 11px; color: ${resident.bill_status === 'Paid' ? '#4ade80' : '#fb7185'}; font-weight: bold;">
                                ${(resident.bill_status || 'UNPAID').toUpperCase()}
                            </span>
                        </div>
                        <div style="margin-top: 8px;">
                            <label style="display:block; font-size: 9px; color: #94a3b8;">OUTSTANDING</label>
                            <span style="font-size: 15px; font-weight: 700; color: #f8fafc;">${totalBill}</span>
                        </div>
                        <div style="margin-top: 8px;">
                            <label style="display:block; font-size: 9px; color: #94a3b8;">REMAINING BAL.</label>
                            <span style="font-size: 15px; font-weight: 700; color: #94a3b8;">${balance}</span>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 25px; padding: 0 5px;">
                    <label style="display:block; font-size: 10px; color: #64748b; text-transform: uppercase;">Remarks</label>
                    <p style="font-size: 12px; color: #475569; margin: 5px 0;">${resident.remarks || "No additional remarks."}</p>
                </div>

                <div class="property-modal-actions">
                    <button class="primary-btn connovate-btn" style="width: 100%; height: 45px; font-weight: 700;" id="btn-connovate-open">
                        CONNOVATE
                    </button>
                    <button class="primary-btn solar-btn" style="width: 100%; height: 45px; font-weight: 700;" id="btn-solar-open">
                        SOLAR PANELS
                    </button>
                    <button class="primary-btn" style="width: 100%; height: 45px; font-weight: 700;" id="btn-edit-redirect">
                        GO TO FULL MANAGEMENT PAGE
                    </button>
                </div>
            </div>
        `;

        document.getElementById('btn-edit-redirect').onclick = () => window.jumpToManagement(resident);
        document.getElementById('btn-connovate-open').onclick = () => {
            if (typeof window.openConnovateModal === "function") {
                window.openConnovateModal(resident, { project, block, lot });
            }
        };
        document.getElementById('btn-solar-open').onclick = () => {
            if (typeof window.openSolarModal === "function") {
                window.openSolarModal(resident, { project, block, lot });
            } else {
                alert("Solar module is not loaded.");
            }
        };

        } else {
            // VACANT STATE
            markerContent.innerHTML = `
                <div style="text-align: center; padding: 25px 10px;">
                    <div style="font-size: 50px; margin-bottom: 15px;">🏠</div>
                    <h3 style="color: #1e293b; margin-bottom: 5px; font-size: 18px;">This Lot is Vacant</h3>
                    <p style="color: #64748b; font-size: 14px; margin-bottom: 25px;">
                        <strong>${project}</strong><br>
                        Block ${block} Lot ${lot}
                    </p>
                    
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button class="primary-btn" style="width: 100%;" 
                                onclick="window.jumpToManagement(null, '${block}', '${lot}', '${project}')">
                            + Add Resident
                        </button>
                        <button class="btn-delete" style="background: transparent; color: #64748b; border: 1px solid #cbd5e1; width: 100%;" 
                                onclick="window.closeMarkerModal()">
                            Close
                        </button>
                    </div>
                </div>
            `;
        }
        markerModal.classList.add('show');
    };

    window.closeMapSection = function() {
        const els = ['mapContainer', 'project-analytics-box', 'map-controls'];
        els.forEach(id => {
            const el = document.getElementById(id);
            if(el) el.style.display = 'none';
        });
        const sel = document.getElementById('locationSelect');
        if(sel) sel.selectedIndex = 0;
        
        if (typeof window.updateGlobalRibbon === "function") window.updateGlobalRibbon(); 
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
})();
