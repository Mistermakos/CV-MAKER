const dropArea = document.getElementById("drop-area");
const inputFile = document.getElementById("input-file");

inputFile.addEventListener("change", uploadImage);

function uploadImage() {
  let imgLink = URL.createObjectURL(inputFile.files[0]); // da tego file'a ktory jest zuploadowany i zamieni go na URL
  dropArea.style.backgroundImage = `url(${imgLink})`;
  dropArea.textContent = "";
  dropArea.style.border = 0;
  dropArea.style.width = "134px !important";
}

dropArea.addEventListener("dragover", function (e) {
  e.preventDefault(); // usuwa defaultowy event, ze po przeciagnieciu zdjecie otwiera mi sie w nowej karcie
});
dropArea.addEventListener("drop", function (e) {
  e.preventDefault(); // usuwa defaultowy event, ze po przeciagnieciu zdjecie otwiera mi sie w nowej karcie
  inputFile.files = e.dataTransfer.files; // file zostaje przetransportowany do inputFile
  uploadImage();
});

let i = 1;
function addEmployment() {
  document.querySelector(
    "#box-emp"
  ).innerHTML += `<div id="employment"><div id="company">
    <h2>Jobs</h2>
    <span id="company-span">Company</span>
    <input type="text" name="CompanyName${i}" placeholder="Enter company name" >
    <span id="company-span">Job title</span>
    <input type="text" name="JobTitle${i}" placeholder="Enter job title">
</div>
<div id="start-end-date">
    <span id="company-span">Start date</span>
    <input type="date" name="StartingDate${i}">
    <span id="company-span">End date</span>
    <input type="date" name="EndingDate${i}">
</div>
<div id="responsibilities">
    <span id="company-span">Responsibilities</span>
    <textarea cols="30" rows="10" name="Responsibilities${i}"></textarea>
</div></div>`;
  i++;
}
