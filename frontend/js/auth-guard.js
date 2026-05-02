// ===============================
// MECHCONNECT AUTH GUARD (STEP 20)
// ===============================

// Get logged-in user from localStorage
const user = JSON.parse(localStorage.getItem("user"));

// Detect current page path
const path = window.location.pathname;

// ===============================
// 1. CHECK IF USER IS LOGGED IN
// ===============================
if (!user) {
    alert("You are not logged in");
    window.location.href = "/index.html";
}

// ===============================
// 2. ROLE-BASED PROTECTION
// ===============================

// STUDENT PAGES PROTECTION
if (path.includes("/student/")) {
    if (user.role !== "student") {
        alert("Unauthorized access (Student only)");
        window.location.href = "/index.html";
    }
}

// LECTURER PAGES PROTECTION
if (path.includes("/lecturer/")) {
    if (user.role !== "lecturer") {
        alert("Unauthorized access (Lecturer only)");
        window.location.href = "/index.html";
    }
}