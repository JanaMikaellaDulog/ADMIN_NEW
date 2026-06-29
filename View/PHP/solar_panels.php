<section id="section-solar" class="app-page">
    <div class="page-header" style="margin-bottom: 25px;">
        <h2 class="page-title">Solar Panels</h2>
        <p style="color: #64748b; font-size: 13px; margin: 0;">Manage and monitor solar panel installations.</p>
    </div>

    <div class="stats-ribbon">
        <div class="stat-card">
            <div class="stat-card-text">
                <div class="stat-label">Installed</div>
                <div class="stat-value" id="solarInstalledCount">0</div>
            </div>
            <div class="stat-icon stat-icon-green">
                <img src="../assets/img/icons/check.png" alt="">
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-card-text">
                <div class="stat-label">Not Installed</div>
                <div class="stat-value" id="solarNotInstalledCount">0</div>
            </div>
            <div class="stat-icon stat-icon-red">
                <img src="../assets/img/icons/cross.png" alt="">
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-card-text">
                <div class="stat-label">Total Records</div>
                <div class="stat-value" id="solarTotalCount">0</div>
            </div>
            <div class="stat-icon stat-icon-blue">
                <img src="../assets/img/icons/totalrecords.png" alt="">
            </div>
        </div>
    </div>

    <div class="location-selector-section" style="margin-top: 25px;">
        <h2 class="section-title">Project Selection</h2>
        <div class="selector-wrapper" style="display: flex; gap: 15px; margin-top: 15px;">
            <select id="solarProjectSelect" class="header-select">
                <option value="">-- All Projects --</option>
            </select>

            <button type="button" class="btn-load" onclick="window.loadSolarProject && window.loadSolarProject()">
                Load Project
            </button>
        </div>
    </div>

    <div class="connovate-chart-wrapper">
        <div class="connovate-chart-card connovate-board-card">
            <div class="connovate-chart-header">
                <div>
                    <h3 id="solarBoardTitle">All Projects Solar Board</h3>
                    <p id="solarBoardSubtitle">Installed vs not installed houses.</p>
                </div>
            </div>

            <div class="connovate-board-stage">
                <div class="connovate-board-strip">
                    <span class="board-box-label">Project Summary</span>
                    <strong id="solarCompletionRate">0%</strong>
                    <small id="solarBoardMeta">0 of 0 houses installed</small>
                </div>
                <div class="connovate-board-main connovate-board-chart-block">
                    <div class="connovate-chart-frame">
                        <canvas id="solarStatusChart"></canvas>
                    </div>

                    <div class="connovate-floor-meta">
                        <span>Installed Houses: <strong id="solarBoardInstalled">0</strong></span>
                        <span>Not Installed Houses: <strong id="solarBoardNotInstalled">0</strong></span>
                    </div>
                </div>

                <div class="connovate-board-strip connovate-board-strip-bottom">
                    <span class="board-box-label">Remaining Summary</span>
                    <strong id="solarBoardRemaining">0</strong>
                    <small>houses without solar installation</small>
                </div>
            </div>
        </div>
    </div>

    <div style="margin-top: 30px;">
        <h3 style="color: #1a1a1a; margin-bottom: 15px;">Solar Installation Records</h3>

        <div class="residents-table-wrapper">
            <table class="residents-table">
                <thead>
                    <tr>
                        <th>Resident ID</th>
                        <th>Project</th>
                        <th>Block</th>
                        <th>Lot</th>
                        <th>Status</th>
                        <th>Provider</th>
                        <th>Installation Date</th>
                        <th>Proof</th>
                    </tr>
                </thead>
                <tbody id="solarTableBody"></tbody>
            </table>
        </div>
    </div>

</section>

<div id="solarEditModal" class="modal-overlay solar-modal-overlay" style="z-index: 10020;">
    <div class="modal-container connovate-modal-container">
        <div class="modal-top-bar">
            <span>Solar Panels</span>
            <button type="button" onclick="window.closeSolarModal()">✕</button>
        </div>

        <form id="solarPanelForm" enctype="multipart/form-data">
            <div class="modal-body connovate-modal-body">
                <div class="connovate-hero">
                    <div>
                        <div class="connovate-eyebrow">Solar Panel View</div>
                        <h2 id="solarResidentName">-</h2>
                        <p id="solarResidentMeta">Resident ID: -</p>
                    </div>
                    <span id="solarStatusBadge" class="status-tag">Not Installed</span>
                </div>

                <input type="hidden" id="solarResidentId">
                <input type="hidden" id="solarProjectName">
                <input type="hidden" id="solarBlockNo">
                <input type="hidden" id="solarLotNo">

                <div class="connovate-grid">
                    <div class="connovate-card">
                        <label>Lot Context</label>
                        <span id="solarLotContext">No lot selected</span>
                    </div>

                    <div class="connovate-card">
                        <label>Solar Status</label>
                        <select id="solarStatus">
                            <option value="Not Installed">Not Installed</option>
                            <option value="Installed">Installed</option>
                        </select>
                    </div>

                    <div class="connovate-card">
                        <label>Installation Date</label>
                        <input type="date" id="solarInstallationDate">
                    </div>

                    <div class="connovate-card">
                        <label>Provider / Company</label>
                        <input type="text" id="solarProvider" placeholder="Provider/company">
                    </div>

                    <div class="connovate-card">
                        <label>Capacity / Details</label>
                        <input type="text" id="solarCapacity" placeholder="Example: 5kW / 10 panels">
                    </div>

                    <div class="connovate-card">
                        <label>Proof File</label>
                        <input type="file" id="solarProofFile" accept=".pdf,.jpg,.jpeg,.png">
                    </div>
                </div>

                <div class="connovate-card" style="margin-top: 16px;">
                    <label>Remarks</label>
                    <textarea id="solarRemarks" placeholder="Solar installation notes..."></textarea>
                </div>

                <div class="connovate-card" style="margin-top: 16px;">
                    <label>Uploaded Proof</label>
                    <span id="solarProofInfo">No proof uploaded</span><br>
                    <a id="solarProofLink" href="#" target="_blank" style="display:none;">Open Proof File</a>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn-cancel" onclick="window.clearSolarForm()">Clear</button>
                <button type="submit" class="primary-btn">Save Solar Info</button>
            </div>
        </form>
    </div>
</div>