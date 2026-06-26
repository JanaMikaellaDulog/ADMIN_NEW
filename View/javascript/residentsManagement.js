/**
 * Imperial House - Residents Management Module (Enhanced & Fixed)
 */
document.addEventListener("DOMContentLoaded", () => {
    if (!window.residents) window.residents = [];
    window.currentInfoResident = null;
    window.currentInfoResidentContext = null;

    const searchInput = document.getElementById("residentSearch");
    const addForm = document.getElementById("addResidentForm");
    const editForm = document.getElementById("editResidentForm");

    function getSelectedProjectDetails(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return { id: "", name: "" };

        const option = select.options[select.selectedIndex];
        return {
            id: String(select.value || "").trim(),
            name: String(option?.text || "").trim()
        };
    }

    function openConnovateFromForm(config) {
        if (typeof window.openConnovateModal !== "function") return;

        const project = getSelectedProjectDetails(config.projectId);
        const block = String(document.getElementById(config.blockId)?.value || "").trim();
        const lot = String(document.getElementById(config.lotId)?.value || "").trim();

        if (!project.id || !project.name || !block || !lot) {
            alert("Please complete the project, block number, and lot number first.");
            return;
        }

        window.openConnovateModal(
            {
                resident_id: String(document.getElementById(config.residentId || "")?.value || "").trim(),
                buyer_name: String(document.getElementById(config.nameId)?.value || "").trim(),
                resident_status: String(document.getElementById(config.statusId)?.value || "Active").trim(),
                phase: String(document.getElementById(config.phaseId)?.value || "").trim(),
                subdivision_id: project.id,
                block_no: block,
                lot_no: lot,
                project: project.name
            },
            {
                project: project.name,
                block,
                lot
            }
        );
    }

        // ==========================================
        // 1. Render Table Logic (WITH PAGINATION)
        // ==========================================
        let currentPage = 1;
        const rowsPerPage = 30;

        function renderResidentsTable(filter = "") {
            const tbody = document.getElementById("residentsTableBody");
            if (!tbody) return;

            const searchTerm = filter.toLowerCase().trim();

            // 1. FILTER: Search through the ENTIRE list first
            const filteredResidents = window.residents
                .map((res, index) => ({ ...res, originalIndex: index }))
                .filter(res => {
                    const name = String(res.buyer_name || "").toLowerCase();
                    const tct = String(res.tct_no || "").toLowerCase();
                    const acc = String(res.account_number || "").toLowerCase();
                    const projectID = String(res.subdivision_id || "").toLowerCase();
                    const projectName = String(res.project || "").toLowerCase();
                    
                    return name.includes(searchTerm) || tct.includes(searchTerm) || 
                        acc.includes(searchTerm) || projectID.includes(searchTerm) ||
                        projectName.includes(searchTerm);
                });

            // 2. PAGINATION MATH
            const totalPages = Math.ceil(filteredResidents.length / rowsPerPage);
            
            // Safety: If we search and the result has fewer pages, reset to page 1
            if (currentPage > totalPages) currentPage = totalPages || 1;

            const start = (currentPage - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            const paginatedItems = filteredResidents.slice(start, end);

            tbody.innerHTML = "";

            if (paginatedItems.length === 0) {
                tbody.innerHTML = `<tr><td colspan="18" style="text-align:center; padding: 40px; color: #94a3b8;">No residents found.</td></tr>`;
                renderPaginationControls(0, 0); 
                return;
            }

            paginatedItems.forEach(res => {
                const tr = document.createElement("tr");
                const statusVal = res.resident_status || "Active";
                const statusClass = statusVal.toLowerCase().replace(/\s+/g, "-");
                const displayProject = res.project || res.subdivision_id || "-";

                tr.innerHTML = `
                    <td>${res.resident_id}</td>
                    <td>${displayProject}</td>
                    <td>${res.phase || "-"}</td>
                    <td>${res.block_no || "-"}</td>
                    <td>${res.lot_no || "-"}</td>
                    <td>${res.tct_no || "-"}</td>
                    <td style="font-weight: 700; color: #f8fafc;">${res.buyer_name || "N/A"}</td>
                    <td><span class="status-tag ${statusClass}">${statusVal}</span></td>
                    <td>
                        <div style="display: flex; gap: 5px;">
                            <button class="btn-edit" onclick="editResident(${res.originalIndex})">Edit</button>
                            <button class="btn-delete" onclick="deleteResident(${res.originalIndex})" style="background:#991b1b;">Del</button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            // Update the navigation buttons
            renderPaginationControls(currentPage, totalPages);
        }

        // NEW: Helper for creating pagination buttons
        function renderPaginationControls(current, total) {
            let controls = document.getElementById("paginationControls");
            
            // Create the container if it doesn't exist in your HTML
            if (!controls) {
                controls = document.createElement("div");
                controls.id = "paginationControls";
                controls.style = "display: flex; justify-content: center; align-items: center; gap: 20px; margin-top: 20px; padding: 15px;";
                // Place it right after the table's parent container
                const tableParent = document.querySelector(".table-container");
                if(tableParent) tableParent.after(controls);
            }

            if (total <= 1) {
                controls.innerHTML = "";
                return;
            }

            controls.innerHTML = `
                <button class="btn-edit" ${current === 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} 
                    onclick="window.changePage(${current - 1})">Previous</button>
                <span style="color: #94a3b8;">Page <b>${current}</b> of ${total}</span>
                <button class="btn-edit" ${current === total ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} 
                    onclick="window.changePage(${current + 1})">Next</button>
            `;
        }

        // Global function to handle page switching
        window.changePage = function(newPage) {
            currentPage = newPage;
            const currentSearch = searchInput ? searchInput.value : "";
            renderResidentsTable(currentSearch);
            
            // Optional: Scroll to top of table when page changes
            const tableContainer = document.querySelector(".table-container");
            if(tableContainer) tableContainer.scrollTop = 0;
        };

    // ==========================================
    // 2. Add Resident Logic (FIXED DOUBLE SAVE)
    // ==========================================
    if (addForm) {
        addForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const submitBtn = addForm.querySelector('button[type="submit"]');
            if (submitBtn.disabled) return;

            submitBtn.disabled = true;
            submitBtn.innerText = "Saving...";

            let tctFilePath = "";
            const tctFileInput = document.getElementById("addTctFile");

            if (tctFileInput && tctFileInput.files.length > 0) {
                const uploadData = new FormData();
                uploadData.append("tct_file", tctFileInput.files[0]);

                const uploadRes = await fetch("upload_tct_file.php", {
                    method: "POST",
                    body: uploadData
                });

                const uploadJson = await uploadRes.json();

                if (!uploadJson.success) {
                    alert(uploadJson.message || "Unable to upload TCT file.");
                    submitBtn.disabled = false;
                    submitBtn.innerText = "Register Resident";
                    return;
                }

                tctFilePath = uploadJson.file;
            }

            const formData = {
                action: 'add',
                subdivision_id: document.getElementById("addProject").value,
                tct_no: document.getElementById("addTct").value,
                tct_file: tctFilePath,
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
                if (data.success) {
                    location.reload();
                } else {
                    alert("Error: " + data.message);
                    submitBtn.disabled = false;
                    submitBtn.innerText = "Register Resident";
                }
            })
            .catch(err => {
                console.error(err);
                submitBtn.disabled = false;
                submitBtn.innerText = "Register Resident";
            });
        });
    }

    // ==========================================
    // 3. Edit Resident Logic
    // ==========================================
    window.editResident = function (index) {
        const res = window.residents[index];
        if (!res) return;

        try {
            document.getElementById("editResidentId").value = res.resident_id || "";
            document.getElementById("editProject").value = res.subdivision_id || "";
            document.getElementById("editTct").value = res.tct_no || "";

            // ---------- TCT FILE ----------
                 
            document.getElementById("editCurrentTctFile").value = res.tct_file || "";
            document.getElementById("editDeleteTctFile").value = "0"; // reset delete flag

            const tctFileInfo = document.getElementById("editTctFileInfo");
            const tctFileName = document.getElementById("editTctFileName");
            const tctFileEmpty = document.getElementById("editTctFileEmpty");

            if (res.tct_file) {
                tctFileName.textContent = res.tct_file.split("/").pop();
                tctFileInfo.style.display = "flex";
                tctFileEmpty.style.display = "none";
            } else {
                tctFileInfo.style.display = "none";
                tctFileEmpty.style.display = "block";
            }

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
            console.error("Mapping Error:", err);
        }
    };

    if (editForm) {
        editForm.addEventListener("submit", async function(e) {
            e.preventDefault();

            let tctFilePath = document.getElementById("editCurrentTctFile")?.value || "";
            const tctFileInput = document.getElementById("editTctFile");

            if (tctFileInput && tctFileInput.files.length > 0) {
                const uploadData = new FormData();
                uploadData.append("tct_file", tctFileInput.files[0]);

                const uploadRes = await fetch("upload_tct_file.php", {
                    method: "POST",
                    body: uploadData
                });

                const uploadJson = await uploadRes.json();

                if (!uploadJson.success) {
                    alert(uploadJson.message || "Unable to upload TCT file.");
                    return;
                }

                tctFilePath = uploadJson.file;
                document.getElementById("editDeleteTctFile").value = "0";
            }

            const formData = {
                action: 'edit',
                id: document.getElementById("editResidentId").value,
                subdivision_id: document.getElementById("editProject").value,
                tct_no: document.getElementById("editTct").value,
                tct_file: tctFilePath,
                delete_tct_file: document.getElementById("editDeleteTctFile").value,
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
    // 4. Delete Logic (Fixed Security & Reload)
    // ==========================================
    let deleteResidentId = null; 
    
    window.deleteResident = function (index) {
        const res = window.residents[index];
        if (!res) return;

        deleteResidentId = res.resident_id; 

        // FIX: Clear the PIN input EVERY time the modal opens
        const pinInput = document.getElementById("adminPinInput");
        if (pinInput) {
            pinInput.value = "";
            setTimeout(() => pinInput.focus(), 200); 
        }

        document.getElementById("deleteResidentModal").classList.add("show");
    };

    window.processDeleteResident = function () {
        const pinInput = document.getElementById("adminPinInput");
        
        if (!deleteResidentId || !pinInput || !pinInput.value) {
            alert("Please enter the Admin PIN");
            return;
        }

        const confirmBtn = document.querySelector("#deleteResidentModal button[onclick='processDeleteResident()']");
        if (confirmBtn) confirmBtn.disabled = true;

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
                pinInput.value = ""; 
                window.closeDeleteModal();
                showToast("Resident successfully deleted", "success");
                setTimeout(() => { location.reload(); }, 1000); 
            } else {
                alert(data.message || "Invalid Admin PIN");
                pinInput.value = "";
                pinInput.focus();
                if (confirmBtn) confirmBtn.disabled = false;
            }
        })
        .catch(err => {
            console.error("Delete Error:", err);
            if (confirmBtn) confirmBtn.disabled = false;
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

        if (window.currentInfoResident) {
            const overlay = document.getElementById("modalOverlay");
            if (overlay) overlay.classList.add("show");
        }
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
    // 6. Map-to-Modal Bridge
    // ==========================================
    window.openLotModal = function(projectID, block, lot) {
        const searchID = String(projectID).trim();
        const searchBlock = String(block).trim();
        const searchLot = String(lot).trim();

        const residentIndex = window.residents.findIndex(r => {
            const dbProjectID = String(r.subdivision_id || "").trim();
            const dbBlock = String(r.block_no || "").trim();
            const dbLot = String(r.lot_no || "").trim();
            return dbProjectID === searchID && dbBlock === searchBlock && dbLot === searchLot;
        });

        if (residentIndex !== -1) {
            const res = window.residents[residentIndex];
            window.currentInfoResident = res;
            window.currentInfoResidentContext = {
                project: res.project || res.subdivision_id,
                block: res.block_no,
                lot: res.lot_no
            };

            document.getElementById("infoResId").innerText = res.resident_id || "---";
            document.getElementById("infoAddress").innerText = res.project || res.subdivision_id || "N/A";
            document.getElementById("infoProperty").innerText = `Phase ${res.phase || '1'} | Blk ${res.block_no} Lot ${res.lot_no}`;
            document.getElementById("infoTct").innerText = res.tct_no || "---";

            // ---- TCT FILE (Property Detail View) ----
            const tctFileEl = document.getElementById("infoTctFile");
            if (tctFileEl) {
                tctFileEl.innerHTML = res.tct_file
                    ? `<a href="../../${res.tct_file}" target="_blank"
                          style="color:#d49006; font-weight:600; font-size:13px;">
                          📄 Open TCT File
                       </a>`
                    : `<span style="color:#64748b;">No TCT file uploaded</span>`;
            }

            document.getElementById("infoClient").innerText = res.buyer_name || "Unassigned";
            document.getElementById("infoNewBuyer").innerText = res.new_buyer_assumed || "None";
            document.getElementById("infoRep").innerText = res.buyer_representative || "---";
            document.getElementById("infoContact").innerText = res.contact_no || "---";
            document.getElementById("infoEmail").innerText = res.email_address || "---";
            document.getElementById("infoSocial").innerText = res.social_media || "---";
            document.getElementById("infoAccAddress").innerText = res.account_address || "---";
            document.getElementById("infoAccNo").innerText = res.account_number || "---";
            document.getElementById("infoTotalBill").innerText = res.total_bill ? `₱ ${Number(res.total_bill).toLocaleString()}` : "₱ 0.00";

            document.getElementById("infoBillStatus").innerText = res.bill_status || "Unpaid";
            document.getElementById("infoBillStatus").style.color = res.bill_status === "Paid" ? "#4ade80" : "#fb7185";

            document.getElementById("infoRemarks").innerText = res.remarks || "No additional remarks.";
            document.getElementById("infoCreated").innerText = res.created_at || "-";

            const statusEl = document.getElementById("infoStatus");
            const status = (res.resident_status || "Active");
            statusEl.innerText = status;
            statusEl.style.backgroundColor = status === 'Active' ? '#065f46' : '#991b1b';
            
            const editBtn = document.getElementById("infoEditBtn");
            if (editBtn) {
                editBtn.onclick = function() {
                    if(typeof window.closeMarkerModal === "function") window.closeMarkerModal();
                    window.editResident(residentIndex); 
                };
            }

            const connovateBtn = document.getElementById("infoConnovateBtn");
            if (connovateBtn) {
                connovateBtn.onclick = function() {
                    if (typeof window.openConnovateFromInfo === "function") {
                        window.openConnovateFromInfo();
                    }
                };
            }

            const overlay = document.getElementById("modalOverlay");
            if(overlay) overlay.classList.add("show");

        } else {
            if(addForm) addForm.reset();
            if (typeof window.closeMarkerModal === "function") window.closeMarkerModal();
            const addProj = document.getElementById("addProject");
            if(addProj) addProj.value = projectID;
            document.getElementById("addBlock").value = block;
            document.getElementById("addLot").value = lot;
            window.openResidentForm();

        }
    };

    window.openConnovateFromInfo = function() {
        if (
            window.currentInfoResident &&
            typeof window.openConnovateModal === "function"
        ) {
            window.openConnovateModal(
                window.currentInfoResident,
                window.currentInfoResidentContext || {}
            );
        }
    };

    window.openConnovateFromAddForm = function() {
        openConnovateFromForm({
            projectId: "addProject",
            blockId: "addBlock",
            lotId: "addLot",
            nameId: "addName",
            statusId: "addStatus",
            phaseId: "addPhase"
        });
    };

    window.openConnovateFromEditForm = function() {
        openConnovateFromForm({
            residentId: "editResidentId",
            projectId: "editProject",
            blockId: "editBlock",
            lotId: "editLot",
            nameId: "editName",
            statusId: "editStatus",
            phaseId: "editPhase"
        });
    };

    window.removeTctFile = function() {
        document.getElementById("editDeleteTctFile").value = "1";
        document.getElementById("editCurrentTctFile").value = "";

        document.getElementById("editTctFileInfo").style.display = "none";
        document.getElementById("editTctFileEmpty").style.display = "block";
        document.getElementById("editTctFileEmpty").textContent = "File will be removed after saving changes.";

        document.getElementById("editTctFile").value = "";
    };



    window.removeAddTctFile = function() {
        document.getElementById("addTctFile").value = "";
        document.getElementById("addCurrentTctFile").value = "";

        document.getElementById("addTctFileInfo").style.display = "none";
        document.getElementById("addTctFileEmpty").style.display = "block";
        document.getElementById("addTctFileEmpty").textContent = "No TCT file uploaded";
    };

    document.getElementById("addTctFile")?.addEventListener("change", function() {
        const file = this.files[0];

        if (file) {
            document.getElementById("addTctFileName").textContent = file.name;
            document.getElementById("addTctFileInfo").style.display = "flex";
            document.getElementById("addTctFileEmpty").style.display = "none";
        } else {
            removeAddTctFile();
        }
    });




    // ==========================================
    // Final Listeners & Initialization
    // ==========================================
    
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            closeAddModal();
            closeEditModal();
            closeDeleteModal();
        }
    });

    function deleteResident(index) {
        showSystemLoader("Removing Resident Record...");
        setTimeout(() => {
            window.residents.splice(index, 1);
            renderResidentsTable();
            hideSystemLoader();
        }, 800); 
    }

    if (searchInput) {
        searchInput.addEventListener("input", e => {
            currentPage = 1;
            renderResidentsTable(e.target.value);
        });
    }

    renderResidentsTable();
});