document.addEventListener("DOMContentLoaded", () => {
    if (!Array.isArray(window.connovatePanels)) {
        window.connovatePanels = [];
    }

    const ALLOWED_CONNOVATE_PARTS = [
        "TDX-001A",
        "TDX-002A",
        "TDX-003A",
        "TDX-004A",
        "TIR-214A",
        "TDX-206A",
        "TDX-205A",
        "TDX-220A",
        "TDX-219A",
        "TDX-201A",
        "TIR-201A",
        "TIR-207A",
        "TDX-204A",
        "TDX-203A",
        "TDX-216A",
        "TDX-215A",
        "TDX-213A",
        "TDX-212A",
        "TIR-209A",
        "TIR-208A",
        "TDX-208A",
        "TDX-211A",
        "TDX-210A",
        "TDX-218A",
        "TDX-217A"
    ];
    const allowedPartSet = new Set(ALLOWED_CONNOVATE_PARTS);

    const connovateSection = document.getElementById("section-connovate");
    const toolbar = document.querySelector(".connovate-toolbar");
    const projectSelect = document.getElementById("connovateProjectSelect");
    const boardTitle = document.getElementById("connovateBoardTitle");
    const boardSubtitle = document.getElementById("connovateBoardSubtitle");
    const boardEmpty = document.getElementById("connovateChartEmpty");
    const floorChartCanvas = document.getElementById("connovateFloorChart");

    let floorChart = null;
    let currentFloorFilter = "";

    // Create and insert the floor filter in the toolbar
    const filterContainer = document.getElementById("connovateFilterContainer");
    if (filterContainer) {
        const filterDiv = document.createElement("div");
        filterDiv.className = "connovate-filter";
        filterDiv.style.cssText = "display: flex; gap: 8px; align-items: center;";
        filterDiv.innerHTML = `
            <label style="color: #6b6b6b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Floor:</label>
            <select id="connovateFloorFilter" style="padding: 8px 12px; background: #ffffff; border: 1px solid #f3c397; border-radius: 6px; color: #1a1a1a; font-size: 13px; min-width: 140px; cursor: pointer; outline: none;">
                <option value="">All Floors</option>
                <option value="GROUND FLOOR">Ground Floor</option>
                <option value="SECOND FLOOR">Second Floor</option>
            </select>
        `;
        filterContainer.appendChild(filterDiv);
    }

    function normalize(value) {
        return String(value ?? "").trim();
    }

    function toNumber(value) {
        const numeric = Number(value || 0);
        return Number.isFinite(numeric) ? numeric : 0;
    }

    function normalizePart(value) {
        return normalize(value).toUpperCase();
    }

    function normalizeFloor(value) {
        return normalize(value).toUpperCase();
    }

    function getAggregatedParts(rows, floorFilter = "") {
        const totals = new Map();

        rows.forEach((panel) => {
            const panelFloor = normalize(panel.floor_name).toUpperCase();
            const partName = normalizePart(panel.connovate_part);

            if (floorFilter && panelFloor !== floorFilter) return;
            if (!allowedPartSet.has(partName)) return;

            totals.set(partName, (totals.get(partName) || 0) + toNumber(panel.quantity));
        });

        return ALLOWED_CONNOVATE_PARTS
            .filter((partName) => totals.has(partName))
            .map((partName) => ({
                connovate_part: partName,
                quantity: totals.get(partName) || 0
            }));
    }

    function getRequiredCounts() {
        return window.CONNOVATE_FLOOR_REQUIRED || {
            "GROUND FLOOR": 20,
            "SECOND FLOOR": 20
        };
    }

    function createFloorSlot(required) {
        return { required, done: 0 };
    }

    // Build the master list of houses straight from window.PROJECT_MARKERS
    // (marker.js) — the REAL source of truth for "what houses/lots exist" in
    // each subdivision (this is the same data that draws the pins on the
    // map). window.residents is NOT used here because it only contains lots
    // that already have a buyer/resident encoded — most lots won't have one
    // yet, but they still need to be counted as a house with connovate work
    // to do.
    function buildHouseScaffold(projectFilter = "") {
        const houses = new Map();
        const selectedProject = normalize(projectFilter).toLowerCase();
        const required = getRequiredCounts();
        const allMarkers = window.PROJECT_MARKERS || {};

        Object.keys(allMarkers).forEach((projectName) => {
            const normalizedProjectName = normalize(projectName);
            if (!normalizedProjectName) return;
            if (selectedProject && normalizedProjectName.toLowerCase() !== selectedProject) return;

            (allMarkers[projectName] || []).forEach((marker) => {
                const blockNo = normalize(marker.block);
                const lotNo = normalize(marker.lot);
                if (!blockNo || !lotNo) return;

                const mapKey = [normalizedProjectName.toLowerCase(), blockNo.toLowerCase(), lotNo.toLowerCase()].join("|");
                if (houses.has(mapKey)) return;

                houses.set(mapKey, {
                    projectName: normalizedProjectName,
                    blockNo,
                    lotNo,
                    floors: {
                        "GROUND FLOOR": createFloorSlot(required["GROUND FLOOR"] || 0),
                        "SECOND FLOOR": createFloorSlot(required["SECOND FLOOR"] || 0)
                    }
                });
            });
        });

        return houses;
    }

    // Overlay the saved connovate_panels rows onto the house scaffold. Every
    // row that exists in the DB = one done panel slot (there is no "no"
    // status stored — a row simply doesn't exist until it's saved).
    function applyPanelsToHouses(houses, rows) {
        const required = getRequiredCounts();

        rows.forEach((panel) => {
            const projectName = normalize(panel.project_name);
            const blockNo = normalize(panel.block_no);
            const lotNo = normalize(panel.lot_no);
            const floorName = normalizeFloor(panel.floor_name);
            if (!projectName || !blockNo || !lotNo || !floorName) return;

            const mapKey = [projectName.toLowerCase(), blockNo.toLowerCase(), lotNo.toLowerCase()].join("|");
            let house = houses.get(mapKey);

            // Orphan record: a saved panel exists for a lot that isn't in
            // window.residents (e.g. residents row was deleted/edited later).
            // Still count it so totals stay accurate.
            if (!house) {
                house = {
                    projectName,
                    blockNo,
                    lotNo,
                    floors: {
                        "GROUND FLOOR": createFloorSlot(required["GROUND FLOOR"] || 0),
                        "SECOND FLOOR": createFloorSlot(required["SECOND FLOOR"] || 0)
                    }
                };
                houses.set(mapKey, house);
            }

            if (!house.floors[floorName]) {
                house.floors[floorName] = createFloorSlot(0);
            }

            house.floors[floorName].done += toNumber(panel.quantity);
        });

        return houses;
    }

    function getHouseSummaries(projectFilter = "") {
        const houses = buildHouseScaffold(projectFilter);
        applyPanelsToHouses(houses, getFilteredRows(projectFilter));
        return houses;
    }

    function isHouseFinished(house) {
        const g = house.floors["GROUND FLOOR"] || createFloorSlot(0);
        const s = house.floors["SECOND FLOOR"] || createFloorSlot(0);
        const totalRequired = g.required + s.required;
        const totalDone = g.done + s.done;
        return totalRequired > 0 && totalDone >= totalRequired;
    }

    function ensureStatsCards() {
        if (!connovateSection || !toolbar) return null;

        let ribbon = document.getElementById("connovateStatsRibbon");
        if (ribbon) return ribbon;

        ribbon = document.createElement("div");
        ribbon.id = "connovateStatsRibbon";
        ribbon.className = "stats-ribbon";
        ribbon.innerHTML = `
            <div class="stat-card">
                <div class="stat-card-text">
                    <div class="stat-label">Finished Houses</div>
                    <div class="stat-value" id="connovateFinishedProjects">0</div>
                </div>
                <div class="stat-icon stat-icon-green">
                    <img src="../assets/img/icons/finished.png" alt="">
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-card-text">
                    <div class="stat-label">Unfinished Houses</div>
                    <div class="stat-value" id="connovateInProgressProjects">0</div>
                </div>
                <div class="stat-icon stat-icon-red">
                    <img src="../assets/img/icons/unfinished.png" alt="">
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-card-text">
                    <div class="stat-label">Total Connovate</div>
                    <div class="stat-value" id="connovateTotalQuantity">0</div>
                </div>
                <div class="stat-icon stat-icon-blue">
                    <img src="../assets/img/icons/masonry.png" alt="">
                </div>
            </div>
        `;

        connovateSection.insertBefore(ribbon, toolbar);
        return ribbon;
    }

    function setText(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = String(value);
    }

    function updateStatsCards(projectFilter = "") {
        ensureStatsCards();

        const finishedEl = document.getElementById("connovateFinishedProjects");
        const inProgressEl = document.getElementById("connovateInProgressProjects");
        const totalEl = document.getElementById("connovateTotalQuantity");

        const houses = getHouseSummaries(projectFilter);
        const rows = getFilteredRows(projectFilter);

        let finishedHouses = 0;
        let unfinishedHouses = 0;

        houses.forEach((house) => {
            if (isHouseFinished(house)) {
                finishedHouses += 1;
            } else {
                unfinishedHouses += 1;
            }
        });

        // 🟢 Finished Houses = houses with ZERO remaining panels (Yes)
        if (finishedEl) finishedEl.textContent = String(finishedHouses);

        // 🟡 Unfinished Houses = houses that still have remaining panels (No),
        // including houses with zero saved panels at all.
        if (inProgressEl) inProgressEl.textContent = String(unfinishedHouses);

        // 🔵 Total Connovate = total produced parts (sum of quantity) actually
        // saved in the DB, scoped to the current project filter ("" = all projects).
        const totalProducedQuantity = rows.reduce((sum, panel) => sum + toNumber(panel.quantity), 0);
        if (totalEl) totalEl.textContent = String(totalProducedQuantity);
    }

    function populateConnovateTable(floorFilter = "") {
        const rows = getFilteredRows(projectSelect?.value || "");
        const aggregatedRows = getAggregatedParts(rows, floorFilter);

        const tableBody = document.getElementById("connovateTableBody");
        if (tableBody) {
            tableBody.innerHTML = "";
            aggregatedRows.forEach((panel) => {
                const row = document.createElement("tr");
                const partCell = document.createElement("td");
                partCell.textContent = panel.connovate_part;
                const quantityCell = document.createElement("td");
                quantityCell.textContent = toNumber(panel.quantity);
                row.appendChild(partCell);
                row.appendChild(quantityCell);
                tableBody.appendChild(row);
            });
        }
    }

    function getFilteredRows(projectFilter = "") {
        const selectedProject = normalize(projectFilter).toLowerCase();

        return window.connovatePanels.filter((panel) => {
            const projectName = normalize(panel.project_name).toLowerCase();
            return !selectedProject || projectName === selectedProject;
        });
    }

    function populateProjectOptions() {
        if (!projectSelect) return;

        const previousValue = projectSelect.value;
        const markerProjectNames = Object.keys(window.PROJECT_MARKERS || {}).map(normalize).filter(Boolean);
        const panelProjectNames = window.connovatePanels.map((panel) => normalize(panel.project_name)).filter(Boolean);
        const projectNames = [...new Set([...markerProjectNames, ...panelProjectNames])]
            .sort((a, b) => a.localeCompare(b));

        projectSelect.innerHTML = '<option value="">-- Select Project --</option>';

        projectNames.forEach((projectName) => {
            const option = document.createElement("option");
            option.value = projectName;
            option.textContent = projectName;
            projectSelect.appendChild(option);
        });

        if (projectNames.includes(previousValue)) {
            projectSelect.value = previousValue;
        }
    }

    function summarizeFloor(rows, floorName, houses) {
        const floorRows = rows.filter((panel) => normalizeFloor(panel.floor_name) === floorName);

        // totalQuantity / doneQuantity = produced PARTS (sum of `quantity`,
        // since one panel slot can hold more than 1 part). Every saved row
        // is, by definition, done.
        let totalQuantity = 0;
        floorRows.forEach((panel) => {
            totalQuantity += toNumber(panel.quantity);
        });
        const doneQuantity = totalQuantity;

        // remainingQuantity = remaining PANEL SLOTS (not parts) — i.e. how
        // many hotspots across all houses in scope still have no saved
        // record. We don't know how many parts an unfilled slot will need,
        // so this counts slots, not quantity.
        let remainingQuantity = 0;
        houses.forEach((house) => {
            const floor = house.floors[floorName] || createFloorSlot(0);
            remainingQuantity += Math.max(floor.required - floor.done, 0);
        });

        return {
            recordCount: floorRows.length,
            totalQuantity,
            doneQuantity,
            remainingQuantity
        };
    }

    function destroyFloorChart() {
        if (floorChart) {
            floorChart.destroy();
            floorChart = null;
        }
    }

    function renderFloorChart(ground, second) {
        if (!floorChartCanvas || typeof Chart === "undefined") return;

        destroyFloorChart();

        const totalLabelPlugin = {
            id: "connovateTotalLabelPlugin",
            afterDatasetsDraw(chart) {
                const { ctx, scales } = chart;
                const meta = chart.getDatasetMeta(1);
                const totals = [
                    ground.totalQuantity,
                    second.totalQuantity
                ];

                ctx.save();
                ctx.fillStyle = "#1f2937";
                ctx.font = '700 13px "Century Gothic", "Segoe UI", sans-serif';
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";

                meta.data.forEach((bar, index) => {
                    const x = bar.x;
                    const y = scales.y.getPixelForValue(totals[index]) - 8;
                    ctx.fillText(String(totals[index]), x, y);
                });

                ctx.restore();
            }
        };

        floorChart = new Chart(floorChartCanvas.getContext("2d"), {
            type: "bar",
            data: {
                labels: ["Ground Floor", "Second Floor"],
                datasets: [
                    {
                        label: "Produced Parts",
                        data: [ground.doneQuantity, second.doneQuantity],
                        backgroundColor: "#16a34a",
                        borderColor: "#15803d",
                        borderWidth: 1,
                        borderRadius: 8,
                        borderSkipped: false,
                        stack: "panels",
                        categoryPercentage: 0.56,
                        barPercentage: 0.78
                    },
                    {
                        label: "Remaining Parts",
                        data: [
                            ground.remainingQuantity,
                            second.remainingQuantity
                        ],
                        backgroundColor: "#ffd6b3",
                        borderColor: "#f57c1f",
                        borderWidth: 1,
                        borderRadius: 8,
                        borderSkipped: false,
                        stack: "panels",
                        categoryPercentage: 0.56,
                        barPercentage: 0.78
                    }
                ]
            },
            options: {
                indexAxis: "x",
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                layout: {
                    padding: {
                        top: 28,
                        right: 18,
                        left: 8,
                        bottom: 0
                    }
                },
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            color: "#1a1a1a",
                            boxWidth: 14,
                            boxHeight: 14,
                            font: {
                                family: "Century Gothic",
                                size: 13
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: "rgba(255, 255, 255, 0.96)",
                        borderColor: "#f3c397",
                        borderWidth: 1,
                        titleColor: "#1a1a1a",
                        bodyColor: "#1a1a1a",
                        displayColors: true,
                        callbacks: {
                            footer(items) {
                                const index = items[0]?.dataIndex || 0;
                                const totals = [ground.totalQuantity, second.totalQuantity];
                                return `Total: ${totals[index]} parts`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        ticks: {
                            color: "#1a1a1a",
                            font: {
                                family: "Century Gothic",
                                size: 14,
                                weight: "700"
                            }
                        },
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        ticks: {
                            precision: 0,
                            color: "#64748b",
                            stepSize: 1,
                            font: {
                                family: "Century Gothic",
                                size: 13
                            }
                        },
                        grid: {
                            color: "rgba(148, 163, 184, 0.22)",
                            drawBorder: false
                        }
                    }
                }
            },
            plugins: [totalLabelPlugin]
        });
    }

    function renderConnovateBoard(projectFilter = "") {
        const rows = getFilteredRows(projectFilter);
        const houses = getHouseSummaries(projectFilter);
        updateStatsCards(projectFilter);

        if (boardEmpty) boardEmpty.hidden = rows.length > 0;

        const projectName = normalize(projectFilter) || "All Projects";
        if (boardTitle) boardTitle.textContent = `${projectName} Connovate Board`;
        if (boardSubtitle) {
            boardSubtitle.textContent = rows.length
                ? "Ground Floor and Second Floor produced vs remaining parts."
                : "Select a project to view Ground Floor and Second Floor totals.";
        }

        const ground = summarizeFloor(rows, "GROUND FLOOR", houses);
        const second = summarizeFloor(rows, "SECOND FLOOR", houses);
        const totalQuantity = ground.totalQuantity + second.totalQuantity;
        const totalRecords = rows.length;
        const completedQuantity = ground.doneQuantity + second.doneQuantity;
        const remainingQuantity = ground.remainingQuantity + second.remainingQuantity;
        const projectMeta = document.getElementById("connovateBoardProjectMeta");
        const remainingMeta = document.getElementById("connovateBoardRemainingMeta");

        setText("connovateBoardProjectTotal", totalQuantity);
        setText("connovateGroundFloorPanels", ground.totalQuantity);
        setText("connovateGroundFloorDone", ground.doneQuantity);
        setText("connovateSecondFloorPanels", second.totalQuantity);
        setText("connovateSecondFloorDone", second.doneQuantity);
        setText("connovateBoardRemainingQuantity", remainingQuantity);
        renderFloorChart(ground, second);

        if (projectMeta) projectMeta.textContent = `${totalRecords} records | ${completedQuantity} produced parts`;
        if (remainingMeta) remainingMeta.textContent = `${remainingQuantity} remaining panels`;

        populateConnovateTable(currentFloorFilter);
    }

    populateProjectOptions();
    ensureStatsCards();
    renderConnovateBoard("");

    // ==========================================
    // LIVE REFRESH HOOK (called by connovateModal.js
    // right after a panel save/delete succeeds, so the
    // board + parts list update without a full page reload)
    // ==========================================
    window.refreshConnovateBoard = function () {
        populateProjectOptions();
        renderConnovateBoard(projectSelect?.value || "");
    };

    // Upserts/removes a single row in the in-memory window.connovatePanels
    // cache (the array admin.php injects once on page load) so it reflects
    // what was just saved/removed via AJAX, without needing a refresh.
    window.upsertConnovatePanelCache = function (panel) {
        if (!Array.isArray(window.connovatePanels)) window.connovatePanels = [];

        const matchesPanel = (row) =>
            normalize(row.project_name).toLowerCase() === normalize(panel.project_name).toLowerCase() &&
            normalize(row.block_no).toLowerCase() === normalize(panel.block_no).toLowerCase() &&
            normalize(row.lot_no).toLowerCase() === normalize(panel.lot_no).toLowerCase() &&
            normalizeFloor(row.floor_name) === normalizeFloor(panel.floor_name) &&
            normalize(row.panel_key) === normalize(panel.panel_key);

        const existingIndex = window.connovatePanels.findIndex(matchesPanel);

        if (existingIndex !== -1) {
            window.connovatePanels[existingIndex] = {
                ...window.connovatePanels[existingIndex],
                ...panel
            };
        } else {
            window.connovatePanels.push(panel);
        }

        window.refreshConnovateBoard();
    };

    window.removeConnovatePanelCache = function (panel) {
        if (!Array.isArray(window.connovatePanels)) return;

        window.connovatePanels = window.connovatePanels.filter((row) => {
            return !(
                normalize(row.project_name).toLowerCase() === normalize(panel.project_name).toLowerCase() &&
                normalize(row.block_no).toLowerCase() === normalize(panel.block_no).toLowerCase() &&
                normalize(row.lot_no).toLowerCase() === normalize(panel.lot_no).toLowerCase() &&
                normalizeFloor(row.floor_name) === normalizeFloor(panel.floor_name) &&
                normalize(row.panel_key) === normalize(panel.panel_key)
            );
        });

        window.refreshConnovateBoard();
    };

    if (projectSelect) {
        projectSelect.addEventListener("change", () => {
            renderConnovateBoard(projectSelect.value);
        });
    }

    const floorFilterSelect = document.getElementById("connovateFloorFilter");
    if (floorFilterSelect) {
        floorFilterSelect.addEventListener("change", () => {
            currentFloorFilter = floorFilterSelect.value;
            populateConnovateTable(currentFloorFilter);
        });
    }
});