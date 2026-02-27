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
  // BRIDGE: SEARCH FUNCTION (Bulletproof Matching)
  // ==========================================================
  window.getResidentByLotBlock = function (lotNumber, blockNumber, projectKey) {
    // Check both potential data locations
    const source = window.residents || window.residentsData;
    if (!source) {
      console.warn("Resident data source not found.");
      return null;
    }

    return source.find(res => {
      // Convert all values to lowercase strings and trim spaces to prevent mismatch
      const resProject = String(res.project || "").trim().toLowerCase();
      const resLot = String(res.lot || "").trim().toLowerCase();
      const resBlock = String(res.block || "").trim().toLowerCase();

      const searchProject = String(projectKey || "").trim().toLowerCase();
      const searchLot = String(lotNumber || "").trim().toLowerCase();
      const searchBlock = String(blockNumber || "").trim().toLowerCase();

      return resProject === searchProject && 
             resLot === searchLot && 
             resBlock === searchBlock;
    });
  };

  // ============================
  // CLOSE LOGIC
  // ============================
  const closeModal = () => {
    modalOverlay.classList.remove("show");
    modalContent.innerHTML = ""; 
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // ============================
  // OPEN MODAL LOGIC
  // ============================
  window.openLotModal = function (projectKey, block, lotNumber) {
    // Keep values as strings to handle alphanumeric values like "1b"
    const bNum = String(block).trim(); 
    const lNum = String(lotNumber).trim();

    // Use the global helper to find the resident
    const lotData = window.getResidentByLotBlock(lNum, bNum, projectKey);

    if (modalTitle) {
      modalTitle.innerText = `Block ${bNum} - Lot ${lNum}`;
    }

    let contentHTML = `
      <div class="detail-group"><b>Project:</b> ${projectKey}</div>
      <div class="detail-group"><b>Address:</b> Block ${bNum} | Lot ${lNum}</div>
    `;

    if (!lotData) {
      contentHTML += `
        <div class="detail-group"><b>Client:</b> —</div>
        <div class="detail-group">
          <b>Status:</b> 
          <span class="status-tag vacant">Vacant / No Record</span>
        </div>
      `;
    } else {
      // If lotData.name exists use it, otherwise check for lotData.residents array
      const clientName = lotData.name || (Array.isArray(lotData.residents) ? lotData.residents.join(", ") : "Unknown");
      const totalElectric = Number(lotData.electricity) || 0;
      const totalWater = Number(lotData.water) || 0;
      const status = (lotData.status || "inactive").toLowerCase();

      contentHTML += `
        <div class="detail-group"><b>Client(s):</b> ${clientName}</div>
        <div class="detail-group">
          <b>Status:</b> 
          <span class="status-tag ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </div>
        <div class="detail-group"><b>Electricity Bill:</b> ₱ ${totalElectric.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
        <div class="detail-group"><b>Water Bill:</b> ₱ ${totalWater.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
      `;
    }

    modalContent.innerHTML = contentHTML;
    modalOverlay.classList.add("show");
  };
})();