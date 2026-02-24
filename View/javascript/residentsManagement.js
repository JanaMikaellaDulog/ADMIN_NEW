document.addEventListener("DOMContentLoaded", () => {

  // Ensure global residents exists
  if (!window.residents) {
    console.error("window.residents is not defined. Make sure residentsData.js loads first.");
    return;
  }

  // =========================
  // Render Residents Table
  // =========================
  function renderResidentsTable(filter = "") {
    const tbody = document.getElementById("residentsTableBody");
    if (!tbody) return;

    const searchTerm = filter.toLowerCase();

    const filteredResidents = window.residents
      .map((res, index) => ({ ...res, originalIndex: index }))
      .filter(res =>
        res.project.toLowerCase().includes(searchTerm) ||
        res.block.toLowerCase().includes(searchTerm) ||
        res.lot.toLowerCase().includes(searchTerm) ||
        res.status.toLowerCase().includes(searchTerm) ||
        res.residents.some(name =>
          name.toLowerCase().includes(searchTerm)
        )
      );

    tbody.innerHTML = "";

    filteredResidents.forEach(res => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${res.residents.join(", ")}</td>
        <td>${res.project}</td>
        <td>${res.block}</td>
        <td>${res.lot}</td>
        <td>
          <span class="status-tag ${res.status.toLowerCase()}">
            ${res.status}
          </span>
        </td>
        <td>₱ ${res.electricity.toLocaleString()}</td>
        <td>₱ ${res.water.toLocaleString()}</td>
        <td>
          <button class="edit-btn" onclick="editResident(${res.originalIndex})">Edit</button>
          <button class="delete-btn" onclick="deleteResident(${res.originalIndex})">Delete</button>
        </td>
      `;

      tbody.appendChild(tr);
    });
  }

  window.renderResidentsTable = renderResidentsTable;

  // =========================
  // Search
  // =========================
  const searchInput = document.getElementById("residentSearch");
  if (searchInput) {
    searchInput.addEventListener("input", e =>
      renderResidentsTable(e.target.value)
    );
  }

  // =========================
  // Modal Helpers
  // =========================
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add("show");
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("show");
  }

  function setupModalCloseOnOverlay(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modalId);
    });
  }

  // =========================
  // Add Resident
  // =========================
  const addForm = document.getElementById("addResidentForm");
  if (addForm) {
    addForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const newResident = {
        residents: [document.getElementById("addName").value],
        project: document.getElementById("addProject").value,
        block: document.getElementById("addBlock").value,
        lot: document.getElementById("addLot").value,
        status: document.getElementById("addStatus").value,
        electricity: 0,
        water: 0
      };

      window.residents.push(newResident);

      renderResidentsTable();
      this.reset();
      closeModal("addResidentModal");
    });
  }

  window.openResidentForm = () => openModal("addResidentModal");
  window.closeAddModal = () => closeModal("addResidentModal");
  setupModalCloseOnOverlay("addResidentModal");

  // =========================
  // Edit Resident
  // =========================
  window.editResident = function (index) {
    const resident = window.residents[index];

    document.getElementById("editIndex").value = index;
    document.getElementById("editName").value = resident.residents.join(", ");
    document.getElementById("editProject").value = resident.project;
    document.getElementById("editBlock").value = resident.block;
    document.getElementById("editLot").value = resident.lot;
    document.getElementById("editStatus").value = resident.status;

    openModal("editResidentModal");
  };

  const editForm = document.getElementById("editResidentForm");
  if (editForm) {
    editForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const index = document.getElementById("editIndex").value;

      window.residents[index] = {
        ...window.residents[index],
        residents: document
          .getElementById("editName")
          .value.split(",")
          .map(name => name.trim()),
        project: document.getElementById("editProject").value,
        block: document.getElementById("editBlock").value,
        lot: document.getElementById("editLot").value,
        status: document.getElementById("editStatus").value
      };

      renderResidentsTable();
      closeModal("editResidentModal");
    });
  }

  window.closeEditModal = () => closeModal("editResidentModal");
  setupModalCloseOnOverlay("editResidentModal");

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
      renderResidentsTable();
      closeModal("deleteResidentModal");
      deleteIndex = null;
    }
  };

  window.closeDeleteModal = () => closeModal("deleteResidentModal");
  setupModalCloseOnOverlay("deleteResidentModal");

  // =========================
  // Initial Render
  // =========================
  renderResidentsTable();

});