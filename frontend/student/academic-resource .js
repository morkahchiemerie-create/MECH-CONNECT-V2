
const display = document.querySelector('.display');
const courses = document.querySelectorAll('.courseCode');
let currentSemester = null;

/* Toggle semesters when level is clicked */
function toggleSemester(levelDiv){
const semesterList = levelDiv.nextElementSibling;
console.log(semesterList);
document.querySelectorAll('.semesters').forEach(sem => {
if(sem !== semesterList) sem.classList.remove('active');
});
semesterList.classList.toggle('active');
}


/* For 100L–300L */
function clickSemester(index){
  const items = courses[index].querySelectorAll('li a');
  display.innerHTML = '';
  items.forEach(link => {
    const card = document.createElement('div');
    card.className = 'course-card';
    const newLink = link.cloneNode(true);
    card.appendChild(newLink);
    display.appendChild(card);
  });
}

/* For 400L & 500L */
