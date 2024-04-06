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



