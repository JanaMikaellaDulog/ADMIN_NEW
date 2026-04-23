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
            <label style="color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Floor:</label>
            <select id="connovateFloorFilter" style="padding: 8px 12px; background: #0f172a; border: 1px solid #334155; border-radius: 6px; color: #f8fafc; font-size: 13px; min-width: 140px; cursor: pointer; outline: none;">
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

    function ensureStatsCards() {
        if (!connovateSection || !toolbar) return null;

        let ribbon = document.getElementById("connovateStatsRibbon");
        if (ribbon) return ribbon;

        ribbon = document.createElement("div");
        ribbon.id = "connovateStatsRibbon";
        ribbon.className = "stats-ribbon";
        ribbon.innerHTML = `
            <div class="stat-card">
                <div class="stat-label">Finished</div>
                <div class="stat-value" id="connovateFinishedProjects">0</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Unfinished House</div>
                <div class="stat-value" id="connovateInProgressProjects">0</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Connovate</div>
                <div class="stat-value" id="connovateTotalQuantity">0</div>
            </div>
        `;

        connovateSection.insertBefore(ribbon, toolbar);
        return ribbon;
    }

    function setText(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = String(value);
    }

    function isPanelDone(panel) {
        const status = normalize(panel.status).toLowerCase();
        return status === "done" || Boolean(normalize(panel.completed_at));
    }

    function createFloorSummary() {
        return {
            hasRecords: false,
            totalQuantity: 0,
            doneQuantity: 0,
            remainingQuantity: 0,
            allDone: true
        };
    }

    function getHouseProgress(rows) {
        const houses = new Map();

        rows.forEach((panel) => {
            const projectName = normalize(panel.project_name);
            const blockNo = normalize(panel.block_no);
            const lotNo = normalize(panel.lot_no);
            const floorName = normalizeFloor(panel.floor_name);
            const quantity = toNumber(panel.quantity);

            if (!projectName || !blockNo || !lotNo || !floorName) return;

            const mapKey = [projectName, blockNo, lotNo].join("|");
            if (!houses.has(mapKey)) {
                houses.set(mapKey, {
                    projectName,
                    blockNo,
                    lotNo,
                    floors: {
                        "GROUND FLOOR": createFloorSummary(),
                        "SECOND FLOOR": createFloorSummary()
                    }
                });
            }

            const house = houses.get(mapKey);
            if (!house.floors[floorName]) {
                house.floors[floorName] = createFloorSummary();
            }

            const floor = house.floors[floorName];
            floor.hasRecords = true;
            floor.totalQuantity += quantity;

            if (isPanelDone(panel)) {
                floor.doneQuantity += quantity;
            } else {
                floor.remainingQuantity += quantity;
                floor.allDone = false;
            }
        });

        return houses;
    }

    function updateStatsCards(rows) {
        ensureStatsCards();

        const finishedProjectsEl = document.getElementById("connovateFinishedProjects");
        const inProgressProjectsEl = document.getElementById("connovateInProgressProjects");
        const totalQuantityEl = document.getElementById("connovateTotalQuantity");
        const houses = getHouseProgress(rows);

        let finishedProjects = 0;
        let inProgressProjects = 0;

        houses.forEach((house) => {
            const ground = house.floors["GROUND FLOOR"] || createFloorSummary();
            const second = house.floors["SECOND FLOOR"] || createFloorSummary();
            const isFinished = ground.hasRecords && second.hasRecords && ground.allDone && second.allDone;

            if (isFinished) {
                finishedProjects += 1;
            } else {
                inProgressProjects += 1;
            }
        });

        if (finishedProjectsEl) finishedProjectsEl.textContent = String(finishedProjects);
        if (inProgressProjectsEl) inProgressProjectsEl.textContent = String(inProgressProjects);
        if (totalQuantityEl) totalQuantityEl.textContent = String(houses.size);
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
        const projectNames = [...new Set(
            window.connovatePanels
                .map((panel) => normalize(panel.project_name))
                .filter(Boolean)
        )].sort((a, b) => a.localeCompare(b));

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

    function summarizeFloor(rows, floorName) {
        const floorRows = rows.filter((panel) => normalizeFloor(panel.floor_name) === floorName);
        let totalQuantity = 0;
        let doneQuantity = 0;
        let remainingQuantity = 0;

        floorRows.forEach((panel) => {
            const quantity = toNumber(panel.quantity);
            totalQuantity += quantity;

            if (isPanelDone(panel)) {
                doneQuantity += quantity;
            } else {
                remainingQuantity += quantity;
            }
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
                ctx.font = "700 16px Arial";
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
                        borderColor: "#16a34a",
                        borderWidth: 1,
                        stack: "panels",
                        categoryPercentage: 0.58,
                        barPercentage: 0.82
                    },
                    {
                        label: "Remaining Parts",
                        data: [
                            ground.remainingQuantity,
                            second.remainingQuantity
                        ],
                        backgroundColor: "#475569",
                        borderColor: "#475569",
                        borderWidth: 1,
                        stack: "panels",
                        categoryPercentage: 0.58,
                        barPercentage: 0.82
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
                            color: "#cbd5e1",
                            boxWidth: 14,
                            boxHeight: 14,
                            font: {
                                size: 13
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: "rgba(15, 23, 42, 0.96)",
                        borderColor: "#475569",
                        borderWidth: 1,
                        titleColor: "#f8fafc",
                        bodyColor: "#e2e8f0"
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        ticks: {
                            color: "#f8fafc",
                            font: {
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
                            color: "#cbd5e1",
                            stepSize: 1,
                            font: {
                                size: 13
                            }
                        },
                        grid: {
                            color: "rgba(71, 85, 105, 0.35)",
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
        updateStatsCards(rows);

        if (boardEmpty) boardEmpty.hidden = rows.length > 0;

        const projectName = normalize(projectFilter) || "All Projects";
        if (boardTitle) boardTitle.textContent = `${projectName} Connovate Board`;
        if (boardSubtitle) {
            boardSubtitle.textContent = rows.length
                ? "Ground Floor and Second Floor produced vs remaining parts."
                : "Select a project to view Ground Floor and Second Floor totals.";
        }

        const ground = summarizeFloor(rows, "GROUND FLOOR");
        const second = summarizeFloor(rows, "SECOND FLOOR");
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
        if (remainingMeta) remainingMeta.textContent = `${remainingQuantity} remaining parts`;

        populateConnovateTable(currentFloorFilter);
    }

    populateProjectOptions();
    ensureStatsCards();
    renderConnovateBoard("");

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
