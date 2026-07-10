<section id="section-solar" class="app-page">
    <div class="page-header" style="margin-bottom: 25px;">
        <h2 class="page-title">Solar Panels</h2>
        <p style="color: #64748b; font-size: 13px; margin: 0;">Manage and monitor solar panel installations.</p>
    </div>

    <div class="stats-ribbon">
        <div class="stat-card">
            <div class="stat-card-text">
                <div class="stat-label">Fully Installed</div>
                <div class="stat-value" id="solarInstalledCount">0</div>
            </div>
            <div class="stat-icon stat-icon-green">
                <img src="../assets/img/icons/check.png" alt="">
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-card-text">
                <div class="stat-label">In Progress</div>
                <div class="stat-value" id="solarNotInstalledCount">0</div>
            </div>
            <div class="stat-icon stat-icon-red">
                <img src="../assets/img/icons/clock.png" alt="">
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-card-text">
                <div class="stat-label">Total Houses</div>
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
                    <h3 id="solarBoardTitle">All Projects Solar Panel</h3>
                    <p id="solarBoardSubtitle">Fully installed, in progress, and no installation houses.</p>
                </div>
            </div>

            <div class="connovate-board-stage">
                <div class="connovate-board-strip">
                    <span class="board-box-label">Project Summary</span>
                    <strong id="solarCompletionRate">0%</strong>
                    <small id="solarBoardMeta">0 of 0 houses fully installed</small>
                </div>
                <div class="connovate-board-main connovate-board-chart-block">
                    <div class="connovate-chart-frame">
                        <canvas id="solarStatusChart"></canvas>
                    </div>

                    <div class="connovate-floor-meta">
                        <span>Fully Installed: <strong id="solarBoardInstalled">0</strong></span>
                        <span>In Progress: <strong id="solarBoardInProgress">0</strong></span>
                        <span>No Installation: <strong id="solarBoardNotInstalled">0</strong></span>
                    </div>
                </div>

                <div class="connovate-board-strip connovate-board-strip-bottom">
                    <span class="board-box-label">Remaining Summary</span>
                    <strong id="solarBoardRemaining">0</strong>
                    <small>houses with no installed solar parts</small>
                </div>
            </div>
        </div>
    </div>

    <div style="margin-top: 30px;">
        <div class="connovate-panel-toolbar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h3 id="solarRecordsTitle" style="margin: 0; font-size: 16px; font-weight: 600;">Solar Installation Records</h3>
            <div style="display: flex; gap: 10px; align-items: center;">
                <label style="color: #6b6b6b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Search:</label>
                <input type="text" id="solarRecordsSearch" style="padding: 6px 12px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; color: #1a1a1a; font-size: 13px; min-width: 180px; outline: none;">
                <label style="color: #6b6b6b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Block:</label>
                <select id="solarRecordsBlockFilter" style="padding: 6px 12px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; color: #1a1a1a; font-size: 13px; min-width: 100px; cursor: pointer; outline: none;">
                    <option value="">All</option>
                </select>
            </div>
        </div>

        <div class="residents-table-wrapper">   
            <table class="residents-table" id="solarInstallationTable">
                <thead>
                    <tr>
                        <tr>
                            <th>Resident ID</th>
                            <th>Project</th>
                            <th>Block</th>
                            <th>Lot</th>
                            <th>Solar Type</th>
                            <th>Progress</th>
                            <th>Last Updated</th>
                            <th>Action</th>
                    </tr>
                </thead>
                <tbody id="solarTableBody"></tbody>
            </table>
            <p id="solarRecordsEmpty" style="display:none; text-align:center; color:#94a3b8; padding: 20px; font-size: 13px;">Select a project above to view Block/Lot records.</p>
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
                    <div class="solar-progress-badge">
                        <div class="solar-progress-main">
                            <strong id="solarInstalledPartsCount">0</strong>
                            <span id="solarPartsTotal">/ 5</span>
                            <span id="solarNetMeteringIcon" class="solar-net-metering-icon" style="display:none;">⇅</span>
                        </div>
                        <small>Installed</small>
                    </div>
                </div>

                <input type="hidden" id="solarResidentId">
                <input type="hidden" id="solarProjectName">
                <input type="hidden" id="solarBlockNo">
                <input type="hidden" id="solarLotNo">


                <div class="connovate-card" style="margin-bottom: 16px;">
                    <label>Solar Type</label>
                    <select id="solarType">
                        <option value="Grid-Tied">Grid-Tied</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                </div>

                <div class="solar-parts-overview">
                    <div class="solar-parts-header">
                        <h3>Solar Parts Checklist</h3>
                        <p>Review each installed solar component per house.</p>
                    </div>

                    <div id="solarPartsList" class="solar-parts-list"></div>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn-cancel" onclick="window.closeSolarModal()">Close</button>
                <button type="button" class="primary-btn" onclick="window.saveSolarTypeChange()">Save</button>
            </div>
        </form>
    </div>
</div>

<div id="solarPartEditModal" class="modal-overlay solar-modal-overlay" style="z-index: 10030;">
        <div class="modal-container connovate-modal-container">
            <div class="modal-top-bar">
                <button type="button" onclick="window.closeSolarPartEditModal()">←</button>
                <span>Edit Solar Part</span>
                <button type="button" onclick="window.closeSolarPartEditModal()">✕</button>
            </div>

            <form id="solarPartForm" enctype="multipart/form-data">
                <div class="modal-body connovate-modal-body">
                    <div class="connovate-hero">
                        <div>
                            <div class="connovate-eyebrow">Edit Solar Part</div>
                            <h2 id="solarPartTitle">Solar Part</h2>
                            <p id="solarPartDescription">-</p>
                        </div>
                    </div>

                    <input type="hidden" id="solarPartName">

                    <div class="connovate-grid">
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

                        <div class="connovate-card" style="grid-column: span 2;">
                            <label>Proof File</label>
                            <input type="file" id="solarProofFile" accept=".pdf,.jpg,.jpeg,.png" style="display:none;">

                            <div class="solar-file-box" onclick="document.getElementById('solarProofFile').click()">
                                <span id="solarProofFileName">Choose File</span>

                                <button type="button"
                                        id="solarProofRemoveBtn"
                                        class="solar-file-x"
                                        style="display:none;"
                                        onclick="event.stopPropagation(); removeSolarProofFile();">
                                    ✕
                                </button>
                            </div>
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
                    <button type="button" class="btn-cancel" onclick="window.closeSolarPartEditModal()">Cancel</button>
                    <button type="submit" class="primary-btn">Save Part</button>
                </div>
            </form>
        </div>
    </div>
</div>