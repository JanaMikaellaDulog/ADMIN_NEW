/**
 * projectAnalytics.js
 * Handles Global Ribbon stats and Project-specific Charts
 */
(function () {
  let popChartInstance = null;
  let billChartInstance = null;

  function formatMoney(value, decimals = 0) {
    return '\u20b1' + Number(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  // ==========================================
  // 1. GLOBAL STATS RIBBON (Always Visible)
  // ==========================================
  window.updateGlobalRibbon = function () {
    const data = window.residents || [];

    const totalResidents = data.length;
    // MATCHED TO DB: resident_status
    const activeLots = data.filter(r => String(r.resident_status).toLowerCase() === 'active').length;
    // MATCHED TO DB: total_bill
    const totalMoney = data.reduce((sum, r) => sum + (Number(r.total_bill) || 0), 0);

    const resEl = document.getElementById('stat-total-residents');
    const actEl = document.getElementById('stat-active-lots');
    const monEl = document.getElementById('stat-total-money');

    if (resEl) resEl.innerText = totalResidents.toLocaleString();
    if (actEl) actEl.innerText = activeLots.toLocaleString();
    if (monEl) monEl.innerText = formatMoney(totalMoney, 2);
  };

  // ==========================================
  // 2. PROJECT SPECIFIC CHARTS
  // ==========================================
  window.updateProjectCharts = function (projectKey) {
    const data = window.residents || [];

    // Filter data: if 'All Projects', use everything; otherwise, filter by project name
    const isGlobal = !projectKey || projectKey === 'All Projects';
    const projectData = isGlobal
      ? data
      : data.filter(r => String(r.project).trim().toLowerCase() === String(projectKey).trim().toLowerCase());

    const analyticsBox = document.getElementById('project-analytics-box');
    const analyticsTitle = document.getElementById('analytics-title');

    if (!analyticsBox) return;

    analyticsBox.style.display = 'block';
    if (analyticsTitle) {
      analyticsTitle.innerText = isGlobal ? 'Global Analytics Overview' : `${projectKey} - Analytics Overview`;
    }

    // --- Data Calculations ---
    // MATCHED TO DB: resident_status
    const activeCount = projectData.filter(r => String(r.resident_status).toLowerCase() === 'active').length;
    const inactiveCount = projectData.length - activeCount;

    // Logic: Compare Paid vs Unpaid collections for the Bar Chart
    const paidTotal = projectData
      .filter(r => r.bill_status === 'Paid')
      .reduce((sum, r) => sum + (Number(r.total_bill) || 0), 0);

    const unpaidTotal = projectData
      .filter(r => r.bill_status !== 'Paid')
      .reduce((sum, r) => sum + (Number(r.total_bill) || 0), 0);

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
            backgroundColor: ['#16a34a', '#ef4444'],
            borderColor: '#ffffff',
            borderWidth: 3,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#172033',
                usePointStyle: true,
                boxWidth: 8,
                font: { family: 'Century Gothic', size: 12, weight: '700' }
              }
            },
            title: {
              display: true,
              text: 'Resident Status Distribution',
              color: '#172033',
              font: { family: 'Century Gothic', size: 15, weight: '700' },
              padding: { bottom: 12 }
            },
            tooltip: {
              backgroundColor: 'rgba(255, 255, 255, 0.96)',
              titleColor: '#172033',
              bodyColor: '#172033',
              borderColor: '#e5e7eb',
              borderWidth: 1
            }
          }
        }
      });
    }

    // ==========================================
    // BILLING BAR CHART (Collection Status)
    // ==========================================
    const billCanvas = document.getElementById('billingChart');
    if (billCanvas) {
      const ctxBill = billCanvas.getContext('2d');
      const billingValueLabels = {
        id: 'billingValueLabels',
        afterDatasetsDraw(chart) {
          const { ctx } = chart;
          const meta = chart.getDatasetMeta(0);

          ctx.save();
          ctx.fillStyle = '#172033';
          ctx.font = '700 12px "Century Gothic", "Segoe UI", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';

          meta.data.forEach((bar, index) => {
            const value = chart.data.datasets[0].data[index];
            ctx.fillText(formatMoney(value), bar.x, bar.y - 8);
          });

          ctx.restore();
        }
      };

      billChartInstance = new Chart(ctxBill, {
        type: 'bar',
        data: {
          labels: ['Paid Collections', 'Balance / Unpaid'],
          datasets: [{
            label: 'Total Collections',
            data: [paidTotal, unpaidTotal],
            backgroundColor: ['#16a34a', '#f57c1f'],
            borderColor: ['#15803d', '#e06a10'],
            borderWidth: 1,
            borderRadius: 10,
            borderSkipped: false,
            barPercentage: 0.58,
            categoryPercentage: 0.62
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: { top: 28, right: 12, bottom: 6, left: 6 }
          },
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Revenue Collection Overview',
              color: '#172033',
              font: { family: 'Century Gothic', size: 15, weight: '700' },
              padding: { bottom: 12 }
            },
            tooltip: {
              backgroundColor: 'rgba(255, 255, 255, 0.96)',
              titleColor: '#172033',
              bodyColor: '#172033',
              borderColor: '#e5e7eb',
              borderWidth: 1,
              displayColors: false,
              callbacks: {
                label: (context) => `${context.label}: ${formatMoney(context.parsed.y)}`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grace: '18%',
              grid: { color: 'rgba(148, 163, 184, 0.22)' },
              border: { display: false },
              ticks: {
                color: '#64748b',
                font: { family: 'Century Gothic', size: 11 },
                callback: (val) => formatMoney(val)
              }
            },
            x: {
              grid: { display: false },
              border: { display: false },
              ticks: {
                color: '#172033',
                font: { family: 'Century Gothic', size: 12, weight: '700' }
              }
            }
          }
        },
        plugins: [billingValueLabels]
      });
    }
  };

  // ==========================================
  // INITIALIZATION
  // ==========================================
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      window.updateGlobalRibbon();

      const locationSelect = document.getElementById('locationSelect');
      if (locationSelect && locationSelect.value) {
        window.updateProjectCharts(locationSelect.value);
      } else {
        window.updateProjectCharts('All Projects');
      }
    }, 200);
  });
})();
