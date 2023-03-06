const studentsTable = document.getElementById("students-table");
const buttonWrapper = document.getElementById("button-wrapper");

function addStudent() {
    let newRow = studentsTable.insertRow(-1);
    const cellCount = studentsTable.rows[0].cells.length;
    for (let i = 0; i < cellCount; i++) {
        newRow.insertCell(0);
    }
    let newInput = document.createElement("input");
    newInput.type = "checkbox";
    newRow.cells[0].appendChild(newInput);
    newRow.cells[1].textContent = "XX-YY";
    newRow.cells[2].textContent = "Test Name";
    newRow.cells[3].textContent = "NB";
    newRow.cells[4].textContent = "01.01.2004";
    let newIndicator = document.createElement("div");
    newIndicator.className = "green";
    newRow.cells[5].appendChild(newIndicator);
    newRow.cells[6].appendChild(buttonWrapper.cloneNode(true));
}

function deleteStudent(element) {
    let tableBody = element.parentNode.parentNode.parentNode.parentNode;
    tableBody.removeChild(element.parentNode.parentNode.parentNode)
}