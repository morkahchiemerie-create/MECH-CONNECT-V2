// ===============================
// MECHCONNECT AUTH GUARD
// ===============================

// Get authentication data
const token = localStorage.getItem("access_token");
const user = JSON.parse(localStorage.getItem("user"));

// Current page path
const path = window.location.pathname;

// ===============================
// CHECK LOGIN
// ===============================
if (!token || !user) {
    alert("Please log in first.");

    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    window.location.href = "/index.html";
}

// ===============================
// ROLE PROTECTION
// ===============================

// Student Pages
if (path.includes("/student/")) {

    if (user.role !== "student") {

        alert("Access denied.");

        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        window.location.href = "/index.html";
    }

}

// Lecturer Pages
if (path.includes("/lecturer/")) {

    if (user.role !== "lecturer") {

        alert("Access denied.");

        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        window.location.href = "/index.html";
    }

}