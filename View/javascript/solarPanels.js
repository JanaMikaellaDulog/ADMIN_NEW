(function () {
    let solarModal;
    let currentResident = null;
    let currentContext = null;
    let currentProofFile = "";

    const ENDPOINTS = {
        load: "../PHP/get_solar_panels.php",
        save: "../PHP/save_solar_panel.php",
        upload: "../PHP/upload_solar_proof.php"
    };



    function renderSolarTab() {
    if (!Array.isArray(window.solarPanels)) {
        window.solarPanels = [];
    }

    populateSolarProjects();
    updateSolarStats(window.solarPanels);
    renderSolarTable(window.solarPanels);

    const projectSelect = document.getElementById("solarProjectSelect");
    if (projectSelect) {
        projectSelect.addEventListener("change", () => {
            const selectedProject = projectSelect.value;
            const filtered = selectedProject
                ? window.solarPanels.filter(row => String(row.project_name || "") === selectedProject)
                : window.solarPanels;

            updateSolarStats(filtered);
            renderSolarTable(filtered);
        });
    }
}

function populateSolarProjects() {
    const select = document.getElementById("solarProjectSelect");
    if (!select) return;

    const projects = [...new Set(
        window.solarPanels
            .map(row => String(row.project_name || "").trim())
            .filter(Boolean)
    )].sort();

    select.innerHTML = '<option value="">-- All Projects --</option>';

    projects.forEach(project => {
        const option = document.createElement("option");
        option.value = project;
        option.textContent = project;
        select.appendChild(option);
    });
}

    function updateSolarStats(rows) {
        const installed = rows.filter(row => String(row.solar_status).toLowerCase() === "installed").length;
        const notInstalled = rows.filter(row => String(row.solar_status).toLowerCase() !== "installed").length;

        document.getElementById("solarInstalledCount").textContent = installed;
        document.getElementById("solarNotInstalledCount").textContent = notInstalled;
        document.getElementById("solarTotalCount").textContent = rows.length;
    }

    function renderSolarTable(rows) {
        const tbody = document.getElementById("solarTableBody");
        if (!tbody) return;

        tbody.innerHTML = "";

        if (!rows.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align:center; padding:40px; color:#94a3b8;">
                        No solar panel records found.
                    </td>
                </tr>
            `;
            return;
        }

        rows.forEach(row => {
            const proof = row.proof_file
                ? `<a href="../../${row.proof_file}" target="_blank">Open File</a>`
                : "No file";

            tbody.innerHTML += `
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
        });
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

            const formData = new FormData();
            formData.append("resident_id", document.getElementById("solarResidentId")?.value || "");
            formData.append("project_name", document.getElementById("solarProjectName")?.value || "");
            formData.append("block_no", document.getElementById("solarBlockNo")?.value || "");
            formData.append("lot_no", document.getElementById("solarLotNo")?.value || "");
            formData.append("solar_status", document.getElementById("solarStatus")?.value || "Not Installed");
            formData.append("installation_date", document.getElementById("solarInstallationDate")?.value || "");
            formData.append("provider", document.getElementById("solarProvider")?.value || "");
            formData.append("capacity_details", document.getElementById("solarCapacity")?.value || "");
            formData.append("proof_file", uploadedFile || "");
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
            updateProofLink(uploadedFile);
            setText("solarStatusBadge", document.getElementById("solarStatus")?.value || "Not Installed");
        } catch (error) {
            alert(error.message || "Unable to save solar information.");
            console.warn(error);
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        solarModal = document.getElementById("solarModal");
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
        if (!solarModal) solarModal = document.getElementById("solarModal");
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
        if (!solarModal) solarModal = document.getElementById("solarModal");
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
})();