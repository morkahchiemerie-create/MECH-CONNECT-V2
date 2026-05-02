// ================================
// MECHCONNECT - COMPONENTS JS
// Header, Sidebar, Dropdown System
// ================================


// ---- Load Header (if you are using fetch system) ----
function loadHeader() {
    fetch('../components/header.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;

            // Run logic AFTER header loads
            initHeader();
        });
}


// ---- Initialize Header Features ----
function initHeader() {

    const menu = document.getElementById("sideMenu");
    const overlay = document.getElementById("overlay");

    // Toggle menu function
    function toggleMenu() {
        menu.classList.toggle("show");
        overlay.classList.toggle("show");
    }

    // Make accessible from HTML onclick
    window.toggleMenu = toggleMenu;

    // Close menu when overlay clicked
    if (overlay) {
        overlay.addEventListener("click", () => {
            menu.classList.remove("show");
            overlay.classList.remove("show");
        });
    }

    // Dropdown system
    const toggles = document.querySelectorAll('.dropdown-toggle');

    toggles.forEach(toggle => {
        toggle.addEventListener('click', e => {
            e.preventDefault();

            const dropdown = toggle.nextElementSibling;

            document.querySelectorAll('.dropdown-menu.show')
                .forEach(open => {
                    if (open !== dropdown) {
                        open.classList.remove('show');
                    }
                });

            dropdown.classList.toggle('show');
        });
    });
}


// ---- Start system ----
loadHeader();