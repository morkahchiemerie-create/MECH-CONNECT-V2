let allFiles = [];

const API_BASE =
"http://127.0.0.1:5000/api/upload";

async function fetchAllFiles() {

    try {

        const response = await fetch(
            `${API_BASE}/all-files`
        );

        const data = await response.json();

        return data.files || [];

    }

    catch(error) {

        console.error(error);

        return [];

    }

}

function renderResults(files){

    const container =
        document.getElementById(
            "resultsContainer"
        );

    if(files.length === 0){

        container.innerHTML = `

            <div class="empty-state">

                <h2>No files found</h2>

                <p>Try another keyword.</p>

            </div>

        `;

        return;
    }

    container.innerHTML =
    files.map(file => `

        <div class="file-card">

            <h3>

                📄 ${file.title}

            </h3>

            <div class="file-meta">

                <span><strong>Course:</strong> ${file.course_code}</span>

                <span><strong>Category:</strong> ${file.category}</span>

                <span><strong>Type:</strong> ${file.filetype}</span>

                <span><strong>Size:</strong> ${file.filesize} MB</span>

                <span><strong>Downloads:</strong> ${file.downloads}</span>

            </div>

            <p>

                ${file.description || ""}

            </p>

            <div class="file-actions">

                <button
                    onclick="viewFile(${file.id})">

                    👁 View

                </button>

                <button
                    onclick="downloadFile(${file.id})">

                    ⬇ Download

                </button>

            </div>

        </div>

    `).join("");

}


window.viewFile = function(fileId){

    window.open(
        `${API_BASE}/view/${fileId}`,
        "_blank"
    );

}

window.downloadFile = function(fileId){

    window.open(
        `${API_BASE}/download/${fileId}`,
        "_blank"
    );

}


function normalizeKeyword(word){

    word = word.toLowerCase();

    const aliases = {

        "pq":"past questions",
        "past":"past questions",
        "pastquestion":"past questions",
        "pastquestions":"past questions",

        "material":"material",
        "materials":"material",

        "assignment":"assignment",
        "assignments":"assignment",

        "report":"report",
        "reports":"report",

        "doc":"docx",
        "word":"docx",

        "ppt":"pptx",
        "powerpoint":"pptx",

        "pdf":"pdf"

    };

    return aliases[word] || word;

}



function searchFiles(keyword){

    const mode =
        document.getElementById("searchMode").value;

    keyword = keyword
        .toLowerCase()
        .trim();

    // Split search into words
    const keywords =
    keyword
    .split(/\s+/)
    .map(normalizeKeyword);

    const filteredFiles =
        allFiles.filter(file => {

            // Build one searchable string
            const searchableText = (

                (file.course_code || "") + " " +

                (file.title || "") + " " +

                (file.category || "") + " " +

                (file.description || "") + " " +

                (file.filetype || "")

            ).toLowerCase();

            // ALL MODE
            if(mode === "all"){

                return keywords.every(word =>
                    searchableText.includes(word)
                );

            }

            // COURSE CODE
            if(mode === "course_code"){

                return keywords.every(word =>
                    (file.course_code || "")
                    .toLowerCase()
                    .includes(word)
                );

            }

            // TITLE
            if(mode === "title"){

                return keywords.every(word =>
                    (file.title || "")
                    .toLowerCase()
                    .includes(word)
                );

            }

            // CATEGORY
            if(mode === "category"){

                return keywords.every(word =>
                    (file.category || "")
                    .toLowerCase()
                    .includes(word)
                );

            }

            // DESCRIPTION
            if(mode === "description"){

                return keywords.every(word =>
                    (file.description || "")
                    .toLowerCase()
                    .includes(word)
                );

            }

            return false;

        });

    renderResults(filteredFiles);

    document.getElementById(
        "resultsCount"
    ).textContent =
        `Showing ${filteredFiles.length} files`;

}


async function init(){

    allFiles = await fetchAllFiles();

    // ===== READ URL PARAMS (from dashboard injection) =====
    const params = new URLSearchParams(window.location.search);
    const injectedCategory = params.get("category");
    const injectedLevel = params.get("level");

    let results = allFiles;

    if (injectedLevel) {
        results = results.filter(file =>
            (file.level || "").toLowerCase() === injectedLevel.toLowerCase()
        );
    }

    if (injectedCategory) {
        results = results.filter(file =>
            (file.category || "").toLowerCase() === injectedCategory.toLowerCase()
        );

        // Pre-fill search box + mode so the student sees what's active
        document.getElementById("searchMode").value = "category";
        document.getElementById("searchInput").value = injectedCategory;
    }

    // Sort by most recent first
    results = results.sort((a, b) =>
        new Date(b.upload_date) - new Date(a.upload_date)
    );

    renderResults(results);

    document.getElementById("resultsCount").textContent =
        `Showing ${results.length} files`;
}

document
.getElementById("searchMode")
.addEventListener(
    "change",
    function(){

        const keyword =
            document.getElementById(
                "searchInput"
            ).value;

        searchFiles(keyword);

    }
);


document
.getElementById("searchInput")
.addEventListener(
    "input",
    function(){

        searchFiles(this.value);

    }
);


init();