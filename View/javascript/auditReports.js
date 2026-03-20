/**
 * Imperial House - Audit Reports Logic
 */

function exportAuditLog() {
    const tableBody = document.getElementById("auditLogBody");
    if (!tableBody) return;

    const rows = tableBody.querySelectorAll("tr");
    if (rows.length === 0 || rows[0].innerText.includes("No recent")) {
        alert("No data available to export.");
        return;
    }

    let csvContent = "Admin ID,Action,Details,Timestamp\n";

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        if (cells.length >= 4) {
            const adminId = cells[0].innerText.replace("#", "").trim();
            const action = cells[1].innerText.trim();
            // Replace commas with semicolons so the CSV doesn't break
            const details = cells[2].innerText.replace(/,/g, ";").trim(); 
            const timestamp = cells[3].innerText.trim();

            csvContent += `"${adminId}","${action}","${details}","${timestamp}"\n`;
        }
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().split('T')[0];
    
    link.setAttribute("href", url);
    link.setAttribute("download", `Imperial_House_Audit_Log_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Named to match your <input onkeyup="filterAuditLog(this.value)">
function filterAuditLog(query) {
    const searchTerm = query.toLowerCase();
    const rows = document.querySelectorAll("#auditLogBody tr");

    rows.forEach(row => {
        // If the row contains "No recent", don't hide it during search
        if(row.innerText.includes("No recent")) return;
        
        const rowText = row.innerText.toLowerCase();
        row.style.display = rowText.includes(searchTerm) ? "" : "none";
    });
}