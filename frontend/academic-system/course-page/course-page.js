// =========================
// COURSE-PAGE.JS
// Handles ALL levels (100L - 500L)
// =========================

(function () {

const API_BASE =
"http://127.0.0.1:5000/api/upload";

function normalizeCategory(category) {

    if (!category) return "";

    const c = category.toLowerCase();

    if (c.includes("past")) return "past questions";
    if (c.includes("material")) return "material";
    if (c.includes("assignment")) return "assignment";
    if (c.includes("project")) return "project";
    if (c.includes("report")) return "report";

    return c;
}

    // Get course code from URL
    function getCourseCodeFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get("course");
    }

    // Find course across all levels
    function findCourse(courseCode) {
        // Define all possible data sources
        const dataSources = [
            { name: '100L', data: window.courseData100L },
            { name: '200L', data: window.courseData200L },
            { name: '300L', data: window.courseData300L },
            { name: '400L', data: window.courseData400L },
            { name: '500L', data: window.courseData500L }
        ];
        
        for (const source of dataSources) {
            if (source.data) {
                // Check first semester
                if (source.data.firstSemester && source.data.firstSemester[courseCode]) {
                    console.log(`✅ Course found in ${source.name} (First Semester)`);
                    return source.data.firstSemester[courseCode];
                }
                // Check second semester
                if (source.data.secondSemester && source.data.secondSemester[courseCode]) {
                    console.log(`✅ Course found in ${source.name} (Second Semester)`);
                    return source.data.secondSemester[courseCode];
                }
            }
        }
        
        console.error(`❌ Course ${courseCode} not found in any data source`);
        return null;
    }

    // Render hero section
    function renderHero(course) {
        const titleElement = document.querySelector(".course-title-large");
        const metaElement = document.querySelector(".course-meta");
        
        if (!titleElement || !metaElement) return;
        
        titleElement.textContent = course.hero.title;
        
        metaElement.innerHTML = `
            <span>${escapeHtml(course.hero.code)}</span>
            <span class="meta-divider">•</span>
            <span>${escapeHtml(course.hero.level)}</span>
            <span class="meta-divider">•</span>
            <span>${escapeHtml(course.hero.semester)}</span>
            <span class="meta-divider">•</span>
            <span>${escapeHtml(course.hero.department)}</span>
        `;
    }

    // Render about section
    function renderAbout(course) {
        const aboutElement = document.querySelector(".about-content");
        if (!aboutElement) return;
        
        const about = course.about;
        
        let objectivesHtml = '';
        if (about.objectives && about.objectives.length) {
            objectivesHtml = `
                <h3>📚 Learning Objectives</h3>
                <ul class="objectives-list">
                    ${about.objectives.map(item => `<li><i class="fas fa-check-circle"></i> ${escapeHtml(item)}</li>`).join('')}
                </ul>
            `;
        }
        
        let outlineHtml = '';
        if (about.courseOutline && about.courseOutline.length) {
            outlineHtml = `
                <h3>📖 Course Outline</h3>
                <ul class="outline-list">
                    ${about.courseOutline.map(item => `<li><i class="fas fa-bookmark"></i> ${escapeHtml(item)}</li>`).join('')}
                </ul>
            `;
        }
        
        aboutElement.innerHTML = `
            <p>${escapeHtml(about.description)}</p>
            ${objectivesHtml}
            ${outlineHtml}
            <h3>👨‍🏫 Lecturer</h3>
            <div class="lecturer-card">
                <p><strong>${escapeHtml(about.lecturer.name)}</strong></p>
                <p class="lecturer-dept">${escapeHtml(about.lecturer.department)}</p>
            </div>
        `;
    }

    // Simple escape to prevent XSS
    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Show error message
    function showError(message) {
        const container = document.querySelector('.dashboard');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 4rem 2rem;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: #dc2626; margin-bottom: 1rem;"></i>
                    <h2 style="color: #1e293b;">${escapeHtml(message)}</h2>
                    <p style="color: #64748b; margin-top: 1rem;">Please go back and select a valid course.</p>
                    <button onclick="history.back()" style="margin-top: 2rem; padding: 0.75rem 2rem; background: #2563eb; color: white; border: none; border-radius: 40px; cursor: pointer;">← Go Back</button>
                </div>
            `;
        }
    }

    // Set up filter buttons
    function setupFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const filesContainer = document.getElementById('filesContainer');
        
        if (!filterBtns.length || !filesContainer) return;
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.getAttribute('data-filter');
                filterFiles(filter);
            });
        });
    }
    
    // Filter files
    function filterFiles(filter) {

    const fileCards = document.querySelectorAll('.file-card');

    fileCards.forEach(card => {

        const type = card.getAttribute('data-type');

        if (filter === 'all') {
            card.style.display = 'flex';
            return;
        }

        if (type === filter) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

    // Setup quick action buttons
    function setupQuickActions() {
        const quickBtns = document.querySelectorAll('.quick-btn, .sec-btn');
        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.textContent.trim();
                showToast(`${text} feature coming soon!`);
            });
        });
    }
    
    // Simple toast notification
    function showToast(message) {
        let toast = document.querySelector('.toast-message');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-message';
            document.body.appendChild(toast);
            
            const style = document.createElement('style');
            style.textContent = `
                .toast-message {
                    position: fixed;
                    bottom: 2rem;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #1e293b;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 40px;
                    font-size: 0.875rem;
                    z-index: 1000;
                    opacity: 0;
                    transition: opacity 0.3s;
                    pointer-events: none;
                    white-space: nowrap;
                }
                .toast-message.show {
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
        }
        
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }
    
    
    
    async function fetchFiles(
    courseCode,
    category = "all"
) {

    try {

        const response = await fetch(
            `${API_BASE}/files?course_code=${courseCode}&category=${category}`
        );

        const data = await response.json();

        return data.files || [];

    } catch (error) {

        console.error(error);

        return [];
    }
}


function renderFiles(files) {

    const container = document.getElementById("filesContainer");

    if (!files.length) {
        container.innerHTML = `
            <div class="empty-state">
                No files available for this course yet.
            </div>
        `;
        return;
    }

    container.innerHTML = files.map(file => `

        <div class="file-card" data-type="${normalizeCategory(file.category)}">

            <div class="file-thumb">
                <i class="fas fa-file-alt"></i>
            </div>

            <div class="file-info">

                <div class="file-title">
                    ${file.title}
                </div>

                <div class="file-meta">
                    <span>${file.category}</span>
                    <span>${file.filetype}</span>
                    <span>${file.filesize} MB</span>
                </div>

                <div class="file-desc">
                    ${file.description || ""}
                </div>
                <div class="file-actions">

                    <button
                        class="view-btn"
                        onclick="viewFile(${file.id})">

                        <i class="fas fa-eye"></i>
                        View

                    </button>

                    <button
                        class="download-btn"
                        onclick="downloadFile(${file.id})">

                        <i class="fas fa-download"></i>
                        Download

                    </button>

                </div>

            </div>

        </div>

    `).join("");
}

window.downloadFile = async function(fileId, fileTitle = "File") {

    try {

        // =========================
        // SHOW LOADING FEEDBACK
        // =========================
        showToast(`⬇️ Downloading "${fileTitle}"...`);

        // =========================
        // TRIGGER DOWNLOAD
        // =========================
        const url = `${API_BASE}/download/${fileId}`;

        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.click();

        // =========================
        // SUCCESS FEEDBACK
        // =========================
        setTimeout(() => {
            showToast(`✅ Download started: "${fileTitle}"`);
        }, 800);

    } catch (error) {

        console.error(error);
        showToast(`❌ Failed to download "${fileTitle}"`);
    }
};


window.viewFile = function(fileId) {

    window.open(
        `${API_BASE}/view/${fileId}`,
        "_blank"
    );

};
    


// =========================
// NAVIGATE TO SPECIFIC SEARCH PAGE
// =========================
function setupSearchNavigation(courseCode) {

    document
        .getElementById("pastQuestionsBtn")
        ?.addEventListener("click", () => {

            window.location.href =
                `../search-engine/specific-search/past-questions/past-questions.html?course=${courseCode}`;

        });


    document
        .getElementById("assignmentBtn")
        ?.addEventListener("click", () => {

            window.location.href =
                `../search-engine/specific-search/assignments/assignments.html?course=${courseCode}`;

        });


    document
        .getElementById("reportBtn")
        ?.addEventListener("click", () => {

            window.location.href =
                `../search-engine/specific-search/reports/reports.html?course=${courseCode}`;

        });


    document
        .getElementById("materialBtn")
        ?.addEventListener("click", () => {

            window.location.href =
                `../search-engine/specific-search/materials/materials.html?course=${courseCode}`;

        });


    document
        .getElementById("projectBtn")
        ?.addEventListener("click", () => {

            window.location.href =
                `../search-engine/specific-search/projects/projects.html?course=${courseCode}`;

        });

}



    // Initialize page
    async function init() {

    const courseCode = getCourseCodeFromURL();

    if (!courseCode) {
        showError("No course specified.");
        return;
    }

    console.log(`Looking for course: ${courseCode}`);

    const course = findCourse(courseCode);

    if (!course) {
        showError(`Course "${courseCode}" not found.`);
        return;
    }

    // =========================
    // STATIC COURSE DATA
    // =========================
    renderHero(course);
    renderAbout(course);
    
    setupSearchNavigation(courseCode);
    // =========================
    // DYNAMIC FILES FROM BACKEND
    // =========================
    const files = await fetchFiles(courseCode);

    renderFiles(files);

    // =========================
    // UI SETUP
    // =========================
    setupFilters();
    setupQuickActions();

    // =========================
    // PAGE TITLE
    // =========================
    document.title =
        `${course.hero.code} - ${course.hero.title} | MECHCONNECT`;
}
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();