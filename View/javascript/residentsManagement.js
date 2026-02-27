// residentManagement.js
document.addEventListener("DOMContentLoaded", () => {
  if (!window.residents) {
    console.error("window.residents is not defined.");
    return;
  }

  // =========================
  // Render Table
  // =========================
  function renderResidentsTable(filter = "") {
    const tbody = document.getElementById("residentsTableBody");
    if (!tbody) return;

    const searchTerm = filter.toLowerCase().trim();

    const filteredResidents = window.residents
      .map((res, index) => ({ ...res, originalIndex: index }))
      .filter(res => {
        const nameMatch = res.residents.some(n => n.toLowerCase().includes(searchTerm));
        return (
          nameMatch ||
          res.project.toLowerCase().includes(searchTerm) ||
          res.block.toString().includes(searchTerm) ||
          res.lot.toString().includes(searchTerm) ||
          res.status.toLowerCase().includes(searchTerm)
        );
      });

    tbody.innerHTML = "";

    if (filteredResidents.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">No records found.</td></tr>`;
      return;
    }

    filteredResidents.forEach(res => {
      const tr = document.createElement("tr");
      const statusClass = res.status.toLowerCase().replace(/\s+/g, '-');

      tr.innerHTML = `
        <td>${res.residents.join(", ")}</td>
        <td>${res.project}</td>
        <td>${res.block}</td>
        <td>${res.lot}</td>
        <td><span class="status-tag ${statusClass}">${res.status}</span></td>
        <td>₱ ${Number(res.electricity).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
        <td>₱ ${Number(res.water).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
        <td>
          <button class="edit-btn" onclick="editResident(${res.originalIndex})">Edit</button>
          <button class="delete-btn" onclick="deleteResident(${res.originalIndex})">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.renderResidentsTable = renderResidentsTable;

  // Search Input listener
  const searchInput = document.getElementById("residentSearch");
  if (searchInput) {
    searchInput.addEventListener("input", e => renderResidentsTable(e.target.value));
  }

  // =========================
  // Modal Helpers
  // =========================
  function openModal(id) { document.getElementById(id)?.classList.add("show"); }
  function closeModal(id) { document.getElementById(id)?.classList.remove("show"); }

  // =========================
  // Add Resident
  // =========================
  const addForm = document.getElementById("addResidentForm");
  if (addForm) {
    addForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const newResident = {
        residents: [document.getElementById("addName").value.trim()],
        project: document.getElementById("addProject").value,
        block: Number(document.getElementById("addBlock").value), // Save as Number
        lot: Number(document.getElementById("addLot").value),     // Save as Number
        status: document.getElementById("addStatus").value,
        electricity: 0,
        water: 0
      };
      window.residents.push(newResident);
      renderResidentsTable(searchInput?.value);
      this.reset();
      closeModal("addResidentModal");
    });
  }

  // =========================
  // Edit Resident
  // =========================
  window.editResident = function (index) {
    const res = window.residents[index];
    if (!res) return;
    document.getElementById("editIndex").value = index;
    document.getElementById("editName").value = res.residents.join(", ");
    document.getElementById("editProject").value = res.project;
    document.getElementById("editBlock").value = res.block;
    document.getElementById("editLot").value = res.lot;
    document.getElementById("editStatus").value = res.status;
    openModal("editResidentModal");
  };

  const editForm = document.getElementById("editResidentForm");
  if (editForm) {
    editForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const idx = document.getElementById("editIndex").value;
      window.residents[idx] = {
        ...window.residents[idx],
        residents: document.getElementById("editName").value.split(",").map(s => s.trim()),
        project: document.getElementById("editProject").value,
        block: Number(document.getElementById("editBlock").value), // Save as Number
        lot: Number(document.getElementById("editLot").value),     // Save as Number
        status: document.getElementById("editStatus").value
      };
      renderResidentsTable(searchInput?.value);
      closeModal("editResidentModal");
    });
  }

  // =========================
  // Delete Resident
  // =========================
  let deleteIndex = null;
  window.deleteResident = function (index) {
    deleteIndex = index;
    openModal("deleteResidentModal");
  };

  window.confirmDelete = function () {
    if (deleteIndex !== null) {
      window.residents.splice(deleteIndex, 1);
      renderResidentsTable(searchInput?.value);
      closeModal("deleteResidentModal");
      deleteIndex = null;
    }
  };

  // Global exports for buttons
  window.openResidentForm = () => openModal("addResidentModal");
  window.closeAddModal = () => closeModal("addResidentModal");
  window.closeEditModal = () => closeModal("editResidentModal");
  window.closeDeleteModal = () => closeModal("deleteResidentModal");

  renderResidentsTable();
});