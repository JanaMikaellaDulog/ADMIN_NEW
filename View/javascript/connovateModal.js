(function () {
    let connovateModal;
    let currentResident = null;
    let currentContext = {};

    function textOrFallback(value, fallback = "---") {
        const normalized = value === null || value === undefined ? "" : String(value).trim();
        return normalized || fallback;
    }

    function updateText(id, value, fallback) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = textOrFallback(value, fallback);
        }
    }

    function syncStatus(status) {
        const badge = document.getElementById("connovateStatus");
        if (!badge) return;

        const normalized = textOrFallback(status, "Unknown");
        const className = normalized.toLowerCase().replace(/\s+/g, "-");

        badge.textContent = normalized;
        badge.className = "status-tag";
        badge.classList.add(className);
    }

    document.addEventListener("DOMContentLoaded", () => {
        connovateModal = document.getElementById("connovateModal");

        if (connovateModal) {
            connovateModal.addEventListener("click", (event) => {
                if (event.target === connovateModal) {
                    window.closeConnovateModal();
                }
            });
        }

        const manageBtn = document.getElementById("connovateManageBtn");
        if (manageBtn) {
            manageBtn.addEventListener("click", () => {
                if (currentResident && typeof window.jumpToManagement === "function") {
                    window.closeConnovateModal();
                    window.jumpToManagement(currentResident);
                }
            });
        }
    });

    window.openConnovateModal = function (resident = {}, context = {}) {
        if (!connovateModal) {
            connovateModal = document.getElementById("connovateModal");
        }
        if (!connovateModal) return;

        currentResident = resident;
        currentContext = context || {};

        const projectName = textOrFallback(currentContext.project || resident.project, "N/A");
        const propertyText = `Resident ID: ${textOrFallback(resident.resident_id)} | ${projectName} | Phase ${textOrFallback(resident.phase, "1")} | Blk ${textOrFallback(currentContext.block || resident.block_no)} Lot ${textOrFallback(currentContext.lot || resident.lot_no)}`;

        updateText("connovateResidentName", resident.buyer_name, "N/A");
        updateText("connovateResidentMeta", propertyText, "Resident ID: ---");
        syncStatus(resident.resident_status);

        if (typeof window.closeMarkerModal === "function") {
            window.closeMarkerModal();
        }

        connovateModal.classList.add("show");
    };

    window.closeConnovateModal = function () {
        if (!connovateModal) {
            connovateModal = document.getElementById("connovateModal");
        }
        if (connovateModal) {
            connovateModal.classList.remove("show");
        }
    };
})();
