// mapModal.js
// Handles Lot Modal Display (Safe Version)

(function () {

  const modalOverlay = document.getElementById("modalOverlay");
  const modalContent = document.getElementById("modalContent");
  const modalTitle = document.getElementById("modalTitle");
  const modalCloseBtn = document.getElementById("modalClose");

  if (!modalOverlay || !modalContent) {
    console.warn("Modal elements not found in HTML.");
    return;
  }

  // ============================
  // CLOSE LOGIC (REGISTER ONCE)
  // ============================
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", function () {
      modalOverlay.classList.remove("show");
    });
  }

  // Optional: Close when clicking outside modal box
  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove("show");
    }
  });

  // ============================
  // OPEN LOT MODAL
  // ============================
  window.openLotModal = function (projectKey, block, lotNumber) {

    block = Number(block);
    lotNumber = Number(lotNumber);

    if (!window.getResidentByLotBlock) {
      console.error("getResidentByLotBlock() not found.");
      return;
    }

    const lotData = window.getResidentByLotBlock(lotNumber, block);

    if (modalTitle) {
      modalTitle.innerText = `Block ${block} - Lot ${lotNumber}`;
    }

    let contentHTML = `
      <div class="detail-group"><b>Project:</b> ${projectKey}</div>
      <div class="detail-group"><b>Address:</b> Via Verde-Homapon 2</div>
      <div class="detail-group"><b>Property:</b> Block ${block} | Lot ${lotNumber}</div>
    `;

    // ============================
    // NO RESIDENT FOUND
    // ============================
    if (!lotData) {

      contentHTML += `
        <div class="detail-group"><b>Client:</b> —</div>
        <div class="detail-group">
          <b>Status:</b> 
          <span class="status-tag vacant">No Residents</span>
        </div>
      `;

    } else {

      const names = lotData.residents.join(", ");
      const totalElectric = Number(lotData.electricity) || 0;
      const totalWater = Number(lotData.water) || 0;
      const status = lotData.status || "inactive";

      contentHTML += `
        <div class="detail-group"><b>Client(s):</b> ${names}</div>
        <div class="detail-group">
          <b>Status:</b> 
          <span class="status-tag ${status}">
            ${status}
          </span>
        </div>
        <div class="detail-group"><b>Electricity Bill:</b> ₱ ${totalElectric.toFixed(2)}</div>
        <div class="detail-group"><b>Water Bill:</b> ₱ ${totalWater.toFixed(2)}</div>
      `;
    }

    modalContent.innerHTML = contentHTML;
    modalOverlay.classList.add("show");
  };

})();