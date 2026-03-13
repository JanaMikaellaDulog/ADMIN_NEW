<?php
include('db_connect.php');

// Fetch Global Stats
$resCount = $conn->query("SELECT COUNT(*) as total FROM residents");
$totalResidents = ($resCount) ? $resCount->fetch_assoc()['total'] : 0;

$activeCount = $conn->query("SELECT COUNT(*) as total FROM residents WHERE resident_status = 'Active'");
$activeResidents = ($activeCount) ? $activeCount->fetch_assoc()['total'] : 0;

$moneyQuery = $conn->query("SELECT SUM(electric_bill + water_bill) as total FROM utility_bills");
$totalMoney = ($moneyQuery && $row = $moneyQuery->fetch_assoc()) ? ($row['total'] ?? 0) : 0;

// Fetch Subdivisions
$projects = $conn->query("SELECT * FROM subdivisions ORDER BY project_name ASC");

// Fetch Resident Data for JS Table
$resQuery = $conn->query("
    SELECT 
        r.resident_id,
        r.full_name as name,
        r.subdivision_id,
        s.project_name as project, 
        r.phase,
        r.block_no as block,
        r.lot_no as lot,
        COALESCE(u.electric_bill, 0) as electricity, 
        COALESCE(u.water_bill, 0) as water, 
        r.resident_status as status
    FROM residents r 
    LEFT JOIN subdivisions s ON r.subdivision_id = s.subdivision_id
    LEFT JOIN utility_bills u ON r.resident_id = u.resident_id
");

$residentsArray = [];
if ($resQuery) {
    while($row = $resQuery->fetch_assoc()) { 
        $residentsArray[] = $row; 
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Imperial House - Admin Dashboard</title>
  <link rel="stylesheet" href="../assets/style.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
  <style>
    /* Section Visibility Handling */
    .app-page { display: none; }
    #section-dashboard { display: block; } /* Dashboard visible by default */
  </style>
</head>
<body>

  <div id="leftMenu" class="left-menu">
    <div class="left-menu-header">
      <div class="left-menu-title">Navigation</div>
    </div>
    <ul class="left-menu-nav">
      <li class="left-menu-item active" data-page="dashboard">DASHBOARD</li>
      <li class="left-menu-item" data-page="residents">RESIDENTS</li>
      <li class="left-menu-item" data-page="analytics">ANALYTICS</li>
      <li class="left-menu-item" data-page="reports">REPORT</li>
    </ul>
  </div>

  <header class="topbar">
    <div class="topbar-title">IMPERIAL HOUSE</div>
  </header>

  <main class="main-content">
    
    <section id="section-dashboard" class="app-page">
      <div class="stats-ribbon">
        <div class="stat-card">
          <div class="stat-label">Global Residents</div>
          <div class="stat-value"><?php echo number_format($totalResidents); ?></div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Active Connections</div>
          <div class="stat-value"><?php echo number_format($activeResidents); ?></div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Total Receivables</div>
          <div class="stat-value">₱ <?php echo number_format($totalMoney, 2); ?></div>
        </div>
      </div>

      <div class="location-selector-section">
        <h2 class="section-title">Project Selection</h2>
        <div class="selector-wrapper" style="display: flex; gap: 15px; margin-top: 15px;">
          <select id="locationSelect" class="clean-dropdown" style="flex: 1;">
            <option value="" disabled selected>— Choose a Project Location —</option>
            <?php
            if ($projects) {
                $projects->data_seek(0);
                while($row = $projects->fetch_assoc()) {
                    echo "<option value='".htmlspecialchars($row['project_name'])."'>".$row['project_name']."</option>";
                }
            }
            ?>
          </select>
          <button class="primary-btn load-btn" onclick="handleLocationChange()">Load Project</button>
        </div>
      </div>

      <div class="map-wrapper" style="margin-top: 30px;">
        <div id="map-controls" style="display: none; justify-content: flex-end; margin-bottom: 10px;">
            <button class="danger-btn" onclick="window.closeMapSection()" style="background:#ef4444; color:white; border:none; padding: 8px 16px; border-radius:8px; cursor:pointer;">
                ✖ Close Map
            </button>
        </div>
        <div id="mapContainer" style="display:none; height: 550px; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); z-index: 1;"></div>
      </div>

      <div id="project-analytics-box" style="margin-top: 30px; background: #1e293b; padding: 25px; border-radius: 15px; border: 1px solid #334155;">
    <h3 id="analytics-title" style="color: #d49006; margin-bottom: 20px; font-weight: 700; text-transform: uppercase;">Project Analytics Overview</h3>
    
    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 300px; height: 300px; background: #161e2e; padding: 15px; border-radius: 10px;">
            <canvas id="populationChart"></canvas>
        </div>
        <div style="flex: 1; min-width: 300px; height: 300px; background: #161e2e; padding: 15px; border-radius: 10px;">
            <canvas id="billingChart"></canvas>
        </div>
    </div>
</div>
    </section>

    <section id="section-residents" class="app-page">
      <div class="page-header" style="margin-bottom: 25px;"><h2>Residents Management</h2></div>
      <div class="residents-toolbar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <button class="primary-btn" onclick="openResidentForm()">+ Add Resident</button>
        <input type="text" id="residentSearch" placeholder="Search residents..." class="search-input">
      </div>
      <div class="residents-table-wrapper">
        <table class="residents-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Project</th>
                    <th>Phase</th>
                    <th>Block</th> <th>Lot</th>   <th>Status</th>
                    <th>Electric</th>
                    <th>Water</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="residentsTableBody"></tbody>
        </table>
      </div>
    </section>

    <section id="section-analytics" class="app-page">
        <div class="page-header"><h2>Analytics</h2></div>
    </section>

    <section id="section-reports" class="app-page">
        <div class="page-header"><h2>Reports</h2></div>
    </section>

  </main>

  <div class="modal-overlay" id="markerModal">
    <div class="modal-container">
      <div class="modal-top-bar">
        <span id="markerModalTitle">Lot Information</span>
        <button onclick="window.closeMarkerModal()">✕</button>
      </div>
      <div id="markerModalContent" style="padding: 20px; color: white;"></div>
    </div>
  </div>

  <div id="addResidentModal" class="modal-overlay">
      <div class="modal-container">
          <div class="modal-top-bar">
              <span>Add New Resident</span>
              <button onclick="closeAddModal()">✕</button>
          </div>
          <form id="addResidentForm">
              <div class="modal-body">
                  <div class="accent-bar"></div>
                  <div class="form-section">
                      <label>Full Name</label>
                      <input type="text" id="addName" placeholder="Enter complete name" required>

                      <label>Project/Subdivision</label>
                      <select id="addProject" required>
                          <option value="" disabled selected>Select Project</option>
                          <?php 
                          $projects->data_seek(0);
                          while($p = $projects->fetch_assoc()): ?>
                              <option value="<?php echo $p['subdivision_id']; ?>"><?php echo $p['project_name']; ?></option>
                          <?php endwhile; ?>
                      </select>

                      <label>Phase</label>
                      <input type="text" id="addPhase" placeholder="e.g. Phase 1">

                      <div style="display: flex; gap: 15px;">
                          <div style="flex: 1;">
                              <label>Block</label>
                              <input type="text" id="addBlock" placeholder="Block No." required>
                          </div>
                          <div style="flex: 1;">
                              <label>Lot</label>
                              <input type="text" id="addLot" placeholder="Lot No." required>
                          </div>
                      </div>

                      <label>Status</label>
                      <select id="addStatus">
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Vacant">Vacant</option>
                      </select>
                  </div>
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn-delete" style="background: #334155;" onclick="closeAddModal()">Cancel</button>
                  <button type="submit" class="primary-btn">Save Resident</button>
              </div>
          </form>
      </div>
  </div>

  <div id="editResidentModal" class="modal-overlay">
      <div class="modal-container">
          <div class="modal-top-bar">
              <span>Edit Resident</span>
              <button onclick="closeEditModal()">✕</button>
          </div>
          <form id="editResidentForm">
              <div class="modal-body">
                  <div class="accent-bar"></div>
                  <div class="form-section">
                      <input type="hidden" id="editIndex">

                      <label>Full Name</label>
                      <input type="text" id="editName" required>

                      <label>Project/Subdivision</label>
                      <select id="editProject" required>
                          <?php 
                          $projects->data_seek(0);
                          while($p = $projects->fetch_assoc()): ?>
                              <option value="<?php echo $p['subdivision_id']; ?>"><?php echo $p['project_name']; ?></option>
                          <?php endwhile; ?>
                      </select>

                      <label>Phase</label>
                      <input type="text" id="editPhase">

                      <div style="display: flex; gap: 15px;">
                          <div style="flex: 1;">
                              <label>Block</label>
                              <input type="text" id="editBlock" required>
                          </div>
                          <div style="flex: 1;">
                              <label>Lot</label>
                              <input type="text" id="editLot" required>
                          </div>
                      </div>

                      <label>Status</label>
                      <select id="editStatus">
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Vacant">Vacant</option>
                      </select>
                  </div>
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn-delete" style="background: #334155;" onclick="closeEditModal()">Cancel</button>
                  <button type="submit" class="primary-btn">Update Changes</button>
              </div>
          </form>
      </div>
  </div>

  <div id="deleteResidentModal" class="modal-overlay">
    <div class="modal-container" style="max-width: 400px;">
        <div class="modal-top-bar" style="background: #ef4444;">
            <span>Authorize Deletion</span>
            <button onclick="closeDeleteModal()">×</button>
        </div>
        <div class="modal-body">
            <div class="accent-bar" style="background: #ef4444;"></div>
            <div class="form-section">
                <p class="delete-warning-text" style="margin-bottom: 20px;">
                    This action is permanent. Please enter your <strong>Admin Password</strong> to confirm.
                </p>
                <label>Admin Password</label>
                <input type="password" id="deleteAuthPass" placeholder="••••••••" style="border-color: #ef4444;">
                <div id="deleteErrorMessage" style="color: #ef4444; font-size: 12px; margin-top: -10px; display: none;">
                    Incorrect password. Please try again.
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn-delete" style="background: #334155;" onclick="closeDeleteModal()">Cancel</button>
            <button type="button" class="primary-btn" style="background: #ef4444;" onclick="confirmDelete()">Verify & Delete</button>
        </div>
    </div>
  </div>

  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <script>
    // Global Data
    window.residents = <?php echo json_encode($residentsArray); ?>;
  </script>

  <script src="get_maps_data.php"></script>      
  <script src="../javascript/marker.js"></script>
  <script src="../javascript/mapModal.js"></script>
  <script src="../javascript/residentsManagement.js"></script>
  <script src="../javascript/projectAnalytics.js"></script>
  <script src="../javascript/menu.js"></script> <script src="../javascript/map.js"></script>

</body>
</html>