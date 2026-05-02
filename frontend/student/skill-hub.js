

const menu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");

function toggleMenu() {
    menu.classList.toggle("show");
    overlay.classList.toggle("show");
}

// Close menu when clicking overlay
overlay.addEventListener("click", () => {
    menu.classList.remove("show");
    overlay.classList.remove("show");
});


// for mobile mode 


// Dropdown toggles
const toggles = document.querySelectorAll('.dropdown-toggle');
toggles.forEach(toggle => {
    toggle.addEventListener('click', e => {
        e.preventDefault();
        const dropdown = toggle.nextElementSibling;

        document.querySelectorAll('.dropdown-menu.show').forEach(openDropdown => {
            if (openDropdown !== dropdown) {
                openDropdown.classList.remove('show');
            }
        });

        dropdown.classList.toggle('show');
    });
});

// ---- Academic staff
function toggleAcademicStaff() {
      const extras = document.querySelectorAll('#academicCards .extra');
      extras.forEach(card => {
        if(card.style.display === 'none'){
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
      const btn = document.querySelector('.show-more-btn');
      btn.textContent = btn.textContent === '▼ Show More' ? '▲ Show Less' : '▼ Show More';
    }