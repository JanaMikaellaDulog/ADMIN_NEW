// residentManagement.js
document.addEventListener("DOMContentLoaded", () => {
    // Use a fallback to prevent the "not defined" error
    if (!window.residents) {
        window.residents = [];
        console.warn("window.residents was not defined, initialized as empty array.");
    }

    const searchInput = document.getElementById("residentSearch");

    // =========================
    // 1. Render Table
    // =========================
    function renderResidentsTable(filter = "") {
        const tbody = document.getElementById("residentsTableBody");
        if (!tbody) return;

        const searchTerm = filter.toLowerCase().trim();

        const filteredResidents = window.residents
            .map((res, index) => ({ ...res, originalIndex: index }))
            .filter(res => {
                const names = Array.isArray(res.residents) ? res.residents.join(" ") : String(res.name || "");
                const nameMatch = names.toLowerCase().includes(searchTerm);
                return (
                    nameMatch ||
                    String(res.project).toLowerCase().includes(searchTerm) ||
                    String(res.block).includes(searchTerm) ||
                    String(res.lot).includes(searchTerm) ||
                    String(res.status).toLowerCase().includes(searchTerm)
                );
            });

        tbody.innerHTML = "";

        if (filteredResidents.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 20px; color: #94a3b8;">No records found.</td></tr>`;
            return;
        }

        filteredResidents.forEach(res => {
            const tr = document.createElement("tr");
            const statusClass = String(res.status).toLowerCase().replace(/\s+/g, '-');
            const displayNames = Array.isArray(res.residents) ? res.residents.join(", ") : (res.name || "N/A");

            tr.innerHTML = `
                <td>${displayNames}</td>
                <td>${res.project}</td>
                <td>${res.block}</td>
                <td>${res.lot}</td>
                <td><span class="status-tag ${statusClass}">${res.status}</span></td>
                <td>₱ ${Number(res.electricity || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td>₱ ${Number(res.water || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td>
                    <button class="btn-edit" onclick="editResident(${res.originalIndex})">Edit</button>
                    <button class="btn-delete" onclick="deleteResident(${res.originalIndex})">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.renderResidentsTable = renderResidentsTable;

    if (searchInput) {
        searchInput.addEventListener("input", e => renderResidentsTable(e.target.value));
    }

    // =========================
    // 2. Modal Helpers (UPGRADED)
    // =========================
    const openModal = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add("show");
            el.style.display = "flex"; // Force display for flexbox alignment
        }
    };

    const closeModal = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove("show");
            el.style.display = "none";
        }
    };

    // =========================
    // 3. Add Resident Logic
    // =========================
    const addForm = document.getElementById("addResidentForm");
    if (addForm) {
        addForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const nameVal = document.getElementById("addName")?.value.trim();
            
            const newResident = {
                residents: [nameVal],
                name: nameVal,
                project: document.getElementById("addProject").value,
                block: Number(document.getElementById("addBlock").value),
                lot: Number(document.getElementById("addLot").value),
                status: document.getElementById("addStatus").value,
                electricity: 0,
                water: 0
            };
            
            window.residents.push(newResident);
            renderResidentsTable(searchInput?.value);
            this.reset();
            closeModal("addResidentModal"); // Specific Modal Close
        });
    }

    // =========================
    // 4. Edit Resident Logic
    // =========================
    window.editResident = function (index) {
        const res = window.residents[index];
        if (!res) return;

        const elIdx = document.getElementById("editIndex");
        const elName = document.getElementById("editName");
        const elProj = document.getElementById("editProject");
        const elBlk = document.getElementById("editBlock");
        const elLot = document.getElementById("editLot");
        const elStat = document.getElementById("editStatus");

        if (elIdx) elIdx.value = index;
        if (elName) elName.value = Array.isArray(res.residents) ? res.residents.join(", ") : (res.name || "");
        if (elProj) elProj.value = res.project;
        if (elBlk) elBlk.value = res.block;
        if (elLot) elLot.value = res.lot;
        if (elStat) elStat.value = res.status;

        openModal("editResidentModal"); // Specific Modal Open
    };

    const editForm = document.getElementById("editResidentForm");
    if (editForm) {
        editForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const idx = document.getElementById("editIndex").value;
            
            if (window.residents[idx]) {
                const nameInput = document.getElementById("editName").value;
                window.residents[idx] = {
                    ...window.residents[idx],
                    residents: nameInput.split(",").map(s => s.trim()),
                    name: nameInput.split(",")[0].trim(),
                    project: document.getElementById("editProject").value,
                    block: Number(document.getElementById("editBlock").value),
                    lot: Number(document.getElementById("editLot").value),
                    status: document.getElementById("editStatus").value
                };
                renderResidentsTable(searchInput?.value);
                closeModal("editResidentModal"); // Specific Modal Close
            }
        });
    }

    // =========================
    // 5. Delete Resident Logic
    // =========================
    let deleteIndex = null;
    window.deleteResident = function (index) {
        deleteIndex = index;
        openModal("deleteResidentModal"); // Specific Modal Open
    };

    window.confirmDelete = function () {
        if (deleteIndex !== null) {
            window.residents.splice(deleteIndex, 1);
            renderResidentsTable(searchInput?.value);
            closeModal("deleteResidentModal"); // Specific Modal Close
            deleteIndex = null;
        }
    };

    // =========================
    // Global Exports for UI Buttons
    // =========================
    window.openResidentForm = () => openModal("addResidentModal");
    window.closeAddModal = () => closeModal("addResidentModal");
    window.closeEditModal = () => closeModal("editResidentModal");
    window.closeDeleteModal = () => closeModal("deleteResidentModal");

    renderResidentsTable();
});