

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
    
    // ----portal script 
    function goProspective() {
        window.location.href = "dashboard.html"; 
        // Change to your real prospective student URL
    }

    function showLogin(type) {
        let loginBox = document.getElementById("loginBox");
        let title = document.getElementById("loginTitle");
        let userField = document.getElementById("userField");

        if (type === "current") {
            title.innerHTML = "Current Student Login";
            userField.placeholder = "Email or Matric Number";
        } else {
            title.innerHTML = "Lecturer Login";
            userField.placeholder = "Email or Staff ID";
        }

        loginBox.style.display = "block";  
    }



