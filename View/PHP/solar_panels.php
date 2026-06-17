<section id="section-solar" class="app-page">
    <div class="page-header" style="margin-bottom: 25px;">
        <h2>Solar Panels</h2>
        <p style="color: #64748b; font-size: 13px; margin: 0;">Manage and monitor solar panel installations.</p>
    </div>

    <div class="stats-ribbon">
        <div class="stat-card">
            <div class="stat-label">Installed</div>
            <div class="stat-value" id="solarInstalledCount">0</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Not Installed</div>
            <div class="stat-value" id="solarNotInstalledCount">0</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Total Records</div>
            <div class="stat-value" id="solarTotalCount">0</div>
        </div>
    </div>

    <div class="location-selector-section" style="margin-top: 25px;">
        <h2 class="section-title">Project Selection</h2>
        <div class="selector-wrapper" style="display: flex; gap: 15px; margin-top: 15px;">
            <select id="solarProjectSelect" class="header-select">
                <option value="">-- All Projects --</option>
            </select>
        </div>
    </div>

    <div style="margin-top: 30px;">
        <h3 style="color: #f8fafc; margin-bottom: 15px;">Solar Installation Records</h3>

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