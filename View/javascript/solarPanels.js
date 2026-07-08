(function () {
    let solarModal;
    let currentResident = null;
    let currentContext = null;
    let currentProofFile = "";
    let solarChart = null;
    let lastInstalledRows = [];
    const REQUIRED_SOLAR_PARTS = 6;
    const OPTIONAL_SOLAR_PART = "Net Metering";

    const ENDPOINTS = {
        load: "get_solar_panels.php",
        save: "save_solar_panel.php",
        upload: "upload_solar_proof.php",
        deleteProof: "delete_solar_proof.php",
        deleteSolarParts: "delete_solar_panel_parts.php"
    };

function renderSolarAnalytics(rows = []) {
    rows = Array.isArray(rows) ? rows : [];

    const total = rows.length;

    const completed = rows.filter(row => row.installed_count === REQUIRED_SOLAR_PARTS).length;
    const inProgress = rows.filter(row => row.installed_count > 0 && row.installed_count < REQUIRED_SOLAR_PARTS).length;
    const noInstallation = rows.filter(row => row.installed_count === 0).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    document.getElementById("solarBoardInstalled").textContent = completed;
    document.getElementById("solarBoardInProgress").textContent = inProgress;
    document.getElementById("solarBoardNotInstalled").textContent = noInstallation;
    document.getElementById("solarCompletionRate").textContent = completionRate + "%";
    document.getElementById("solarBoardRemaining").textContent = noInstallation;
    document.getElementById("solarBoardMeta").textContent = `${completed} of ${total} houses fully installed`;

    const canvas = document.getElementById("solarStatusChart");
    if (!canvas || typeof Chart === "undefined") return;

    if (solarChart) solarChart.destroy();

    solarChart = new Chart(canvas.getContext("2d"), {
        type: "bar",
        data: {
            labels: ["Fully Installed", "In Progress", "No Installation"],
            datasets: [{
                label: "Solar Progress",
                data: [completed, inProgress, noInstallation],
                backgroundColor: ["#16a34a", "#f57c1f", "#ef4444"],
                borderColor: ["#15803d", "#e06a10", "#dc2626"],
                borderWidth: 1,
                borderRadius: 10,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function findProjectNameById(projectId) {
    const select = document.getElementById("locationSelect");
    const option = select
        ? [...select.options].find(opt => String(opt.value) === String(projectId))
        : null;

    return option?.dataset?.name || "";
}

// Normalizes a project/block/lot combo into one lookup key.
function makeLotKey(project, block, lot) {
    return [
        String(project || "").trim().toLowerCase(),
        String(block || "").trim().toLowerCase(),
        String(lot || "").trim().toLowerCase()
    ].join("|");
}

// Builds {project|block|lot -> resident} and {project|block|lot -> solarRecord}
// ONE time per render, so we never re-scan the full residents/solarPanels
// arrays inside a loop. This is what was freezing/crashing the tab when a
// project with a lot of lots was selected.
function buildSolarLookups() {
    const residents = Array.isArray(window.solarHouses)
        ? window.solarHouses
        : [];

    const solarPanels = Array.isArray(window.solarPanels) ? window.solarPanels : [];

    const residentMap = new Map();

    residents.forEach(resident => {
        const projectName = resident.project || "";
        const k = makeLotKey(projectName, resident.block_no, resident.lot_no);

        if (!residentMap.has(k)) residentMap.set(k, resident);
    });

    const solarPartsMap = new Map();

    solarPanels.forEach(part => {
        const k = makeLotKey(part.project_name, part.block_no, part.lot_no);

        if (!solarPartsMap.has(k)) {
            solarPartsMap.set(k, []);
        }

        solarPartsMap.get(k).push(part);
    });

    return { residentMap, solarPartsMap, residents };
}

function summarizeSolarParts(parts = []) {
    const requiredInstalledCount = parts.filter(part =>
        String(part.part_name || "") !== OPTIONAL_SOLAR_PART &&
        String(part.solar_status || "").toLowerCase() === "installed"
    ).length;

    const optionalInstalled = parts.some(part =>
        String(part.part_name || "") === OPTIONAL_SOLAR_PART &&
        String(part.solar_status || "").toLowerCase() === "installed"
    );

    const displayedInstalledCount = requiredInstalledCount + (optionalInstalled ? 1 : 0);

    const latestUpdatedRaw = parts
        .map(part => part.updated_at || part.created_at || "")
        .filter(Boolean)
        .sort()
        .pop() || "";

    const latestUpdated = latestUpdatedRaw
        ? latestUpdatedRaw.split(" ")[0]
        : "-";

    const solarType = parts.find(part => part.solar_type)?.solar_type || "Grid-Tied";

    let progressStatus = "No Installation";

    if (requiredInstalledCount === REQUIRED_SOLAR_PARTS) {
        progressStatus = optionalInstalled
            ? "Completed (+Net Metering)"
            : "Completed";
    } else if (requiredInstalledCount > 0 || optionalInstalled) {
        progressStatus = "In Progress";
    }

    return {
        installed_count: requiredInstalledCount,
        optional_installed: optionalInstalled,
        displayed_installed_count: displayedInstalledCount,
        total_parts: REQUIRED_SOLAR_PARTS,
        progress_text: `${displayedInstalledCount}/${REQUIRED_SOLAR_PARTS}`,
        progress_percent: Math.min(
            100,
            Math.round((requiredInstalledCount / REQUIRED_SOLAR_PARTS) * 100)
        ),
        progress_status: progressStatus,
        last_updated: latestUpdated
    };
}

function getProgressClass(row) {
    if (row.installed_count === REQUIRED_SOLAR_PARTS) return "solar-progress-complete";
    if (row.installed_count > 0) return "solar-progress-progress";
    return "solar-progress-none";
}


function solarFieldsFor(solar) {
    return {
        solar_status: solar ? (solar.solar_status || "Not Installed") : "Not Installed",
        provider: solar ? (solar.provider || "-") : "-",
        installation_date: solar ? (solar.installation_date || "-") : "-",
        proof_file: solar ? (solar.proof_file || "") : ""
    };
}

function findMarkersKey(projectName) {
    const target = String(projectName || "").trim().toLowerCase();
    const keys = Object.keys(window.PROJECT_MARKERS || {});
    return keys.find(k => k.trim().toLowerCase() === target);
}

function buildSolarDashboardRows(selectedProject = "") {
    const { residentMap, solarPartsMap } = buildSolarLookups();
    const allMarkers = window.PROJECT_MARKERS || {};

    let projectKeys;
    if (selectedProject) {
        const key = findMarkersKey(selectedProject);
        projectKeys = key ? [key] : [];
    } else {
        projectKeys = Object.keys(allMarkers);
    }

    const rows = [];

    projectKeys.forEach(projectKey => {
        const markers = allMarkers[projectKey] || [];

        markers.forEach(markerData => {
            const block = String(markerData.block).trim();
            const lot = String(markerData.lot).trim();
            const k = makeLotKey(projectKey, block, lot);

            const resident = residentMap.get(k);
            const parts = solarPartsMap.get(k) || [];
            const summary = summarizeSolarParts(parts);

            rows.push({
                resident_id: resident ? resident.resident_id : "-",
                buyer_name: resident ? resident.buyer_name : "Vacant",
                project_name: projectKey,
                block_no: block,
                lot_no: lot,
                resident_status: resident ? resident.resident_status : "Vacant",
                resident: resident || null,
                ...summary
            });
        });
    });

    return rows;
}

// Stats/board use every house (installed + not installed) so totals and
// completion % stay accurate. The Solar Installation Records table only
// needs to show houses that actually have solar installed.
function activeSolarRows(rows) {
    return rows.filter(row => row.installed_count > 0);
}

// Filters the cached installed-only rows by whatever's typed in the
// Search box (resident id, project, block, lot, or provider).
function filterSolarRows(rows) {
    const searchInput = document.getElementById("solarRecordsSearch");
    const term = String(searchInput?.value || "").trim().toLowerCase();
    if (!term) return rows;

    return rows.filter(row =>
        String(row.resident_id || "").toLowerCase().includes(term) ||
        String(row.buyer_name || "").toLowerCase().includes(term) ||
        String(row.project_name || "").toLowerCase().includes(term) ||
        String(row.block_no || "").toLowerCase().includes(term) ||
        String(row.lot_no || "").toLowerCase().includes(term) ||
        String(row.solar_type || "").toLowerCase().includes(term) ||
        String(row.progress_text || "").toLowerCase().includes(term) ||
        String(row.progress_status || "").toLowerCase().includes(term)
    );
}

// Caches the latest installed rows, then renders whatever matches the
// current search term. Call this instead of renderSolarTable(installedOnly(rows))
// anywhere the table needs a refresh, so search stays in sync with new data.
function refreshSolarTable(installedRows) {
    lastInstalledRows = installedRows;
    renderSolarTable(filterSolarRows(lastInstalledRows));
}

function populateSolarProjects() {
    const select = document.getElementById("solarProjectSelect");
    if (!select) return;

    const projectMarkers = window.PROJECT_MARKERS || {};
    const projects = Object.keys(projectMarkers).sort();

    const previousValue = select.value; // remember current selection

    select.innerHTML = '<option value="">-- All Projects --</option>';

    projects.forEach(project => {
        const option = document.createElement("option");
        option.value = project;
        option.textContent = project;
        select.appendChild(option);
    });

    // restore it if it still exists in the rebuilt list
    if (previousValue && projects.includes(previousValue)) {
        select.value = previousValue;
    }
}

function renderSolarTab() {
    if (!Array.isArray(window.solarPanels)) {
        window.solarPanels = [];
    }

    populateSolarProjects(); // rebuild first (now preserves selection)

    const projectSelect = document.getElementById("solarProjectSelect");
    const selectedProject = projectSelect ? projectSelect.value : ""; // read AFTER rebuild
    const rows = buildSolarDashboardRows(selectedProject);

    updateSolarStats(rows);
    refreshSolarTable(activeSolarRows(rows));
    renderSolarAnalytics(rows);
}

    function updateSolarStats(rows) {
        const total = rows.length;

        const fullyInstalled = rows.filter(row =>
            row.installed_count === REQUIRED_SOLAR_PARTS
        ).length;

        const inProgress = rows.filter(row =>
            row.installed_count > 0 && row.installed_count < REQUIRED_SOLAR_PARTS
        ).length;

        document.getElementById("solarInstalledCount").textContent = fullyInstalled;
        document.getElementById("solarNotInstalledCount").textContent = inProgress;
        document.getElementById("solarTotalCount").textContent = total;
    }

    function renderSolarTable(rows) {
        const tbody = document.getElementById("solarTableBody");
        if (!tbody) return;

        if (!rows.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align:center; padding:40px; color:#6b6b6b;">
                        No solar installation progress found for this selection.
                    </td>
                </tr>
            `;
            return;
        }

        const html = rows.map(row => {
            const progressClass = getProgressClass(row);

            return `
                <tr>
                    <td>${row.resident_id || "-"}</td>
                    <td>${row.project_name || "-"}</td>
                    <td>${row.block_no || "-"}</td>
                    <td>${row.lot_no || "-"}</td>
                    <td>${row.solar_type || "Grid-Tied"}</td>
                    <td>
                        <div class="solar-table-progress">
                            <div class="solar-progress-line">
                                <span class="${progressClass}" style="width:${row.progress_percent}%"></span>
                            </div>
                            <div class="solar-progress-label-row">
                                <strong>${row.progress_text}</strong>
                                <small>${row.progress_status}</small>
                            </div>
                        </div>
                    </td>
                    <td>${row.last_updated || "-"}</td>
                    <td>
                        <div class="solar-table-actions">
                            <button type="button"
                                    class="solar-table-edit-btn"
                                    title="Edit"
                                    onclick='window.openSolarModalFromDashboard(${JSON.stringify(row).replace(/'/g, "&apos;")})'>
                                ✎
                            </button>

                            <button type="button"
                                    class="solar-table-delete-btn"
                                    title="Delete"
                                    onclick='window.deleteSolarInstallationRecord(${JSON.stringify(row).replace(/'/g, "&apos;")})'>
                                🗑
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        tbody.innerHTML = html;
    }

    function text(value, fallback = "---") {
        const val = String(value ?? "").trim();
        return val || fallback;
    }

    function setValue(id, value) {
        const el = document.getElementById(id);
        if (el) el.value = value ?? "";
    }

    function setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value ?? "";
    }

    function updateProofLink(filePath) {
        const info = document.getElementById("solarProofInfo");
        const link = document.getElementById("solarProofLink");

        currentProofFile = filePath || "";

        if (!filePath) {
            if (info) info.textContent = "No proof uploaded";
            if (link) {
                link.style.display = "none";
                link.href = "#";
            }
            return;
        }

        if (info) info.textContent = filePath.split("/").pop();
        if (link) {
            link.style.display = "inline-block";
            link.href = "../../" + filePath;
        }

        updateSolarFileBox(filePath);
    }


    function updateSolarFileBox(filePath = "") {
        const fileName = document.getElementById("solarProofFileName");
        const removeBtn = document.getElementById("solarProofRemoveBtn");

        if (!fileName || !removeBtn) return;

        if (filePath) {
            fileName.textContent = filePath.split("/").pop();
            removeBtn.style.display = "inline-flex";
        } else {
            fileName.textContent = "Choose File";
            removeBtn.style.display = "none";
        }
    }

    window.removeSolarProofFile = function () {
        const fileInput = document.getElementById("solarProofFile");

        if (fileInput) fileInput.value = "";

        const fileToDelete = currentProofFile || "";

        window.solarProofCleared = true;
        window.clearedProofFile = fileToDelete;

        currentProofFile = "";

        updateSolarFileBox("");

        const info = document.getElementById("solarProofInfo");
        const link = document.getElementById("solarProofLink");

        if (info) info.textContent = "No proof uploaded";
        if (link) {
            link.style.display = "none";
            link.href = "#";
        }
    };



    async function loadSolarInfo() {
        if (!currentContext) return;

        const params = new URLSearchParams({
            project: currentContext.project,
            block: currentContext.block,
            lot: currentContext.lot
        });

        try {
            const response = await fetch(`${ENDPOINTS.load}?${params.toString()}`, {
                headers: { Accept: "application/json" }
            });

            const data = await response.json();

            if (!data.success) {
                alert(data.message || "Unable to load solar parts.");
                return;
            }

            window.currentSolarParts = data.parts || [];
            renderSolarPartsList(window.currentSolarParts);

        } catch (error) {
            console.warn("Unable to load solar parts.", error);
        }
    }

    
    function renderSolarPartsList(parts = []) {
        const list = document.getElementById("solarPartsList");
        const countEl = document.getElementById("solarInstalledPartsCount");
        const totalEl = document.getElementById("solarPartsTotal");

        if (!list) return;

        const requiredInstalled = parts.filter(part =>
            String(part.part_name || "").trim() !== OPTIONAL_SOLAR_PART &&
            String(part.solar_status || "").toLowerCase() === "installed"
        ).length;

        const optionalInstalled = parts.some(part =>
            String(part.part_name || "").trim() === OPTIONAL_SOLAR_PART &&
            String(part.solar_status || "").toLowerCase() === "installed"
        );

        const displayedInstalled = requiredInstalled + (optionalInstalled ? 1 : 0);

        if (countEl) countEl.textContent = displayedInstalled;
        if (totalEl) totalEl.textContent = optionalInstalled ? "/ 6" : "/ 6";

        list.innerHTML = parts.map((part, index) => {
            const installed = String(part.solar_status || "").toLowerCase() === "installed";
            const isOptional = String(part.part_name || "").trim() === OPTIONAL_SOLAR_PART;

            return `
                <div class="solar-part-row">
                    <div class="solar-part-icon">${index + 1}</div>

                    <div>
                        <div class="solar-part-name">
                            ${part.part_name}
                            ${isOptional ? '<small class="solar-optional-label">Optional</small>' : ''}
                        </div>
                        <div class="solar-part-desc">${part.description || ""}</div>
                    </div>

                    <span class="solar-part-status ${installed ? "installed" : ""}">
                        ${part.solar_status || "Not Installed"}
                    </span>

                    <button type="button"
                            class="solar-part-edit-btn"
                            data-index="${index}">
                        ✎
                    </button>
                </div>
            `;
        }).join("");

        list.querySelectorAll(".solar-part-edit-btn").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.dataset.index;
                window.openSolarPartEdit(parts[index]);
            });
        });
    }

    window.openSolarPartEdit = function (part) {
        const modal = document.getElementById("solarPartEditModal");
        if (!modal) return;

        window.currentSolarPart = part;

        setValue("solarPartName", part.part_name || "");
        setText("solarPartTitle", part.part_name || "Solar Part");
        setText("solarPartDescription", part.description || "");

        setValue("solarStatus", part.solar_status || "Not Installed");
        setValue("solarInstallationDate", part.installation_date || "");
        setValue("solarProvider", part.provider || "");
        setValue("solarCapacity", part.capacity_details || "");
        setValue("solarRemarks", part.remarks || "");

        window.solarProofCleared = false;
        window.clearedProofFile = "";

        const proofInput = document.getElementById("solarProofFile");
        if (proofInput) proofInput.value = "";

        updateProofLink(part.proof_file || "");
        updateSolarFileBox(part.proof_file || "");

        modal.classList.add("show");
    };

    window.closeSolarPartEditModal = function () {
        const modal = document.getElementById("solarPartEditModal");
        if (modal) modal.classList.remove("show");
    };


    async function uploadProofIfNeeded() {
        const fileInput = document.getElementById("solarProofFile");

        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            return currentProofFile;
        }

        const formData = new FormData();
        formData.append("proof_file", fileInput.files[0]);

        const response = await fetch(ENDPOINTS.upload, {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to upload proof file.");
        }

        return data.file || "";
    }

    async function saveSolarInfo(event) {
        event.preventDefault();

        try {
            const uploadedFile = await uploadProofIfNeeded();

            if (window.solarProofCleared && window.clearedProofFile) {
                const deleteResponse = await fetch(ENDPOINTS.deleteProof, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ file: window.clearedProofFile })
                });

                const deleteText = await deleteResponse.text();

                try {
                    const deleteData = JSON.parse(deleteText);

                    if (!deleteData.success) {
                        throw new Error(deleteData.message || "Unable to delete proof file.");
                    }
                } catch (e) {
                    console.error("Delete proof response:", deleteText);
                    throw new Error("Invalid response from delete_solar_proof.php");
                }
            }


            const formData = new FormData();
            formData.append("resident_id", document.getElementById("solarResidentId")?.value || "");
            formData.append("project_name", document.getElementById("solarProjectName")?.value || "");
            formData.append("block_no", document.getElementById("solarBlockNo")?.value || "");
            formData.append("lot_no", document.getElementById("solarLotNo")?.value || "");
            formData.append("part_name", document.getElementById("solarPartName")?.value || "");
            formData.append("solar_type", document.getElementById("solarType")?.value || "Grid-Tied");
            formData.append("solar_status", document.getElementById("solarStatus")?.value || "Not Installed");
            formData.append("installation_date", document.getElementById("solarInstallationDate")?.value || "");
            formData.append("provider", document.getElementById("solarProvider")?.value || "");
            formData.append("capacity_details", document.getElementById("solarCapacity")?.value || "");
            formData.append(
                "proof_file",
                window.solarProofCleared ? "" : (uploadedFile || "")
            );
            formData.append("remarks", document.getElementById("solarRemarks")?.value || "");

            const response = await fetch(ENDPOINTS.save, {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Unable to save solar information.");
            }

            alert("Solar part saved.");

            const finalProofFile = window.solarProofCleared ? "" : uploadedFile;

            updateProofLink(finalProofFile);

            window.solarProofCleared = false;
            window.clearedProofFile = "";
            window.closeSolarPartEditModal();
            loadSolarInfo();
            setText("solarStatusBadge", document.getElementById("solarStatus")?.value || "Not Installed");

            // Keep window.solarPanels in sync so re-rendering the table/board
            // after closing the modal reflects the change immediately,
            // without needing a full page reload.
            if (!Array.isArray(window.solarPanels)) window.solarPanels = [];
            const idx = window.solarPanels.findIndex(p =>
                makeLotKey(p.project_name, p.block_no, p.lot_no) ===
                makeLotKey(
                    document.getElementById("solarProjectName")?.value,
                    document.getElementById("solarBlockNo")?.value,
                    document.getElementById("solarLotNo")?.value
                ) &&
                String(p.part_name || "") === String(document.getElementById("solarPartName")?.value || "")
            );
            const updatedRecord = {
                project_name: document.getElementById("solarProjectName")?.value || "",
                block_no: document.getElementById("solarBlockNo")?.value || "",
                lot_no: document.getElementById("solarLotNo")?.value || "",

                solar_type: document.getElementById("solarType")?.value || "Grid-Tied",
                part_name: document.getElementById("solarPartName")?.value || "",

                solar_status: document.getElementById("solarStatus")?.value || "Not Installed",
                installation_date: document.getElementById("solarInstallationDate")?.value || "",
                provider: document.getElementById("solarProvider")?.value || "",
                capacity_details: document.getElementById("solarCapacity")?.value || "",
                proof_file: window.solarProofCleared ? "" : (uploadedFile || ""),
                remarks: document.getElementById("solarRemarks")?.value || "",

                updated_at: new Date().toISOString().slice(0, 19).replace("T", " ")
            };
            if (idx >= 0) {
                window.solarPanels[idx] = { ...window.solarPanels[idx], ...updatedRecord };
            } else {
                window.solarPanels.push(updatedRecord);
            }

            // Refresh whichever view is currently active
            const projectSelect = document.getElementById("solarProjectSelect");
            const selectedProject = projectSelect ? projectSelect.value : "";
            const rows = buildSolarDashboardRows(selectedProject);
            updateSolarStats(rows);
            refreshSolarTable(activeSolarRows(rows));
            renderSolarAnalytics(rows);
        } catch (error) {
            alert(error.message || "Unable to save solar information.");
            console.warn(error);
        }
        
    }

    document.addEventListener("DOMContentLoaded", () => {
        solarModal = document.getElementById("solarEditModal")
        renderSolarTab();

        const recordsSearchInput = document.getElementById("solarRecordsSearch");
        if (recordsSearchInput) {
            recordsSearchInput.addEventListener("input", () => {
                renderSolarTable(filterSolarRows(lastInstalledRows));
            });
        }

        const form = document.getElementById("solarPartForm");
        if (form) form.addEventListener("submit", saveSolarInfo);
        if (solarModal) {
            solarModal.addEventListener("click", (event) => {
                if (event.target === solarModal) {
                    window.closeSolarModal();
                }
            });
        }

        const proofInput = document.getElementById("solarProofFile");

        if (proofInput) {
            proofInput.addEventListener("change", function () {
                if (this.files && this.files.length > 0) {
                    window.solarProofCleared = false;
                    window.clearedProofFile = "";
                    updateSolarFileBox(this.files[0].name);
                }
            });
        }


    });

    window.openSolarModal = function (resident = {}, context = {}) {
        if (!solarModal) solarModal = document.getElementById("solarEditModal")
        if (!solarModal) return;

        currentResident = resident;
        currentContext = {
            project: text(context.project || resident.project || resident.subdivision_id),
            block: text(context.block || resident.block_no, ""),
            lot: text(context.lot || resident.lot_no, "")
        };

        setValue("solarResidentId", resident.resident_id || "");
        setValue("solarProjectName", currentContext.project);
        setValue("solarBlockNo", currentContext.block);
        setValue("solarLotNo", currentContext.lot);

        setText("solarResidentName", text(resident.buyer_name, "N/A"));
        setText(
            "solarResidentMeta",
            `Resident ID: ${text(resident.resident_id)} | ${currentContext.project} | Block ${currentContext.block} Lot ${currentContext.lot}`
        );
        setText("solarLotContext", `${currentContext.project} | Block ${currentContext.block} Lot ${currentContext.lot}`);

        if (typeof window.closeMarkerModal === "function") {
            window.closeMarkerModal();
        }

        window.solarProofCleared = false;
        window.clearedProofFile = "";

        const proofInput = document.getElementById("solarProofFile");
        if (proofInput) proofInput.value = "";

        updateSolarFileBox("");

        solarModal.classList.add("show");
        loadSolarInfo();
    };

    window.closeSolarModal = function () {
        if (!solarModal) solarModal = document.getElementById("solarEditModal")
        if (!solarModal) return;
        solarModal.classList.remove("show");
    };

    window.openSolarFromInfo = function () {
        if (window.currentInfoResident && typeof window.openSolarModal === "function") {
            window.openSolarModal(
                window.currentInfoResident,
                window.currentInfoResidentContext || {}
            );
        }
    };

    window.openSolarFromAddForm = function () {
        const projectSelect = document.getElementById("addProject");
        const option = projectSelect?.options[projectSelect.selectedIndex];

        const resident = {
            resident_id: "",
            buyer_name: document.getElementById("addName")?.value || "New Resident",
            project: option?.text || "",
            subdivision_id: projectSelect?.value || "",
            block_no: document.getElementById("addBlock")?.value || "",
            lot_no: document.getElementById("addLot")?.value || "",
            phase: document.getElementById("addPhase")?.value || "",
            resident_status: document.getElementById("addStatus")?.value || "Active"
        };

        window.openSolarModal(resident, {
            project: resident.project,
            block: resident.block_no,
            lot: resident.lot_no
        });
    };

    window.openSolarFromEditForm = function () {
        const projectSelect = document.getElementById("editProject");
        const option = projectSelect?.options[projectSelect.selectedIndex];

        const resident = {
            resident_id: document.getElementById("editResidentId")?.value || "",
            buyer_name: document.getElementById("editName")?.value || "Resident",
            project: option?.text || "",
            subdivision_id: projectSelect?.value || "",
            block_no: document.getElementById("editBlock")?.value || "",
            lot_no: document.getElementById("editLot")?.value || "",
            phase: document.getElementById("editPhase")?.value || "",
            resident_status: document.getElementById("editStatus")?.value || "Active"
        };

        window.openSolarModal(resident, {
            project: resident.project,
            block: resident.block_no,
            lot: resident.lot_no
        });
    };

    window.openSolarModalFromDashboard = function (row) {
        const resident = row.resident || {
            resident_id: row.resident_id,
            buyer_name: row.buyer_name,
            project: row.project_name,
            block_no: row.block_no,
            lot_no: row.lot_no
        };

        const context = {
            project: row.project_name,
            block: row.block_no,
            lot: row.lot_no
        };

        window.openSolarModal(resident, context);
    };

    window.deleteSolarInstallationRecord = async function (row) {
        const confirmDelete = confirm(
            `Delete all solar installation records for Block ${row.block_no} Lot ${row.lot_no}?`
        );

        if (!confirmDelete) return;

        try {
            const response = await fetch(ENDPOINTS.deleteSolarParts, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    project_name: row.project_name,
                    block_no: row.block_no,
                    lot_no: row.lot_no
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Unable to delete solar records.");
            }

            if (Array.isArray(window.solarPanels)) {
                window.solarPanels = window.solarPanels.filter(part =>
                    !(
                        makeLotKey(part.project_name, part.block_no, part.lot_no) ===
                        makeLotKey(row.project_name, row.block_no, row.lot_no)
                    )
                );
            }

            const projectSelect = document.getElementById("solarProjectSelect");
            const selectedProject = projectSelect ? projectSelect.value : "";
            const rows = buildSolarDashboardRows(selectedProject);

            updateSolarStats(rows);
            refreshSolarTable(activeSolarRows(rows));
            renderSolarAnalytics(rows);

            alert("Solar installation records deleted.");
        } catch (error) {
            alert(error.message || "Unable to delete solar records.");
            console.warn(error);
        }
    };


    window.loadSolarProject = function () {
        const projectSelect = document.getElementById("solarProjectSelect");
        const selectedProject = projectSelect ? projectSelect.value : "";

        const rows = buildSolarDashboardRows(selectedProject);

        updateSolarStats(rows);
        refreshSolarTable(activeSolarRows(rows));
        renderSolarAnalytics(rows);
    };

    window.clearSolarForm = function () {
        window.solarProofCleared = true;
        window.clearedProofFile = currentProofFile;

        setValue("solarStatus", "Not Installed");
        setValue("solarInstallationDate", "");
        setValue("solarProvider", "");
        setValue("solarCapacity", "");
        setValue("solarRemarks", "");

        const fileInput = document.getElementById("solarProofFile");
        if (fileInput) fileInput.value = "";

        updateProofLink("");
        setText("solarStatusBadge", "Not Installed");
    };
})();
