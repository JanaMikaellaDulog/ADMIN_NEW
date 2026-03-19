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
    const activeLots = data.filter(r => String(r.status).toLowerCase() === 'active').length;
    const totalMoney = data.reduce((sum, r) => sum + (Number(r.electricity) || 0) + (Number(r.water) || 0), 0);

    const resEl = document.getElementById('stat-total-residents');
    const actEl = document.getElementById('stat-active-lots');
    const monEl = document.getElementById('stat-total-money');

    if (resEl) resEl.innerText = totalResidents.toLocaleString();
    if (actEl) actEl.innerText = activeLots.toLocaleString();
    if (monEl) monEl.innerText = `₱ ${totalMoney.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  // ==========================================
  // 2. PROJECT SPECIFIC CHARTS
  // ==========================================
  window.updateProjectCharts = function (projectKey) {
    const data = window.residents || [];
    
    // Filter data: if 'All Projects', use everything; otherwise, filter by key
    const isGlobal = !projectKey || projectKey === 'All Projects';
    const projectData = isGlobal 
        ? data 
        : data.filter(r => String(r.project).trim().toLowerCase() === String(projectKey).trim().toLowerCase());

    const analyticsBox = document.getElementById('project-analytics-box');
    const analyticsTitle = document.getElementById('analytics-title');
    
    if (!analyticsBox) return;
    
    // Always keep visible now
    analyticsBox.style.display = 'block';
    if (analyticsTitle) {
        analyticsTitle.innerText = isGlobal ? `Global Analytics Overview` : `${projectKey} - Analytics Overview`;
    }

    // --- Data Calculations ---
    const activeCount = projectData.filter(r => String(r.status).toLowerCase() === 'active').length;
    const inactiveCount = projectData.length - activeCount;
    
    const totalElectric = projectData.reduce((sum, r) => sum + (Number(r.electricity) || 0), 0);
    const totalWater = projectData.reduce((sum, r) => sum + (Number(r.water) || 0), 0);

    // --- Chart Cleanup ---
    if (popChartInstance) popChartInstance.destroy();
    if (billChartInstance) billChartInstance.destroy();

    // ==========================================
    // POPULATION PIE CHART
    // ==========================================
    const popCanvas = document.getElementById('populationChart');
    if (popCanvas) {
        const ctxPop = popCanvas.getContext('2d');
        popChartInstance = new Chart(ctxPop, {
          type: 'pie',
          data: {
            labels: ['Active', 'Inactive/Vacant'],
            datasets: [{
              data: [activeCount, inactiveCount],
              backgroundColor: ['#22c55e', '#ef4444'], // Matched to your new button colors
              borderColor: '#1e293b',
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { color: '#f8fafc' } },
              title: { display: true, text: 'Resident Population', color: '#f8fafc' }
            }
          }
        });
    }

    // ==========================================
    // BILLING BAR CHART
    // ==========================================
    const billCanvas = document.getElementById('billingChart');
    if (billCanvas) {
        const ctxBill = billCanvas.getContext('2d');
        billChartInstance = new Chart(ctxBill, {
          type: 'bar',
          data: {
            labels: ['Electricity', 'Water'],
            datasets: [{
              label: 'Total Collected (₱)',
              data: [totalElectric, totalWater],
              backgroundColor: ['#0ea5e9', '#007bff'], // Sky blue for electricity
              borderRadius: 8
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'Total Billing Comparison', color: '#f8fafc' }
            },
            scales: {
              y: { 
                beginAtZero: true,
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { 
                    color: '#94a3b8',
                    callback: (val) => '₱' + val.toLocaleString() 
                }
              },
              x: {
                ticks: { color: '#94a3b8' }
              }
            }
          }
        });
    }
  };

  // ==========================================
  // INITIALIZATION LOGIC
  // ==========================================
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        // 1. Update the top ribbon stats
        window.updateGlobalRibbon();

        // 2. Check the dropdown for a value to load charts immediately
        const locationSelect = document.getElementById('locationSelect');
        if (locationSelect && locationSelect.value) {
            window.updateProjectCharts(locationSelect.value);
        } else {
            // Default to Global view if nothing is selected
            window.updateProjectCharts('All Projects');
        }
    }, 200); // Small delay to ensure database records are in window.residents
  });
})();