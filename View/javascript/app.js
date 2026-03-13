// app.js
document.addEventListener("DOMContentLoaded", () => {
  const rightMenu = document.getElementById("rightMenu");
  const rightMenuOverlay = document.getElementById("rightMenuOverlay");
  const menuItems = document.querySelectorAll(".right-menu-item");

  // --- 1. TAB PERSISTENCE LOGIC ---
  // Check if we have a saved page from the last time we were here
  const savedPage = localStorage.getItem("activeDashboardTab") || "dashboard";

  function switchPage(pageId) {
    // Update Menu Selection
    menuItems.forEach(i => {
      i.classList.remove("active");
      if (i.dataset.page === pageId) i.classList.add("active");
    });

    // Update Content Visibility
    document.querySelectorAll(".app-page").forEach(p => p.classList.remove("active-page"));
    const selectedPage = document.getElementById(`section-${pageId}`);
    selectedPage?.classList.add("active-page");

    // Save the current page choice
    localStorage.setItem("activeDashboardTab", pageId);

    // Specific logic for maps/tables
    if (pageId === "dashboard" && window.map) {
      setTimeout(() => window.map.invalidateSize(), 300);
    }
    if (pageId === "residents" && window.renderResidentsTable) {
      window.renderResidentsTable();
    }
  }

  // Initialize the page on load
  switchPage(savedPage);

  // --- 2. MENU CONTROLS ---
  window.openRightMenu = () => {
    rightMenu?.classList.add("open");
    rightMenuOverlay?.classList.add("show");
  };

  window.closeRightMenu = () => {
    rightMenu?.classList.remove("open");
    rightMenuOverlay?.classList.remove("show");
  };

  // --- 3. CLICK LISTENERS ---
  menuItems.forEach(item => {
    item.addEventListener("click", () => {
      const page = item.dataset.page;
      switchPage(page);
      closeRightMenu();
    });
  });
});