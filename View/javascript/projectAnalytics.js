/**
 * projectAnalytics.js
 * Handles Global Ribbon stats and Project-specific Charts
 */
(function () {
  let popChartInstance = null;
  let billChartInstance = null;

  // ==========================================
  // 1. GLOBAL STATS RIBBON (Always Visible)
  // ==========================================
  window.updateGlobalRibbon = function () {
    const data = window.residents || [];
    
    const totalResidents = data.length;
    const activeLots = data.filter(r => r.status === 'active').length;
    const totalMoney = data.reduce((sum, r) => sum + (Number(r.electricity) || 0) + (Number(r.water) || 0), 0);

    const resEl = document.getElementById('stat-total-residents');
    const actEl = document.getElementById('stat-active-lots');
    const monEl = document.getElementById('stat-total-money');

    if (resEl) resEl.innerText = totalResidents.toLocaleString();
    if (actEl) actEl.innerText = activeLots.toLocaleString();
    if (monEl) monEl.innerText = `₱ ${totalMoney.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  // ==========================================
  // 2. PROJECT SPECIFIC CHARTS (On Card Click)
  // ==========================================
  window.updateProjectCharts = function (projectKey) {
    const data = window.residents || [];
    
    // Filter data for the specific project
    const projectData = data.filter(r => 
      String(r.project).trim().toLowerCase() === String(projectKey).trim().toLowerCase()
    );

    const analyticsBox = document.getElementById('project-analytics-box');
    const analyticsTitle = document.getElementById('analytics-title');
    
    if (!analyticsBox) return;
    
    analyticsBox.style.display = 'block';
    if (analyticsTitle) analyticsTitle.innerText = `${projectKey} - Analytics Overview`;

    // --- Data Calculations ---
    const activeCount = projectData.filter(r => r.status === 'active').length;
    const inactiveCount = projectData.filter(r => r.status === 'inactive').length;
    
    const totalElectric = projectData.reduce((sum, r) => sum + (Number(r.electricity) || 0), 0);
    const totalWater = projectData.reduce((sum, r) => sum + (Number(r.water) || 0), 0);

    // --- Chart Cleanup (Prevent hover bugs) ---
    if (popChartInstance) popChartInstance.destroy();
    if (billChartInstance) billChartInstance.destroy();

    // --- Population Pie Chart ---
    const ctxPop = document.getElementById('populationChart').getContext('2d');
    popChartInstance = new Chart(ctxPop, {
      type: 'pie',
      data: {
        labels: ['Active Residents', 'Inactive/Vacant'],
        datasets: [{
          data: [activeCount, inactiveCount],
          backgroundColor: ['#28a745', '#dc3545'], // Green and Red
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Resident Population' }
        }
      }
    });

    // --- Billing Bar Chart ---
    const ctxBill = document.getElementById('billingChart').getContext('2d');
    billChartInstance = new Chart(ctxBill, {
      type: 'bar',
      data: {
        labels: ['Electricity', 'Water'],
        datasets: [{
          label: 'Total Collected (₱)',
          data: [totalElectric, totalWater],
          backgroundColor: ['#d49006', '#007bff'], // Gold and Blue
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Total Billing Comparison' }
        },
        scales: {
          y: { 
            beginAtZero: true,
            ticks: { callback: (val) => '₱' + val.toLocaleString() }
          }
        }
      }
    });
  };

  // Initialize Global Ribbon on load
  document.addEventListener("DOMContentLoaded", () => {
    // Wait a tiny bit for data normalization to finish
    setTimeout(() => {
        window.updateGlobalRibbon();
    }, 100);
  });
})();