/**
 * Imperial House - Residents Management Module (Enhanced & Fixed)
 */
document.addEventListener("DOMContentLoaded", () => {
    if (!window.residents) window.residents = [];

    const searchInput = document.getElementById("residentSearch");

    // ==========================================
    // 1. Render Table Logic (All 17 Fields)
    // ==========================================
    function renderResidentsTable(filter = "") {
        const tbody = document.getElementById("residentsTableBody");
        if (!tbody) return;

        const searchTerm = filter.toLowerCase().trim();

        const filteredResidents = window.residents
            .map((res, index) => ({ ...res, originalIndex: index }))
            .filter(res => {
                const name = String(res.buyer_name || "").toLowerCase();
                const tct = String(res.tct_no || "").toLowerCase();
                const acc = String(res.account_number || "").toLowerCase();
                const project = String(res.subdivision_id || "").toLowerCase();
                
                return name.includes(searchTerm) || tct.includes(searchTerm) || 
                       acc.includes(searchTerm) || project.includes(searchTerm);
            });

        tbody.innerHTML = "";

        if (filteredResidents.length === 0) {
            tbody.innerHTML = `<tr><td colspan="18" style="text-align:center; padding: 40px; color: #94a3b8;">No residents found.</td></tr>`;
            return;
        }

        filteredResidents.forEach(res => {
            const tr = document.createElement("tr");
            const statusClass = (res.resident_status || "Active").toLowerCase().replace(/\s+/g, "-");

            tr.innerHTML = `
                <td>${res.resident_id}</td>
                <td>${res.project || res.subdivision_id || "-"}</td>
                <td>${res.phase || "-"}</td>
                <td>${res.block_no || "-"}</td>
                <td>${res.lot_no || "-"}</td>
                <td>${res.tct_no || "-"}</td>
                <td style="font-weight: 700; color: #f8fafc;">${res.buyer_name || "N/A"}</td>
                <td><span class="status-tag ${statusClass}">${res.resident_status || "Active"}</span></td>
                <td>
                    <div style="display: flex; gap: 5px;">
                        <button class="btn-edit" onclick="editResident(${res.originalIndex})">Edit</button>
                        <button class="btn-delete" onclick="deleteResident(${res.originalIndex})" style="background:#991b1b;">Del</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // ==========================================
    // 2. Add Resident Logic
    // ==========================================
    const addForm = document.getElementById("addResidentForm");
    if (addForm) {
        addForm.addEventListener("submit", function (e) {
            e.preventDefault();
            
            const formData = {
                action: 'add',
                subdivision_id: document.getElementById("addProject").value,
                tct_no: document.getElementById("addTct").value,
                phase: document.getElementById("addPhase").value,
                block_no: document.getElementById("addBlock").value,
                lot_no: document.getElementById("addLot").value,
                buyer_name: document.getElementById("addName").value,
                new_buyer_assumed: document.getElementById("addNewBuyer").value,
                buyer_representative: document.getElementById("addRep").value,
                contact_no: document.getElementById("addContact").value,
                email_address: document.getElementById("addEmail").value,
                social_media: document.getElementById("addSocial").value,
                account_number: document.getElementById("addAccountNo").value,
                account_address: document.getElementById("addAccountAddress").value,
                resident_status: document.getElementById("addStatus").value,
                remarks: document.getElementById("addRemarks").value,
                created_at: document.getElementById("addCreatedAt").value
            };

            fetch('process_resident.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) location.reload(); 
                else alert("Error: " + data.message);
            });
        });
    }

    // ==========================================
    // 3. Edit Resident Logic (Fixed ID Mapping)
    // ==========================================
    window.editResident = function (index) {
    const res = window.residents[index];
    if (!res) return;

        try {
            // IDs must match exactly what we put in the HTML above
            document.getElementById("editResidentId").value = res.resident_id || "";
            document.getElementById("editProject").value = res.subdivision_id || "";
            document.getElementById("editTct").value = res.tct_no || "";
            document.getElementById("editPhase").value = res.phase || "";
            document.getElementById("editBlock").value = res.block_no || "";
            document.getElementById("editLot").value = res.lot_no || "";
            document.getElementById("editCreatedAt").value = res.created_at || "";

            document.getElementById("editName").value = res.buyer_name || "";
            document.getElementById("editNewBuyer").value = res.new_buyer_assumed || "";
            document.getElementById("editRep").value = res.buyer_representative || "";
            document.getElementById("editAccountNo").value = res.account_number || "";

            document.getElementById("editContact").value = res.contact_no || "";
            document.getElementById("editEmail").value = res.email_address || "";
            document.getElementById("editSocial").value = res.social_media || "";
            document.getElementById("editAccountAddress").value = res.account_address || "";

            document.getElementById("editStatus").value = res.resident_status || "Active";
            document.getElementById("editRemarks").value = res.remarks || "";

            document.getElementById("editResidentModal").classList.add("show");
        } catch (err) {
            console.error("Mapping Error: Some fields might be missing in the HTML.", err);
        }
    };

    const editForm = document.getElementById("editResidentForm");
    if (editForm) {
        editForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const formData = {
                action: 'edit',
                id: document.getElementById("editResidentId").value,
                subdivision_id: document.getElementById("editProject").value,
                tct_no: document.getElementById("editTct").value,
                phase: document.getElementById("editPhase").value,
                block_no: document.getElementById("editBlock").value,
                lot_no: document.getElementById("editLot").value,
                buyer_name: document.getElementById("editName").value,
                account_number: document.getElementById("editAccountNo").value,
                contact_no: document.getElementById("editContact").value,
                email_address: document.getElementById("editEmail").value,
                resident_status: document.getElementById("editStatus").value,
                remarks: document.getElementById("editRemarks").value
            };

            fetch('process_resident.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) location.reload();
                else alert("Error: " + data.message);
            });
        });
    }

    // ==========================================
    // 4. Delete Logic (Admin PIN Protected)
    // ==========================================
    let deleteResidentId = null; 
    
    window.deleteResident = function (index) {
        const res = window.residents[index];
        if (!res) return;
        deleteResidentId = res.resident_id; 
        document.getElementById("deleteResidentModal").classList.add("show");
    };

    // Bridging the old function name to the one used in the new modal
    window.openDeleteConfirmation = function() {
        deleteResidentId = document.getElementById("editResidentId").value;
        document.getElementById("deleteResidentModal").classList.add("show");
    };

    window.processDeleteResident = function () {
        const pinInput = document.getElementById("adminPinInput");
        
        if (!deleteResidentId || !pinInput || !pinInput.value) {
            alert("Please enter the Admin PIN");
            return;
        }

        fetch('process_resident.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                action: 'delete', 
                id: deleteResidentId,
                admin_pin: pinInput.value 
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                window.closeDeleteModal();
                showToast("Resident successfully deleted", "success");
                setTimeout(() => location.reload(), 1500); 
            } else {
                alert(data.message || "Invalid Admin PIN");
                pinInput.value = ""; 
                pinInput.focus();
            }
        });
    };

    // ==========================================
    // 5. Global Modal Control Utilities
    // ==========================================
    window.openResidentForm = () => {
        document.getElementById("addResidentModal").classList.add("show");
    };

    window.closeAddModal = () => {
        const modal = document.getElementById("addResidentModal");
        modal.classList.remove("show");
        if(addForm) addForm.reset();
    };

    window.closeEditModal = () => {
        document.getElementById("editResidentModal").classList.remove("show");
    };
    
    window.closeDeleteModal = () => {
        document.getElementById("deleteResidentModal").classList.remove("show");
        document.getElementById("adminPinInput").value = "";
    };

    function showToast(message, type = "success") {
        const toast = document.createElement("div");
        toast.className = `toast show`;
        toast.style.cssText = `position:fixed; bottom:20px; right:20px; padding:12px 24px; border-radius:8px; color:white; z-index:10000; font-weight:600; background:${type === 'success' ? '#10b981' : '#ef4444'}`;
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transition = "opacity 0.3s ease";
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ==========================================
    // KEYBOARD & CLICK LISTENERS
    // ==========================================
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            closeAddModal();
            closeEditModal();
            closeDeleteModal();
        }
    });

    if (searchInput) searchInput.addEventListener("input", e => renderResidentsTable(e.target.value));
    renderResidentsTable();

    // ==========================================
    // 6. Map-to-Modal Bridge (Updated for Sleek Info Modal)
    // ==========================================
    window.openLotModal = function(projectKey, block, lot) {
    const searchProject = String(projectKey).trim().toLowerCase();
    const searchBlock = String(block).trim();
    const searchLot = String(lot).trim();

    const residentIndex = window.residents.findIndex(r => {
        // Match using subdivision_id or project_name from PHP join
        const dbProject = String(r.subdivision_id || "").trim().toLowerCase();
        const dbBlock = String(r.block_no || "").trim();
        const dbLot = String(r.lot_no || "").trim();
        return dbProject === searchProject && dbBlock === searchBlock && dbLot === searchLot;
    });

    if (residentIndex !== -1) {
        const res = window.residents[residentIndex];

        // 1. Core Property Info
        document.getElementById("infoResId").innerText = res.resident_id || "---";
        document.getElementById("infoAddress").innerText = res.project || res.subdivision_id || "N/A";
        document.getElementById("infoProperty").innerText = `Phase ${res.phase || '1'} | Blk ${res.block_no} Lot ${res.lot_no}`;
        document.getElementById("infoTct").innerText = res.tct_no || "---";

        // 2. Client & Ownership
        document.getElementById("infoClient").innerText = res.buyer_name || "Unassigned";
        document.getElementById("infoNewBuyer").innerText = res.new_buyer_assumed || "None";
        document.getElementById("infoRep").innerText = res.buyer_representative || "---";
        
        // 3. Contact Details
        document.getElementById("infoContact").innerText = res.contact_no || "---";
        document.getElementById("infoEmail").innerText = res.email_address || "---";
        document.getElementById("infoSocial").innerText = res.social_media || "---";
        document.getElementById("infoAccAddress").innerText = res.account_address || "---";

        // 4. Billing & Status
        document.getElementById("infoAccNo").innerText = res.account_number || "---";
        document.getElementById("infoTotalBill").innerText = res.total_bill ? `₱ ${Number(res.total_bill).toLocaleString()}` : "₱ 0.00";
        document.getElementById("infoRemarks").innerText = res.remarks || "No additional remarks.";
        document.getElementById("infoCreated").innerText = res.created_at || "-";

        // 5. Dynamic Status Colors
        const statusEl = document.getElementById("infoStatus");
        const status = (res.resident_status || "Active");
        statusEl.innerText = status;
        statusEl.style.backgroundColor = status === 'Active' ? '#065f46' : '#991b1b'; // Green vs Red
        statusEl.style.color = '#fff';

        const billStatusEl = document.getElementById("infoBillStatus");
        const bStatus = (res.bill_status || "Unpaid");
        billStatusEl.innerText = bStatus.toUpperCase();
        billStatusEl.style.color = bStatus === 'Paid' ? '#4ade80' : '#fb7185';

        // 6. Action Button
        const editBtn = document.getElementById("infoEditBtn");
        if (editBtn) {
            editBtn.onclick = function() {
                window.closeMarkerModal();
                window.editResident(residentIndex); 
            };
        }

        document.getElementById("modalOverlay").classList.add("show");

    } else {
        // Logic for Vacant Lots
        const addForm = document.getElementById("addResidentForm");
        if(addForm) addForm.reset();
        
        // Pre-fill location for the new resident
        const addProj = document.getElementById("addProject");
        if(addProj) addProj.value = projectKey;
        document.getElementById("addBlock").value = block;
        document.getElementById("addLot").value = lot;
        
        window.openResidentForm();
    }
};
});