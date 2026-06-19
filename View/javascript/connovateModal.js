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
            { id: "gf-left-top-green", x: 76, y: 156, width: 8, height: 38 },
            { id: "gf-left-red-1", x: 76, y: 195, width: 8, height: 40 },
            { id: "gf-left-red-2", x: 76, y: 228, width: 8, height: 40 },
            { id: "gf-left-red-3", x: 76, y: 260, width: 8, height: 40 },
            { id: "gf-left-red-4", x: 76, y: 297, width: 8, height: 40 },
            { id: "gf-left-red-5", x: 76, y: 331, width: 8, height: 40 },
            { id: "gf-left-red-6", x: 76, y: 364, width: 8, height: 30 },
            { id: "gf-left-bottom-green", x: 76, y: 399, width: 8, height: 38 },
            { id: "gf-center-left-red", x: 176, y: 107, width: 8, height: 83 },
            { id: "gf-center-purple", x: 238, y: 107, width: 8, height: 83 },
            { id: "gf-center-green", x: 238, y: 157, width: 8, height: 33 },
            { id: "gf-center-blue-1", x: 238, y: 195, width: 8, height: 40 },
            { id: "gf-center-blue-2", x: 238, y: 228, width: 8, height: 40 },
            { id: "gf-center-blue-3", x: 238, y: 260, width: 8, height: 40 },
            { id: "gf-center-blue-4", x: 238, y: 297, width: 8, height: 40 },
            { id: "gf-center-blue-5", x: 238, y: 331, width: 8, height: 40 },
            { id: "gf-center-blue-6", x: 238, y: 364, width: 8, height: 30 },
            { id: "gf-center-bottom-green", x: 238, y: 399, width: 8, height: 38 },
            { id: "gf-center-right-red", x: 299, y: 107, width: 8, height: 83 },
            { id: "gf-mid-beam-left", x: 78, y: 190, width: 160, height: 10 },
            { id: "gf-mid-beam-right", x: 245, y: 190, width: 160, height: 10 },
            { id: "gf-right-top-green", x: 399, y: 156, width: 8, height: 38 },
            { id: "gf-right-red-1", x: 399, y: 195, width: 8, height: 40 },
            { id: "gf-right-red-2", x: 399, y: 228, width: 8, height: 40 },
            { id: "gf-right-red-3", x: 399, y: 260, width: 8, height: 40 },
            { id: "gf-right-red-4", x: 399, y: 297, width: 8, height: 40 },
            { id: "gf-right-red-5", x: 399, y: 331, width: 8, height: 40 },
            { id: "gf-right-red-6", x: 399, y: 364, width: 8, height: 30 },
            { id: "gf-right-bottom-green", x: 400, y: 399, width: 8, height: 38 },
            { id: "gf-bottom-beam-left", x: 78, y: 394, width: 160, height: 10 },
            { id: "gf-bottom-beam-right", x: 245, y: 394, width: 160, height: 10 }
        ],
        "SECOND FLOOR": [
            { id: "sf-top-beam", x: 163, y: 95, width: 156, height: 10 },
            { id: "sf-left-top-green", x: 76, y: 156, width: 8, height: 38 },
            { id: "sf-left-red-1", x: 76, y: 195, width: 8, height: 40 },
            { id: "sf-left-red-2", x: 76, y: 228, width: 8, height: 40 },
            { id: "sf-left-red-3", x: 76, y: 260, width: 8, height: 40 },
            { id: "sf-left-red-4", x: 76, y: 297, width: 8, height: 40 },
            { id: "sf-left-red-5", x: 76, y: 331, width: 8, height: 40 },
            { id: "sf-left-red-6", x: 76, y: 364, width: 8, height: 30 },
            { id: "sf-left-bottom-green", x: 76, y: 399, width: 8, height: 38 },
            { id: "sf-center-left-red", x: 176, y: 107, width: 8, height: 83 },
            { id: "sf-center-purple", x: 238, y: 107, width: 8, height: 83 },
            { id: "sf-center-green", x: 238, y: 157, width: 8, height: 33 },
            { id: "sf-center-blue-1", x: 238, y: 195, width: 8, height: 40 },
            { id: "sf-center-blue-2", x: 238, y: 228, width: 8, height: 40 },
            { id: "sf-center-blue-3", x: 238, y: 260, width: 8, height: 40 },
            { id: "sf-center-blue-4", x: 238, y: 297, width: 8, height: 40 },
            { id: "sf-center-blue-5", x: 238, y: 331, width: 8, height: 40 },
            { id: "sf-center-blue-6", x: 238, y: 364, width: 8, height: 30 },
            { id: "sf-center-bottom-green", x: 238, y: 399, width: 8, height: 38 },
            { id: "sf-center-right-red", x: 299, y: 107, width: 8, height: 83 },
            { id: "sf-mid-beam-left", x: 78, y: 190, width: 160, height: 10 },
            { id: "sf-mid-beam-right", x: 245, y: 190, width: 160, height: 10 },
            { id: "sf-right-top-green", x: 399, y: 156, width: 8, height: 38 },
            { id: "sf-right-red-1", x: 399, y: 195, width: 8, height: 40 },
            { id: "sf-right-red-2", x: 399, y: 228, width: 8, height: 40 },
            { id: "sf-right-red-3", x: 399, y: 260, width: 8, height: 40 },
            { id: "sf-right-red-4", x: 399, y: 297, width: 8, height: 40 },
            { id: "sf-right-red-5", x: 399, y: 331, width: 8, height: 40 },
            { id: "sf-right-red-6", x: 399, y: 364, width: 8, height: 30 },
            { id: "sf-right-bottom-green", x: 400, y: 399, width: 8, height: 38 },
            { id: "sf-bottom-beam-left", x: 78, y: 394, width: 160, height: 10 },
            { id: "sf-bottom-beam-right", x: 245, y: 394, width: 160, height: 10 }
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

        const finished = Object.values(panelEntries)
            .filter(entry => entry.floor === floor && entry.status === "finished").length;

        const remaining = Math.max(required - finished, 0);

        if (doneEl) doneEl.textContent = String(finished);
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
            rect.style.stroke = "none";  //temp border color change back to "none" afterwards "#f59e0b"
            rect.style.strokeWidth = "0"; //temp stroke, change back to "0" "2"
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
                        status: "finished",
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

