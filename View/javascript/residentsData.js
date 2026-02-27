// residentsData.js
// Central Single Source of Truth for all residents

(function () {
  // ============================
  // RAW DATA
  // ============================
  const rawResidents = [
    { lot: 63, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Carlos Mendoza", "Maria Mendoza"], status: "active", electricity: 2350, water: 650 },
    { lot: 62, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Daniel Cruz"], status: "active", electricity: 900, water: 250 },
    { lot: 61, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Angela Ramos"], status: "inactive", electricity: 0, water: 0 },
    { lot: 60, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Victor Santos", "Liza Santos"], status: "active", electricity: 1050, water: 280 },
    { lot: 59, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Robert Lim"], status: "active", electricity: 1000, water: 260 },
    { lot: 58, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Elaine Torres"], status: "active", electricity: 950, water: 240 },
    { lot: 57, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Patrick Gomez"], status: "inactive", electricity: 0, water: 0 },
    { lot: 56, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Kimberly Tan"], status: "active", electricity: 1020, water: 270 },
    { lot: 55, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Anthony Rivera"], status: "active", electricity: 980, water: 250 },
    { lot: 54, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Grace Villanueva"], status: "active", electricity: 970, water: 240 },
    { lot: 53, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Henry Castillo"], status: "inactive", electricity: 0, water: 0 },
    { lot: 52, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Megan Flores"], status: "active", electricity: 1010, water: 260 },
    { lot: 51, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Joshua Perez"], status: "active", electricity: 990, water: 250 },
    { lot: 50, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Nicole Bautista"], status: "inactive", electricity: 0, water: 0 },
    { lot: 49, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Adrian Navarro"], status: "active", electricity: 1000, water: 270 },
    { lot: 48, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Samantha Yu"], status: "active", electricity: 970, water: 260 },
    { lot: 47, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Jeffrey Aquino"], status: "inactive", electricity: 0, water: 0 },
    { lot: 46, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Christine Ong"], status: "active", electricity: 980, water: 250 },
    { lot: 45, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Michael Ramos"], status: "active", electricity: 1005, water: 275 },
    { lot: 44, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Andrea Lopez"], status: "inactive", electricity: 0, water: 0 },
    { lot: 43, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Kevin Tan"], status: "active", electricity: 1020, water: 260 },
    { lot: 42, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Patricia Diaz"], status: "active", electricity: 980, water: 250 },
    { lot: 41, block: 18, project: "STO.TOMAS PHASE 1", residents: ["John Paul Reyes"], status: "inactive", electricity: 0, water: 0 },
    { lot: 40, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Isabella Cruz"], status: "active", electricity: 1010, water: 270 },
    { lot: 39, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Marco Alvarez"], status: "active", electricity: 990, water: 250 },
    { lot: 38, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Vanessa Co"], status: "inactive", electricity: 0, water: 0 },
    { lot: 37, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Ralph Santos"], status: "active", electricity: 1005, water: 260 },
    { lot: 36, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Denise Romero"], status: "active", electricity: 1015, water: 270 },
    { lot: 35, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Samuel Lee"], status: "inactive", electricity: 0, water: 0 },
    { lot: 34, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Carla Mendoza"], status: "active", electricity: 1000, water: 260 },
    { lot: 33, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Ethan Garcia"], status: "active", electricity: 990, water: 250 },
    { lot: 32, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Bianca Flores"], status: "inactive", electricity: 0, water: 0 },
    { lot: 31, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Noah Torres"], status: "active", electricity: 1020, water: 270 },
    { lot: 30, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Olivia Reyes"], status: "active", electricity: 1010, water: 260 },
    { lot: 29, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Lucas Tan"], status: "inactive", electricity: 0, water: 0 },
    { lot: 28, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Ava Lim"], status: "active", electricity: 980, water: 250 },
    { lot: 27, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Gabriel Ramos"], status: "active", electricity: 1005, water: 260 },
    { lot: 26, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Sophia Cruz"], status: "inactive", electricity: 0, water: 0 },
    { lot: 25, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Nathan Perez"], status: "active", electricity: 1010, water: 270 },
    { lot: 24, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Chloe Santos"], status: "active", electricity: 980, water: 250 },
    { lot: 23, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Julian Navarro"], status: "inactive", electricity: 0, water: 0 },
    { lot: 22, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Ella Bautista"], status: "active", electricity: 1000, water: 260 },
    { lot: 21, block: 18, project: "STO.TOMAS PHASE 1", residents: ["David Yu"], status: "active", electricity: 1015, water: 270 },
    { lot: 20, block: 18, project: "STO.TOMAS PHASE 1", residents: ["Zoe Castillo"], status: "inactive", electricity: 0, water: 0 },


    // ==========================================
    // RANCHO IMPERIAL - TEST DATA
    // ==========================================

    // Block 1 (Standard Numeric)
    { lot: "1", block: "1", project: "Rancho Imperial", residents: ["Juan Dela Cruz"], status: "active", electricity: 1250.50, water: 320.00 },
    { lot: "2", block: "1", project: "Rancho Imperial", residents: ["Maria Clara"], status: "active", electricity: 1400.00, water: 410.25 },
    { lot: "3", block: "1", project: "Rancho Imperial", residents: ["Ricardo Dalisay"], status: "inactive", electricity: 0, water: 0 },
    { lot: "4", block: "1", project: "Rancho Imperial", residents: ["Sisa Crisostomo"], status: "active", electricity: 980.00, water: 210.00 },
    { lot: "10", block: "1", project: "Rancho Imperial", residents: ["Emilio Aguinaldo"], status: "active", electricity: 2100.00, water: 550.00 },
    { lot: "20", block: "1", project: "Rancho Imperial", residents: ["Apolinario Mabini"], status: "inactive", electricity: 0, water: 0 },
    { lot: "26", block: "1", project: "Rancho Imperial", residents: ["Melchora Aquino"], status: "active", electricity: 1100.75, water: 290.50 },

    // Block 1b (Alphanumeric String Test)
    { lot: "1", block: "1b", project: "Rancho Imperial", residents: ["Andres Bonifacio"], status: "active", electricity: 1350.00, water: 340.00 },
    { lot: "2", block: "1b", project: "Rancho Imperial", residents: ["Gregoria de Jesus"], status: "active", electricity: 1200.00, water: 310.00 },
    { lot: "3", block: "1b", project: "Rancho Imperial", residents: ["Antonio Luna"], status: "inactive", electricity: 0, water: 0 },
    { lot: "4", block: "1b", project: "Rancho Imperial", residents: ["Jose Rizal"], status: "active", electricity: 1800.50, water: 450.75 },
    { lot: "10", block: "1b", project: "Rancho Imperial", residents: ["Marcelo H. del Pilar"], status: "active", electricity: 1420.00, water: 330.00 },
    { lot: "15", block: "1b", project: "Rancho Imperial", residents: ["Mariano Ponce"], status: "active", electricity: 1150.00, water: 280.00 },
    { lot: "19", block: "1b", project: "Rancho Imperial", residents: ["Galicano Apacible"], status: "inactive", electricity: 0, water: 0 }
  ];

  // ============================
  // NORMALIZATION
  // ============================
  window.residents = rawResidents.map(r => ({
    // REMOVE Number() - Keep them as Strings to support "1b"
    lot: String(r.lot).trim(),
    block: String(r.block).trim(),
    project: r.project || "Unknown",
    residents: Array.isArray(r.residents) ? r.residents : [],
    status: (r.status || "inactive").toLowerCase(),
    electricity: Number(r.electricity) || 0,
    water: Number(r.water) || 0
  }));

})();