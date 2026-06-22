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

    //edited to contain "part" for connovate part/panel mapping
    const CONNOVATE_HOTSPOTS = {
        "GROUND FLOOR": [
            { id: "gf-top-beam", part: "TDX-002A", x: 163, y: 95, width: 156, height: 10 },
            { id: "gf-left-top-green", part: "TIR-207A", x: 76, y: 156, width: 8, height: 38 },
            { id: "gf-left-red-1", part: "TDX-204A", x: 76, y: 195, width: 8, height: 100 },
            { id: "gf-left-red-2", part: "TDX-203A", x: 76, y: 298, width: 8, height: 98 },
            { id: "gf-left-bottom-green", part: "TIR-207A", x: 76, y: 399, width: 8, height: 38 },
            { id: "gf-center-left-red", part: "TDX-004A", x: 176, y: 107, width: 8, height: 83 },
            { id: "gf-center-purple", part: "TDX-001A", x: 238, y: 107, width: 8, height: 83 },
            { id: "gf-center-green", part: "TIR-214A", x: 238, y: 157, width: 8, height: 33 },
            { id: "gf-center-blue-1", part: "TDX-206A", x: 238, y: 195, width: 8, height: 100 },
            { id: "gf-center-blue-2", part: "TDX-205A", x: 238, y: 298, width: 8, height: 98 },
            { id: "gf-center-bottom-green", part: "TIR-207A", x: 238, y: 399, width: 8, height: 38 },
            { id: "gf-center-right-red", part: "TDX-003A", x: 299, y: 107, width: 8, height: 83 },
            { id: "gf-mid-beam-left", part: "TDX-219A", x: 78, y: 190, width: 160, height: 10 },
            { id: "gf-mid-beam-right", part: "TDX-220A", x: 245, y: 190, width: 160, height: 10 },
            { id: "gf-right-top-green", part: "TIR-207A", x: 399, y: 156, width: 8, height: 38 },
            { id: "gf-right-red-1", part: "TDX-216A", x: 399, y: 195, width: 8, height: 100 },
            { id: "gf-right-red-2", part: "TDX-215A", x: 399, y: 298, width: 8, height: 98 },
            { id: "gf-right-bottom-green", part: "TIR-207A", x: 400, y: 399, width: 8, height: 38 },
            { id: "gf-bottom-beam-left", part: "TDX-201A", x: 78, y: 394, width: 160, height: 10 },
            { id: "gf-bottom-beam-right", part: "TDX-201A", x: 245, y: 394, width: 160, height: 10 }
        ],
        "SECOND FLOOR": [
            { id: "sf-left-top-green", part: "TIR-214A", x: 76, y: 156, width: 8, height: 38 },
            { id: "sf-left-red-1", part: "TDX-211A", x: 76, y: 195, width: 8, height: 100 },
            { id: "sf-left-red-2", part: "TDX-210A", x: 76, y: 298, width: 8, height: 98 },
            { id: "sf-left-bottom-green", part: "TIR-214A", x: 76, y: 399, width: 8, height: 38 },
            { id: "sf-center-green", part: "TIR-214A", x: 238, y: 157, width: 8, height: 33 },
            { id: "sf-center-blue-1", part: "TDX-213A", x: 238, y: 195, width: 8, height: 100 },
            { id: "sf-center-blue-2", part: "TDX-212A", x: 238, y: 298, width: 8, height: 98 },
            { id: "sf-center-bottom-green", part: "TIR-214A", x: 238, y: 399, width: 8, height: 38 },
            { id: "sf-mid-beam-left", part: "TIR-209A", x: 78, y: 190, width: 160, height: 10 },
            { id: "sf-mid-beam-right", part: "TIR-209A", x: 245, y: 190, width: 160, height: 10 },
            { id: "sf-right-top-green", part: "TIR-214A", x: 399, y: 156, width: 8, height: 38 },
            { id: "sf-right-red-1", part: "TDX-218A", x: 399, y: 195, width: 8, height: 100 },
            { id: "sf-right-red-2", part: "TDX-217A", x: 399, y: 298, width: 8, height: 98 },
            { id: "sf-right-bottom-green", part: "TIR-214A", x: 400, y: 399, width: 8, height: 38 },
            { id: "sf-bottom-beam-left", part: "TIR-208A", x: 78, y: 394, width: 160, height: 10 },
            { id: "sf-bottom-beam-right", part: "TIR-208A", x: 245, y: 394, width: 160, height: 10 }
        ]
    };

    // Expose required panel counts per floor so connovateManagement.js can
    // compute "remaining"/"finished" for every house without duplicating
    // the hotspot layout.
    //
    // NOTE: this is intentionally hardcoded to 19, not derived from the
    // hotspot arrays above (which currently have 20 entries each). 19 is
    // the real max panel slots per floor; counting against the raw
    // hotspot array length let stale/renamed rows in the DB inflate
    // "done" past the actual number of fillable slots.
    const REQUIRED_PANELS_BY_FLOOR = {
    "GROUND FLOOR": 19,
    "SECOND FLOOR": 15
    };

    window.CONNOVATE_FLOOR_REQUIRED = { ...REQUIRED_PANELS_BY_FLOOR };

    function getRequiredForFloor(floorKey) {  //Edited for different panel num per floor
        return REQUIRED_PANELS_BY_FLOOR[floorKey] ?? 0;
    }

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
        const required = getRequiredForFloor(floor);

        // Only count entries whose panelId matches a hotspot that actually
        // exists on this floor right now. Rows saved under an old/renamed
        // hotspot id are otherwise still counted as "done" forever, which
        // let Done exceed the real number of slots (e.g. 22 done on a
        // floor that only has 19-20 fillable spots).
        const validIdsByFloor = {};
        Object.keys(CONNOVATE_HOTSPOTS).forEach((floorKey) => {
            validIdsByFloor[floorKey] = new Set(CONNOVATE_HOTSPOTS[floorKey].map(h => h.id));
        });

        function countValidDone(floorKey) {
            const validIds = validIdsByFloor[floorKey] || new Set();
            return Object.values(panelEntries)
                .filter(entry => entry.floor === floorKey && validIds.has(entry.panelId))
                .reduce((sum, entry) => sum + (Number(entry.quantity) || 0), 0);
        }

        const rawDoneForFloor = countValidDone(floor);
        const doneForFloor = Math.min(rawDoneForFloor, required);
        const remainingForFloor = Math.max(required - rawDoneForFloor, 0);

        if (doneEl) doneEl.textContent = String(doneForFloor);
        if (remainingEl) remainingEl.textContent = String(remainingForFloor);

        // "Finished" = Yes/No for the WHOLE HOUSE (both floors), not just the
        // floor currently being viewed. It only flips to Yes once produced
        // quantity meets or exceeds the required total on BOTH Ground Floor
        // AND Second Floor (capped per floor so over-entry on one floor
        // can't make the house look "more finished" than it is).
        const totalRequired = Object.keys(CONNOVATE_HOTSPOTS) //Edited for different panel num per floor
            .reduce((sum, floorKey) => sum + getRequiredForFloor(floorKey), 0);
        const totalDone = Object.keys(CONNOVATE_HOTSPOTS)
            .reduce((sum, floorKey) => sum + Math.min(countValidDone(floorKey), getRequiredForFloor(floorKey)), 0);
        const isHouseFinished = totalRequired > 0 && totalDone >= totalRequired;
 
        if (finishedEl) finishedEl.textContent = isHouseFinished ? "Yes" : "No";
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
            rect.style.stroke = "nonw";  //temp border color change back to "none" afterwards "#f59e0b"
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

            if (typeof window.removeConnovatePanelCache === "function") {
                window.removeConnovatePanelCache({
                    project_name: selectedLot.project,
                    block_no: selectedLot.block,
                    lot_no: selectedLot.lot,
                    floor_name: panelIdentity.floor,
                    panel_key: panelIdentity.panelId
                });
            }
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
            
            //connovate hotspot for .part
            const floor = getFloorKey();
            const hotspot = CONNOVATE_HOTSPOTS[floor]?.find(h => h.id === panelIdentity.panelId);
            const connovatePart = hotspot?.part || controlNumber;

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
                        quantity,
                        connovatePart: connovatePart
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

                    // Keep the Connovate Management board + Parts List in
                    // sync immediately, without needing a full page reload.
                    if (typeof window.upsertConnovatePanelCache === "function") {
                    window.upsertConnovatePanelCache({
                        project_name: selectedLot.project,
                        block_no: selectedLot.block,
                        lot_no: selectedLot.lot,
                        floor_name: panelIdentity.floor,
                        panel_key: panelIdentity.panelId,
                        connovate_part: connovatePart.toUpperCase(),
                        control_number: controlNumber,
                        quantity,
                        status: "finished",
                        completed_at: data.completedAt || ""
                    });
                }
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