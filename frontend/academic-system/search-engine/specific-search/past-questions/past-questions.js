// =========================
// GET COURSE CODE
// =========================

let currentPage = 1;
const itemsPerPage = 6;
let allFiles = [];
let filteredFiles = [];


const params = new URLSearchParams(
    window.location.search
);

const courseCode =
    params.get("course");

const API_BASE =
"http://127.0.0.1:5000/api/upload";


async function fetchPastQuestions() {
    try {
        const response = await fetch(
            `${API_BASE}/files?course_code=${courseCode}&category=Past Questions`
        );
        const data = await response.json();
        return data.files || [];
    }
    catch(error) {
        console.error(error);
        return [];

    }
}



function renderPastQuestions(files) {

    const container =
        document.getElementById(
            "resultsContainer"
        );

    if (files.length === 0) {

    container.innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">

                📂

            </div>

            <h2>

                No Past Questions Found

            </h2>

            <p>

                Try another keyword, year, or course.

            </p>

        </div>

    `;

    document.getElementById(
        "resultsCount"
    ).textContent =
        "Showing 0 files";

    return;
}

    container.innerHTML = files.map(file => `

        <div class="file-card">

            <div class="file-info">

                <h3>
                    📄 ${file.title}
                </h3>

                <p>
                    ${file.description || ""}
                </p>

                <div class="file-meta">

                    <span>
                        Type: ${file.filetype}
                    </span>

                    <span>
                        Size: ${file.filesize} MB
                    </span>

                    <span>
                        Downloads: ${file.downloads}
                    </span>

                    <span>
                        Uploaded:
                        ${file.upload_date}
                    </span>

                </div>

                <div class="file-actions">

                    <button
                        class="view-btn"
                        onclick="viewFile(${file.id})">

                        👁 View

                    </button>

                    <button
                        class="download-btn"
                        onclick="downloadFile(${file.id})">

                        ⬇ Download

                    </button>

                </div>

            </div>

        </div>

    `).join("");

}



window.viewFile = function(fileId) {

    window.open(
        `${API_BASE}/view/${fileId}`,
        "_blank"
    );

}


window.downloadFile = function(fileId) {

    window.open(
        `${API_BASE}/download/${fileId}`,
        "_blank"
    );

}

function searchFiles(keyword) {

    keyword = keyword.toLowerCase();

    const filteredFiles = allFiles.filter(file =>

        file.title.toLowerCase().includes(keyword)

        ||

        (file.description || "")
        .toLowerCase()
        .includes(keyword)

    );

    renderPastQuestions(filteredFiles);

    document.getElementById(
        "resultsCount"
    ).textContent =
        `Showing ${filteredFiles.length} files`;

}


function sortFiles(sortType) {
    currentPage = 1;
    updateUI();
}


function populateYearFilter() {

    const yearFilter =
        document.getElementById(
            "yearFilter"
        );

    // Get years from file titles
    const years = new Set();

    allFiles.forEach(file => {

        const match =
            file.title.match(/\b(20\d{2})\b/);

        if (match) {

            years.add(match[1]);

        }

    });

    // Sort descending
    const sortedYears =
        [...years].sort((a, b) => b - a);

    sortedYears.forEach(year => {

        yearFilter.innerHTML += `

            <option value="${year}">
                ${year}
            </option>

        `;

    });

}


function filterByYear(year) {

    if (year === "all") {
        filteredFiles = [...allFiles];
    } else {
        filteredFiles = allFiles.filter(file =>
            file.title.includes(year)
        );
    }

    currentPage = 1;

    updateUI();
}





function paginate(files, page = 1) {

    const start =
        (page - 1) * itemsPerPage;

    const end =
        start + itemsPerPage;

    return files.slice(start, end);
}

function renderPagination(files) {

    const container =
        document.getElementById("resultsContainer");

    const totalPages =
        Math.ceil(files.length / itemsPerPage);

    if (totalPages <= 1) return;

    const paginationHTML = `

        <div class="pagination">

            <button onclick="changePage(${currentPage - 1})"
                ${currentPage === 1 ? "disabled" : ""}>

                Prev

            </button>


            <span>

                Page ${currentPage} of ${totalPages}

            </span>


            <button onclick="changePage(${currentPage + 1})"
                ${currentPage === totalPages ? "disabled" : ""}>

                Next

            </button>

        </div>

    `;

    container.innerHTML += paginationHTML;
}




function updateUI() {

    let data = [...filteredFiles];

    const sortType =
        document.getElementById("sortFilter").value;

    data = applySort(data, sortType);

    const paginated =
        paginate(data, currentPage);

    renderPastQuestions(paginated);

    document.getElementById("resultsCount")
        .textContent =
        `Showing ${data.length} files`;

    renderPagination(data);
}


function applySort(data, sortType) {

    let sorted = [...data];

    switch (sortType) {

        case "newest":
            sorted.sort((a, b) =>
                new Date(b.upload_date) -
                new Date(a.upload_date)
            );
            break;

        case "oldest":
            sorted.sort((a, b) =>
                new Date(a.upload_date) -
                new Date(b.upload_date)
            );
            break;

        case "az":
            sorted.sort((a, b) =>
                a.title.localeCompare(b.title)
            );
            break;

        case "za":
            sorted.sort((a, b) =>
                b.title.localeCompare(a.title)
            );
            break;

        case "largest":
            sorted.sort((a, b) =>
                b.filesize - a.filesize
            );
            break;

        case "smallest":
            sorted.sort((a, b) =>
                a.filesize - b.filesize
            );
            break;

        case "downloads":
            sorted.sort((a, b) =>
                b.downloads - a.downloads
            );
            break;
    }

    return sorted;
}

function searchFiles(keyword) {

    keyword = keyword.toLowerCase();

    filteredFiles = allFiles.filter(file =>
        file.title.toLowerCase().includes(keyword) ||
        (file.description || "")
            .toLowerCase()
            .includes(keyword)
    );

    currentPage = 1;

    updateUI();
}





// =========================
// SHOW COURSE CODE
// =========================
document.getElementById(
    "courseCode"
).textContent =
    `Course: ${courseCode}`;



    window.changePage = function(page) {

    const totalPages =
        Math.ceil(filteredFiles.length / itemsPerPage);

    if (page < 1 || page > totalPages) return;

    currentPage = page;

    updateUI();
};


async function init() {

   allFiles = await fetchPastQuestions();

filteredFiles = [...allFiles];

currentPage = 1;

populateYearFilter();

updateUI();

    // =========================
    // INITIAL COUNT
    // =========================
    document.getElementById("resultsCount")
        .textContent =
        `Showing ${allFiles.length} files`;

    // =========================
    // SEARCH
    // =========================
    document.getElementById("searchInput")
        .addEventListener("input", function () {
            searchFiles(this.value);
        });

    // =========================
    // SORT
    // =========================
    document.getElementById("sortFilter")
        .addEventListener("change", function () {
            sortFiles(this.value);
        });

    // =========================
    // YEAR FILTER
    // =========================
    document.getElementById("yearFilter")
        .addEventListener("change", function () {
            filterByYear(this.value);
        });
}

init();
