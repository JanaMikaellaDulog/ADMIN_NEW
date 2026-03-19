/**
 * residentsData.js (Recycled)
 * Now acts as the Bridge between the Database and the Frontend.
 */

(function () {
    // 1. Initialize an empty array for the global scope
    window.residents = [];

    /**
     * Fetches all residents from the database via a PHP script.
     * This replaces the old hardcoded 'rawResidents' array.
     */
    window.fetchResidentsFromDB = async function () {
        try {
            // We'll create this PHP file next to fetch the data
            const response = await fetch('get_residents.php');
            const data = await response.json();

            if (data.success) {
                // Normalize the data to match your existing frontend structure
                window.residents = data.residents.map(r => ({
                    resident_id: r.resident_id, // Keep ID for Edit/Delete
                    lot: String(r.lot_no).trim(),
                    block: String(r.block_no).trim(),
                    project: r.project_name || "Unknown",
                    residents: [r.first_name], // Array format for your table logic
                    status: (r.resident_status || "inactive").toLowerCase(),
                    electricity: Number(r.electricity_amount) || 0,
                    water: Number(r.water_amount) || 0
                }));

                console.log("Database residents loaded:", window.residents.length);

                // Re-render the table once data is arrived
                if (typeof window.renderResidentsTable === "function") {
                    window.renderResidentsTable();
                }
                
                // If you have maps or charts, you can trigger their updates here too
            }
        } catch (error) {
            console.error("Failed to fetch residents:", error);
        }
    };

    // 2. Execute the fetch immediately on load
    window.fetchResidentsFromDB();

})();