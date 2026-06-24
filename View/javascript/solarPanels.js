(function () {
    let solarModal;
    let currentResident = null;
    let currentContext = null;
    let currentProofFile = "";
    let solarChart = null;

    const ENDPOINTS = {
        load: "get_solar_panels.php",
        save: "save_solar_panel.php",
        upload: "upload_solar_proof.php",
        deleteProof: "delete_solar_proof.php"
    };


function renderSolarAnalytics(rows = []) {
    rows = Array.isArray(rows) ? rows : [];

    const installed = rows.filter(row => String(row.solar_status || "").toLowerCase() === "installed").length;

    const projectSelect = document.getElementById("solarProjectSelect");
    const selectedProject = projectSelect ? projectSelect.value : "";

    let total = 0;

    if (selectedProject) {
        total = (window.PROJECT_MARKERS?.[selectedProject] || []).length;
    } else {
        total = Object.values(window.PROJECT_MARKERS || {})
            .reduce((sum, lots) => sum + lots.length, 0);
    }

    const notInstalled = total - installed;

    const installedEl = document.getElementById("solarBoardInstalled");
    const notInstalledEl = document.getElementById("solarBoardNotInstalled");
    const completionEl = document.getElementById("solarCompletionRate");
    const remainingEl = document.getElementById("solarBoardRemaining");
    const metaEl = document.getElementById("solarBoardMeta");



    const completionRate = total > 0
        ? Math.round((installed / total) * 100)
        : 0;

    if (installedEl) installedEl.textContent = installed;
    if (notInstalledEl) notInstalledEl.textContent = notInstalled;

    if (completionEl) {
        completionEl.textContent = completionRate + "%";
    }

    if (remainingEl) {
        remainingEl.textContent = notInstalled;
    }

    if (metaEl) {
        metaEl.textContent = `${installed} of ${total} houses installed`;
    }
    const canvas = document.getElementById("solarStatusChart");
    if (!canvas || typeof Chart === "undefined") return;

    if (solarChart) solarChart.destroy();

    const solarValueLabels = {
        id: "solarValueLabels",
        afterDatasetsDraw(chart) {
            const { ctx } = chart;
            const meta = chart.getDatasetMeta(0);

            ctx.save();
            ctx.fillStyle = "#172033";
            ctx.font = '700 13px "Century Gothic", "Segoe UI", sans-serif';
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";

            meta.data.forEach((bar, index) => {
                const value = chart.data.datasets[0].data[index];
                ctx.fillText(String(value), bar.x, bar.y - 8);
            });

            ctx.restore();
        }
    };

    solarChart = new Chart(canvas.getContext("2d"), {
        type: "bar",
        data: {
            labels: ["Installed", "Not Installed"],
            datasets: [{
                label: "Solar Status",
                data: [installed, notInstalled],
                backgroundColor: ["#16a34a", "#f57c1f"],
                borderColor: ["#15803d", "#e06a10"],
                borderWidth: 1,
                borderRadius: 10,
                borderSkipped: false,
                barPercentage: 0.58,
                categoryPercentage: 0.62
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: { top: 28, right: 12, bottom: 6, left: 6 }
            },
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: "#172033",
                        usePointStyle: true,
                        boxWidth: 8,
                        font: { family: "Century Gothic", size: 12, weight: "700" }
                    }
                },
                tooltip: {
                    backgroundColor: "rgba(255, 255, 255, 0.96)",
                    titleColor: "#172033",
                    bodyColor: "#172033",
                    borderColor: "#e5e7eb",
                    borderWidth: 1,
                    displayColors: false
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: "#172033",
                        font: { family: "Century Gothic", size: 12, weight: "700" }
                    },
                    grid: { display: false },
                    border: { display: false }
                },
                y: {
                    beginAtZero: true,
                    grace: "18%",
                    ticks: {
                        color: "#64748b",
                        precision: 0,
                        font: { family: "Century Gothic", size: 11 }
                    },
                    grid: { color: "rgba(148, 163, 184, 0.22)" },
                    border: { display: false }
                }
            }
        },
        plugins: [solarValueLabels]
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
    const residents = Array.isArray(window.residents) ? window.residents : [];
    const solarPanels = Array.isArray(window.solarPanels) ? window.solarPanels : [];

    const residentMap = new Map();
    residents.forEach(resident => {
        const projectName = resident.project || findProjectNameById(resident.subdivision_id) || "";
        const k = makeLotKey(projectName, resident.block_no, resident.lot_no);
        // Keep first match if duplicates exist
        if (!residentMap.has(k)) residentMap.set(k, resident);
    });

    const solarMap = new Map();
    solarPanels.forEach(panel => {
        const k = makeLotKey(panel.project_name, panel.block_no, panel.lot_no);
        solarMap.set(k, panel); // last one wins (most recently saved record)
    });

    return { residentMap, solarMap, residents };
}

function solarFieldsFor(solar) {
    return {
        solar_status: solar ? (solar.solar_status || "Not Installed") : "Not Installed",
        provider: solar ? (solar.provider || "-") : "-",
        installation_date: solar ? (solar.installation_date || "-") : "-",
        proof_file: solar ? (solar.proof_file || "") : ""
    };
}

function buildSolarDashboardRows(selectedProject = "") {
    const projectMarkers = window.PROJECT_MARKERS || {};
    const { residentMap, solarMap, residents } = buildSolarLookups();

    // All Projects = registered residents only (keeps this view light)
    if (!selectedProject) {
        return residents.map(resident => {
            const projectName = resident.project || findProjectNameById(resident.subdivision_id) || "-";
            const k = makeLotKey(projectName, resident.block_no, resident.lot_no);
            const solar = solarMap.get(k);

            return {
                resident_id: resident.resident_id || "-",
                project_name: projectName,
                block_no: resident.block_no || "-",
                lot_no: resident.lot_no || "-",
                ...solarFieldsFor(solar)
            };
        });
    }

    // Selected Project = include vacant pins too, but use O(1) map lookups
    // instead of .find() over the whole residents/solarPanels arrays.
    const markers = projectMarkers[selectedProject] || [];

    return markers.map(marker => {
        const block = String(marker.block || "").trim();
        const lot = String(marker.lot || "").trim();
        const k = makeLotKey(selectedProject, block, lot);

        const resident = residentMap.get(k);
        const solar = solarMap.get(k);

        return {
            resident_id: resident ? resident.resident_id : "Vacant",
            project_name: selectedProject,
            block_no: block,
            lot_no: lot,
            ...solarFieldsFor(solar)
        };
    });
}

// Stats/board use every house (installed + not installed) so totals and
// completion % stay accurate. The Solar Installation Records table only
// needs to show houses that actually have solar installed.
function installedOnly(rows) {
    return rows.filter(row => String(row.solar_status || "").toLowerCase() === "installed");
}

function renderSolarTab() {
    if (!Array.isArray(window.solarPanels)) {
        window.solarPanels = [];
    }

    const projectSelect = document.getElementById("solarProjectSelect");
    const selectedProject = projectSelect ? projectSelect.value : "";
    const rows = buildSolarDashboardRows(selectedProject);

    populateSolarProjects();
    updateSolarStats(rows);
    renderSolarTable(installedOnly(rows));
    renderSolarAnalytics(rows);



}

function populateSolarProjects() {
    const select = document.getElementById("solarProjectSelect");
    if (!select) return;

    const projectMarkers = window.PROJECT_MARKERS || {};
    const projects = Object.keys(projectMarkers).sort();

    select.innerHTML = '<option value="">-- All Projects --</option>';

    projects.forEach(project => {
        const option = document.createElement("option");
        option.value = project;
        option.textContent = project;
        select.appendChild(option);
    });
}

    function updateSolarStats(rows) {

        const projectSelect = document.getElementById("solarProjectSelect");
        const selectedProject = projectSelect ? projectSelect.value : "";

        let totalLots = 0;

        if (selectedProject) {
            totalLots = (window.PROJECT_MARKERS?.[selectedProject] || []).length;
        } else {
            totalLots = Object.values(window.PROJECT_MARKERS || {})
                .reduce((sum, lots) => sum + lots.length, 0);
        }

        const installed = rows.filter(
            row => String(row.solar_status).toLowerCase() === "installed"
        ).length;

        const notInstalled = totalLots - installed;

        document.getElementById("solarInstalledCount").textContent = installed;
        document.getElementById("solarNotInstalledCount").textContent = notInstalled;
        document.getElementById("solarTotalCount").textContent = totalLots;
    }

    function renderSolarTable(rows) {
        const tbody = document.getElementById("solarTableBody");
        if (!tbody) return;

        if (!rows.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align:center; padding:40px; color:#6b6b6b;">
                        No installed solar panels found for this selection.
                    </td>
                </tr>
            `;
            return;
        }

        // Build the whole table body as one string and write it once.
        // (Looping tbody.innerHTML += ... re-parses the accumulated HTML
        // on every iteration, which gets very slow for large row counts.)
        const html = rows.map(row => {
            const proof = row.proof_file
                ? `<a href="../../${row.proof_file}" target="_blank">Open File</a>`
                : "No file";

            return `
                <tr>
                    <td>${row.resident_id || "-"}</td>
                    <td>${row.project_name || "-"}</td>
                    <td>${row.block_no || "-"}</td>
                    <td>${row.lot_no || "-"}</td>
                    <td><span class="status-tag">${row.solar_status || "Not Installed"}</span></td>
                    <td>${row.provider || "-"}</td>
                    <td>${row.installation_date || "-"}</td>
                    <td>${proof}</td>
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
    }

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

            if (!data.success || !data.solar) {
                setValue("solarStatus", "Not Installed");
                setValue("solarInstallationDate", "");
                setValue("solarProvider", "");
                setValue("solarCapacity", "");
                setValue("solarRemarks", "");
                updateProofLink("");
                setText("solarStatusBadge", "Not Installed");
                return;
            }

            const solar = data.solar;

            setValue("solarStatus", solar.solar_status || "Not Installed");
            setValue("solarInstallationDate", solar.installation_date || "");
            setValue("solarProvider", solar.provider || "");
            setValue("solarCapacity", solar.capacity_details || "");
            setValue("solarRemarks", solar.remarks || "");
            updateProofLink(solar.proof_file || "");
            setText("solarStatusBadge", solar.solar_status || "Not Installed");
        } catch (error) {
            console.warn("Unable to load solar info.", error);
        }
    }

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
                await fetch(ENDPOINTS.deleteProof, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ file: window.clearedProofFile })
                });
            }


            const formData = new FormData();
            formData.append("resident_id", document.getElementById("solarResidentId")?.value || "");
            formData.append("project_name", document.getElementById("solarProjectName")?.value || "");
            formData.append("block_no", document.getElementById("solarBlockNo")?.value || "");
            formData.append("lot_no", document.getElementById("solarLotNo")?.value || "");
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

            alert("Solar information saved.");
            window.solarProofCleared = false;
            window.clearedProofFile = "";

            updateProofLink(uploadedFile);
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
                )
            );
            const updatedRecord = {
                project_name: document.getElementById("solarProjectName")?.value || "",
                block_no: document.getElementById("solarBlockNo")?.value || "",
                lot_no: document.getElementById("solarLotNo")?.value || "",
                solar_status: document.getElementById("solarStatus")?.value || "Not Installed",
                installation_date: document.getElementById("solarInstallationDate")?.value || "",
                provider: document.getElementById("solarProvider")?.value || "",
                capacity_details: document.getElementById("solarCapacity")?.value || "",
                proof_file: window.solarProofCleared ? "" : (uploadedFile || ""),
                remarks: document.getElementById("solarRemarks")?.value || ""
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
            renderSolarTable(installedOnly(rows));
            renderSolarAnalytics(rows);
        } catch (error) {
            alert(error.message || "Unable to save solar information.");
            console.warn(error);
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        solarModal = document.getElementById("solarEditModal")
        renderSolarTab();

        const form = document.getElementById("solarPanelForm");
        if (form) form.addEventListener("submit", saveSolarInfo);

        if (solarModal) {
            solarModal.addEventListener("click", (event) => {
                if (event.target === solarModal) {
                    window.closeSolarModal();
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



    window.loadSolarProject = function () {
        const projectSelect = document.getElementById("solarProjectSelect");
        const selectedProject = projectSelect ? projectSelect.value : "";

        const rows = buildSolarDashboardRows(selectedProject);

        updateSolarStats(rows);
        renderSolarTable(installedOnly(rows));
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
