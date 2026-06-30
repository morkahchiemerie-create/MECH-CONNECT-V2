const categoryButtons = document.querySelectorAll('.category-btn');
const selectedText = document.getElementById('selectedText');
const mobileCategory = document.getElementById('mobileCategory');

const levelSelect = document.getElementById('levelSelect');
const optionSelect = document.getElementById('optionSelect');

const dragArea = document.getElementById('dragArea');
const fileInput = document.getElementById('fileInput');
const chooseBtn = document.getElementById('chooseBtn');
const filePreview = document.getElementById('filePreview');

const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

const uploadBtn = document.querySelector('.upload-btn');

const resourceTitle = document.querySelector('input[placeholder="Machine Design Assignment"]');
const courseCode = document.querySelector('input[placeholder="MEE 301"]');
const semesterSelect = document.getElementById('semesterSelect');
const mediaTypeSelect = document.querySelector('.media-type-section select');

const uploadDate = document.querySelector('input[type="date"]');

let selectedFile = null;

/* =========================
   CATEGORY HANDLING
========================= */

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedText.textContent = button.textContent;
    });
});

mobileCategory.addEventListener('change', () => {
    selectedText.textContent = mobileCategory.value;
});

/* =========================
   LEVEL → OPTION LOGIC
========================= */

levelSelect.addEventListener('change', () => {
    const level = levelSelect.value;

    if (level === '400L' || level === '500L') {
        optionSelect.disabled = false;
    } else {
        optionSelect.disabled = true;
        optionSelect.value = '';
    }
});

/* =========================
   FILE PICKER
========================= */

chooseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
});

dragArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) validateAndPreviewFile(file);
});

/* DRAG EVENTS */
dragArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragArea.style.borderColor = '#2563eb';
});

dragArea.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) validateAndPreviewFile(file);
});

/* =========================
   FILE VALIDATION
========================= */

function validateAndPreviewFile(file) {

    const mediaType = mediaTypeSelect.value;

    const imageTypes = ['image/png','image/jpeg','image/jpg','image/webp'];
    const videoTypes = ['video/mp4','video/mov','video/mkv'];

    let valid = false;

    if (mediaType === 'Image') {
        valid = imageTypes.includes(file.type);
    }

    if (mediaType === 'Video') {
        valid = videoTypes.includes(file.type);
    }

    if (mediaType === 'File') {
        valid = true;
    }

    if (!valid) {
        alert(`Invalid ${mediaType} selected.`);
        return;
    }

    selectedFile = file;
    showPreview(file);
}

/* =========================
   FILE PREVIEW
========================= */

function showPreview(file) {

    const fileURL = URL.createObjectURL(file);

    if (file.type.startsWith('image/')) {
        filePreview.innerHTML = `
            <img src="${fileURL}" class="preview-image">
            <h3>${file.name}</h3>
        `;
    }
    else if (file.type.startsWith('video/')) {
        filePreview.innerHTML = `
            <video controls class="preview-video">
                <source src="${fileURL}">
            </video>
            <h3>${file.name}</h3>
        `;
    }
    else {
        filePreview.innerHTML = `
            <div class="file-card">
                <div class="file-icon">📄</div>
                <div>
                    <h3>${file.name}</h3>
                    <p>${(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
            </div>
        `;
    }
}

/* =========================
   FORM VALIDATION
========================= */

function validateForm() {

    if (resourceTitle.value.trim() === '') return alert('Title required'), false;
    if (courseCode.value.trim() === '') return alert('Course code required'), false;
    if (levelSelect.value === '') return alert('Level required'), false;
    if (semesterSelect.value === '') return alert('Semester required'), false;
    if (!uploadDate.value) return alert('Upload date required'), false;
    if ((levelSelect.value === '400L' || levelSelect.value === '500L') && optionSelect.value === '')
        return alert('Select option'), false;
    if (!selectedFile) return alert('Select file'), false;

    return true;
}

/* =========================
   UPLOAD BUTTON
========================= */

uploadBtn.addEventListener('click', () => {

    if (!validateForm()) return;

    uploadToBackend();
});

/* =========================
   REAL BACKEND UPLOAD
========================= */

function uploadToBackend() {

    const formData = new FormData();

    formData.append("title", resourceTitle.value);
    formData.append("category", selectedText.textContent);
    formData.append("media_type", mediaTypeSelect.value);

    formData.append("level", levelSelect.value);
    formData.append("semester", semesterSelect.value);
    formData.append("specialization", optionSelect.value);
    formData.append("course_code", courseCode.value);

    formData.append("upload_date", uploadDate.value);

    formData.append("description", "");

    formData.append("file", selectedFile);

    /* PROGRESS UI */
    progressContainer.style.display = 'block';
    progressText.style.display = 'block';

    let progress = 0;
    progressBar.style.width = '0%';

    const interval = setInterval(() => {
        if (progress < 90) {
            progress += 5;
            progressBar.style.width = progress + '%';
            progressText.textContent = `Uploading... ${progress}%`;
        }
    }, 100);

    fetch("http://127.0.0.1:5000/api/upload/upload", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {

        clearInterval(interval);

        progressBar.style.width = '100%';
        progressText.textContent = data.message || data.error;

    })
    .catch(err => {

        clearInterval(interval);

        progressText.textContent = "Upload failed";
        console.log(err);
    });
}