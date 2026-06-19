(function () {
    let connovateModal;
    let connovatePanelModal;
    let connovateSvgObject;
    let connovateHotspotOverlay;
    let connovateFloorSelect;
    let connovatePanelForm;
    let connovatePanelTarget;
    let connovateControlNumber;
    let connovateQuantity;
    let connovateRemovePanelBtn;
    let connovatePanelRecordInfo;
    let currentResident = null;
    let currentContext = {};
    let selectedPanelElement = null;
    let selectedLot = null;
    let panelEntries = {};
    let floorStatuses = {};
    let activeRequestId = 0;

    const CONNOVATE_ENDPOINTS = {
        load: "../PHP/get_connovate_panels.php",
        save: "../PHP/save_connovent_panel.php",
        remove: "../PHP/delete_connovate_panel.php"
    };

    const FLOOR_SOURCES = {
        "GROUND FLOOR": "../assets/svg/GroundFloor.svg",
        "SECOND FLOOR": "../assets/svg/SecondFloor.svg"
    };

    const CONNOVATE_BASE_COORDINATES = {
        width: 850,
        height: 680
    };

    const CONNOVATE_RENDER_COORDINATES = {
        width: 1191,
        height: 842
    };

    const CONNOVATE_HOTSPOTS = {
        "GROUND FLOOR": [
            { id: "gf-top-beam", x: 163, y: 95, width: 156, height: 10 },
            { id: "gf-left-top-green", x: 98, y: 160, width: 22, height: 65 },
            { id: "gf-left-red-1", x: 98, y: 220, width: 22, height: 72 },
            { id: "gf-left-red-2", x: 98, y: 286, width: 22, height: 72 },
            { id: "gf-left-red-3", x: 98, y: 352, width: 22, height: 72 },
            { id: "gf-left-red-4", x: 98, y: 418, width: 22, height: 72 },
            { id: "gf-left-red-5", x: 98, y: 484, width: 22, height: 72 },
            { id: "gf-left-red-6", x: 98, y: 550, width: 22, height: 36 },
            { id: "gf-left-bottom-green", x: 98, y: 576, width: 22, height: 70 },
            { id: "gf-center-left-red", x: 276, y: 48, width: 22, height: 170 },
            { id: "gf-center-purple", x: 390, y: 50, width: 24, height: 98 },
            { id: "gf-center-green", x: 390, y: 140, width: 24, height: 70 },
            { id: "gf-center-blue-1", x: 390, y: 198, width: 24, height: 72 },
            { id: "gf-center-blue-2", x: 390, y: 264, width: 24, height: 72 },
            { id: "gf-center-blue-3", x: 390, y: 330, width: 24, height: 72 },
            { id: "gf-center-blue-4", x: 390, y: 396, width: 24, height: 72 },
            { id: "gf-center-blue-5", x: 390, y: 462, width: 24, height: 72 },
            { id: "gf-center-blue-6", x: 390, y: 528, width: 24, height: 58 },
            { id: "gf-center-bottom-green", x: 390, y: 576, width: 24, height: 70 },
            { id: "gf-center-right-red", x: 500, y: 48, width: 22, height: 170 },
            { id: "gf-mid-beam-left", x: 100, y: 208, width: 300, height: 24 },
            { id: "gf-mid-beam-right", x: 404, y: 208, width: 347, height: 24 },
            { id: "gf-right-top-green", x: 733, y: 160, width: 22, height: 65 },
            { id: "gf-right-red-1", x: 733, y: 220, width: 22, height: 72 },
            { id: "gf-right-red-2", x: 733, y: 286, width: 22, height: 72 },
            { id: "gf-right-red-3", x: 733, y: 352, width: 22, height: 72 },
            { id: "gf-right-red-4", x: 733, y: 418, width: 22, height: 72 },
            { id: "gf-right-red-5", x: 733, y: 484, width: 22, height: 72 },
            { id: "gf-right-red-6", x: 733, y: 550, width: 22, height: 36 },
            { id: "gf-right-bottom-green", x: 733, y: 576, width: 22, height: 70 },
            { id: "gf-bottom-beam-left", x: 100, y: 570, width: 300, height: 24 },
            { id: "gf-bottom-beam-right", x: 404, y: 570, width: 347, height: 24 }
        ]
    };

    function textOrFallback(value, fallback = "---") {
        const normalized = value === null || value === undefined ? "" : String(value).trim();
        return normalized || fallback;
    }

    function formatCompletedAt(value) {
        const normalized = String(value || "").trim();
        if (!normalized) return "";

        const isoCandidate = normalized.replace(" ", "T");
        const date = new Date(isoCandidate);
        if (Number.isNaN(date.getTime())) return normalized;

        return date.toLocaleString();
    }

    function updateText(id, value, fallback) {
        const element = document.getElementById(id);
        if (element) element.textContent = textOrFallback(value, fallback);
    }

    function syncStatus(status) {
        const badge = document.getElementById("connovateStatus");
        if (!badge) return;

        const normalized = textOrFallback(status, "Unknown");
        badge.textContent = normalized;
        badge.className = "status-tag";
        badge.classList.add(normalized.toLowerCase().replace(/\s+/g, "-"));
    }

    function getFloorKey() {
        return String(connovateFloorSelect?.value || "GROUND FLOOR").trim().toUpperCase();
    }

    function buildEntryKey(project, block, lot, floor, panelId) {
        return [project, block, lot, floor, panelId].join("|");
    }

    function rebuildStatuses() {
        floorStatuses = {};
        Object.values(panelEntries).forEach((entry) => {
            const floor = String(entry.floor || "").trim().toUpperCase();
            if (!floor || !entry.panelId) return;
            floorStatuses[floor] = floorStatuses[floor] || {};
            floorStatuses[floor][entry.panelId] = true;
        });
    }

    function updateCounters() {
        const doneEl = document.getElementById("connovateDoneCount");
        const remainingEl = document.getElementById("connovateRemainingCount");
        const finishedEl = document.getElementById("connovateFinishedCount");
        const floor = getFloorKey();
        const required = (CONNOVATE_HOTSPOTS[floor] || []).length;
        const done = Object.values(panelEntries).filter((entry) => entry.floor === floor).length;
        const remaining = Math.max(required - done, 0);
        const finished = required > 0 && remaining === 0 ? "YES" : "NO";

        if (doneEl) doneEl.textContent = String(done);
        if (remainingEl) remainingEl.textContent = String(remaining);
        if (finishedEl) finishedEl.textContent = String(finished);
    }

    function updateLotContext() {
        const lotContext = document.getElementById("connovateLotContext");
        if (!lotContext) return;

        if (!selectedLot) {
            lotContext.textContent = "No lot selected";
            return;
        }

        lotContext.textContent = `${selectedLot.project} | Block ${selectedLot.block} Lot ${selectedLot.lot}`;
    }

    function getSelectedPanelId(element = selectedPanelElement) {
        return element?.dataset?.hotspotId || "";
    }

    function getSavedEntry(panelId = getSelectedPanelId()) {
        if (!selectedLot || !panelId) return null;
        const key = buildEntryKey(selectedLot.project, selectedLot.block, selectedLot.lot, getFloorKey(), panelId);
        return panelEntries[key] || null;
    }

    function updatePanelRecordInfo(entry = null) {
        if (!connovatePanelRecordInfo) return;
        if (!entry) {
            connovatePanelRecordInfo.textContent = "Not yet saved";
            return;
        }

        const completedBy = textOrFallback(entry.completedBy, "Unknown");
        const completedAt = formatCompletedAt(entry.completedAt);
        connovatePanelRecordInfo.textContent = completedAt
            ? `Saved by ${completedBy} on ${completedAt}`
            : `Saved by ${completedBy}`;
    }

    function getSelectedPanelIdentity() {
        const panelId = getSelectedPanelId();
        if (!selectedLot || !panelId) return null;

        const floor = getFloorKey();
        const key = buildEntryKey(selectedLot.project, selectedLot.block, selectedLot.lot, floor, panelId);
        return { panelId, floor, key };
    }

    function clearSelectedPanel() {
        if (!selectedPanelElement) return;
        selectedPanelElement.classList.remove("connovate-part-selected");
        selectedPanelElement.style.stroke = "none";
        selectedPanelElement.style.strokeWidth = "0";
        selectedPanelElement = null;
    }

    function openPanelModal() {
        if (!connovatePanelModal || !selectedPanelElement || !selectedLot) return;

        const panelId = getSelectedPanelId();
        const savedEntry = getSavedEntry(panelId);
        if (connovatePanelTarget) {
            connovatePanelTarget.textContent = `${selectedLot.project} | Block ${selectedLot.block} Lot ${selectedLot.lot} | ${getFloorKey()} | ${panelId}`;
        }
        if (connovateControlNumber) connovateControlNumber.value = savedEntry?.controlNumber || "";
        if (connovateQuantity) connovateQuantity.value = savedEntry?.quantity || "";
        if (connovateRemovePanelBtn) connovateRemovePanelBtn.disabled = !savedEntry;
        updatePanelRecordInfo(savedEntry);

        connovatePanelModal.classList.add("show");
    }

    function setSelectedPanel(nextElement) {
        if (selectedPanelElement === nextElement) {
            openPanelModal();
            return;
        }

        clearSelectedPanel();
        selectedPanelElement = nextElement || null;

        if (selectedPanelElement) {
            selectedPanelElement.classList.add("connovate-part-selected");
            selectedPanelElement.style.stroke = "#f59e0b";
            selectedPanelElement.style.strokeWidth = "2";
            openPanelModal();
        }
    }

    function applyHotspotStatus(element, isDone) {
        element.style.fill = isDone ? "#16a34a" : "#ffffff";
        element.style.fillOpacity = isDone ? "0.35" : "0.001";
    }

    function scaleHotspotRect(hotspot) {
        const scaleX = CONNOVATE_RENDER_COORDINATES.width / CONNOVATE_BASE_COORDINATES.width;
        const scaleY = CONNOVATE_RENDER_COORDINATES.height / CONNOVATE_BASE_COORDINATES.height;

        return {
            x: hotspot.x * scaleX,
            y: hotspot.y * scaleY,
            width: hotspot.width * scaleX,
            height: hotspot.height * scaleY
        };
    }

    function renderHotspots() {
        if (!connovateHotspotOverlay) return;
        const floor = getFloorKey();
        const hotspots = CONNOVATE_HOTSPOTS[floor] || [];
        const savedStatuses = floorStatuses[floor] || {};

        connovateHotspotOverlay.innerHTML = "";
        clearSelectedPanel();

        hotspots.forEach((hotspot) => {
            const scaledRect = scaleHotspotRect(hotspot);
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("x", String(scaledRect.x));
            rect.setAttribute("y", String(scaledRect.y));
            rect.setAttribute("width", String(scaledRect.width));
            rect.setAttribute("height", String(scaledRect.height));
            rect.setAttribute("rx", "2");
            rect.setAttribute("ry", "2");
            rect.dataset.hotspotId = hotspot.id;
            rect.style.cursor = "pointer";
            rect.style.pointerEvents = "all";
            rect.style.stroke = "#f59e0b";  //temp border color change back to "none" afterwards
            rect.style.strokeWidth = "2"; //temp stroke, change back to "0"
            applyHotspotStatus(rect, Boolean(savedStatuses[hotspot.id]));

            rect.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                setSelectedPanel(rect);
            });

            connovateHotspotOverlay.appendChild(rect);
        });

        updateCounters();
    }

    async function loadPanelEntries() {
        if (!selectedLot) {
            panelEntries = {};
            rebuildStatuses();
            renderHotspots();
            return;
        }

        const params = new URLSearchParams({
            project: selectedLot.project,
            block: selectedLot.block,
            lot: selectedLot.lot
        });

        const requestId = ++activeRequestId;

        try {
            const response = await fetch(`${CONNOVATE_ENDPOINTS.load}?${params.toString()}`, {
                headers: { Accept: "application/json" }
            });
            const data = await response.json();

            if (requestId !== activeRequestId) return;
            if (!response.ok || !data.success) throw new Error(data.message || "Unable to load Connovate panels.");

            const nextEntries = {};
            (data.panels || []).forEach((entry) => {
                const floor = String(entry.floor || "").trim().toUpperCase();
                const panelId = String(entry.panelId || "").trim();
                if (!floor || !panelId) return;
                const key = buildEntryKey(selectedLot.project, selectedLot.block, selectedLot.lot, floor, panelId);
                nextEntries[key] = {
                    floor,
                    panelId,
                    controlNumber: entry.controlNumber || "",
                    quantity: Number(entry.quantity || 0),
                    completedById: entry.completedById ?? null,
                    completedBy: entry.completedBy || "",
                    completedAt: entry.completedAt || ""
                };
            });

            panelEntries = nextEntries;
            rebuildStatuses();
            renderHotspots();
        } catch (error) {
            console.warn("Unable to load Connovate panels.", error);
        }
    }

    async function removeSelectedPanelEntry() {
        const panelIdentity = getSelectedPanelIdentity();
        if (!panelIdentity || !panelEntries[panelIdentity.key]) {
            window.alert("This panel does not have saved data yet.");
            return;
        }

        try {
            const response = await fetch(CONNOVATE_ENDPOINTS.remove, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    project: selectedLot.project,
                    block: selectedLot.block,
                    lot: selectedLot.lot,
                    floor: panelIdentity.floor,
                    panelId: panelIdentity.panelId
                })
            });

            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.message || "Unable to remove panel.");

            delete panelEntries[panelIdentity.key];
            rebuildStatuses();
            renderHotspots();
            updatePanelRecordInfo(null);
            window.closeConnovatePanelModal();
        } catch (error) {
            console.warn("Unable to remove Connovate panel.", error);
            window.alert(error.message || "Unable to remove panel.");
        }
    }

    function setFloor(floor) {
        if (!connovateFloorSelect || !connovateSvgObject) return;
        connovateFloorSelect.value = floor;
        connovateSvgObject.setAttribute("data", FLOOR_SOURCES[floor] || FLOOR_SOURCES["GROUND FLOOR"]);
        renderHotspots();
    }

    document.addEventListener("DOMContentLoaded", () => {
        connovateModal = document.getElementById("connovateModal");
        connovatePanelModal = document.getElementById("connovatePanelModal");
        connovateSvgObject = document.getElementById("connovateSvgObject");
        connovateHotspotOverlay = document.getElementById("connovateHotspotOverlay");
        connovateFloorSelect = document.getElementById("connovateFloorSelect");
        connovatePanelForm = document.getElementById("connovatePanelForm");
        connovatePanelTarget = document.getElementById("connovatePanelTarget");
        connovateControlNumber = document.getElementById("connovateControlNumber");
        connovateQuantity = document.getElementById("connovateQuantity");
        connovateRemovePanelBtn = document.getElementById("connovateRemovePanelBtn");
        connovatePanelRecordInfo = document.getElementById("connovatePanelRecordInfo");

        if (connovateModal) {
            connovateModal.addEventListener("click", (event) => {
                if (event.target === connovateModal) {
                    window.closeConnovateModal();
                }
            });
        }

        if (connovatePanelModal) {
            connovatePanelModal.addEventListener("click", (event) => {
                if (event.target === connovatePanelModal) {
                    window.closeConnovatePanelModal();
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

        if (connovateFloorSelect) {
            connovateFloorSelect.addEventListener("change", () => {
                setFloor(getFloorKey());
            });
        }

        if (connovateRemovePanelBtn) {
            connovateRemovePanelBtn.addEventListener("click", async () => {
                await removeSelectedPanelEntry();
            });
        }

        if (connovatePanelForm) {
            connovatePanelForm.addEventListener("submit", async (event) => {
                event.preventDefault();

                const panelIdentity = getSelectedPanelIdentity();
                const controlNumber = String(connovateControlNumber?.value || "").trim();
                const quantity = Number(connovateQuantity?.value || 0);
                if (!panelIdentity || !controlNumber || !Number.isFinite(quantity) || quantity <= 0) return;

                try {
                    const response = await fetch(CONNOVATE_ENDPOINTS.save, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json"
                        },
                        body: JSON.stringify({
                            project: selectedLot.project,
                            block: selectedLot.block,
                            lot: selectedLot.lot,
                            floor: panelIdentity.floor,
                            panelId: panelIdentity.panelId,
                            controlNumber,
                            quantity
                        })
                    });

                    const data = await response.json();
                    if (!response.ok || !data.success) throw new Error(data.message || "Unable to save panel.");

                    panelEntries[panelIdentity.key] = {
                        floor: panelIdentity.floor,
                        panelId: panelIdentity.panelId,
                        controlNumber,
                        quantity,
                        completedById: data.completedById ?? null,
                        completedBy: data.completedBy || "",
                        completedAt: data.completedAt || ""
                    };
                    rebuildStatuses();
                    renderHotspots();
                    updatePanelRecordInfo(panelEntries[panelIdentity.key]);
                    window.closeConnovatePanelModal();
                } catch (error) {
                    console.warn("Unable to save Connovate panel.", error);
                    window.alert(error.message || "Unable to save panel.");
                }
            });
        }
    });

    window.openConnovateModal = function (resident = {}, context = {}) {
        if (!connovateModal) connovateModal = document.getElementById("connovateModal");
        if (!connovateModal) return;

        currentResident = resident;
        currentContext = context || {};
        selectedLot = {
            project: textOrFallback(currentContext.project || resident.project, "N/A"),
            block: textOrFallback(currentContext.block || resident.block_no, ""),
            lot: textOrFallback(currentContext.lot || resident.lot_no, "")
        };

        const propertyText = `Resident ID: ${textOrFallback(resident.resident_id)} | ${selectedLot.project} | Phase ${textOrFallback(resident.phase, "1")} | Blk ${selectedLot.block} Lot ${selectedLot.lot}`;

        updateText("connovateResidentName", resident.buyer_name, "N/A");
        updateText("connovateResidentMeta", propertyText, "Resident ID: ---");
        syncStatus(resident.resident_status);
        updateLotContext();
        setFloor("GROUND FLOOR");
        loadPanelEntries();

        if (typeof window.closeMarkerModal === "function") {
            window.closeMarkerModal();
        }

        connovateModal.classList.add("show");
    };

    window.closeConnovateModal = function () {
        if (!connovateModal) connovateModal = document.getElementById("connovateModal");
        if (!connovateModal) return;

        clearSelectedPanel();
        window.closeConnovatePanelModal();
        connovateModal.classList.remove("show");
    };

    window.closeConnovatePanelModal = function () {
        if (!connovatePanelModal) connovatePanelModal = document.getElementById("connovatePanelModal");
        if (connovatePanelModal) connovatePanelModal.classList.remove("show");
    };
})();

