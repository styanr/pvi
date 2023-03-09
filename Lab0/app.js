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

function showDot() {
    let notif = document.getElementById("notif");
    notif.className = "notif";
}

const Buttons = {
    OK: 0,
    Cancel: 1
}

const overlay = document.getElementById("overlay");

function createPopup(title, content, buttonsList) {
    const notificationWindow = document.createElement("div");
    notificationWindow.className = "alerts";

    const notificationHeading = document.createElement("h2");
    notificationHeading.textContent = title;
    notificationWindow.appendChild(notificationHeading);

    const notificationContent = document.createElement("p");
    notificationContent.textContent = content;
    notificationWindow.appendChild(notificationContent);

    overlay.appendChild(notificationWindow);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "buttons";

    for (const btnVal in buttonsList) {
        const button = document.createElement("button");
        button.classList.add("btn");
        console.log(buttonsList)
        console.log(btnVal, Buttons.OK);
        if (btnVal == Buttons.OK) {
            button.classList.add("btn-outline-success", "mx-1");
            button.textContent = "OK";
            button.onclick = closePopup;
        }
        else if (btnVal == Buttons.Cancel) {
            button.classList.add("btn-outline-danger", "mx-1");
            button.textContent = "Cancel";
            button.onclick = closePopup;
        }
        buttonsContainer.appendChild(button);
    }
    notificationWindow.appendChild(buttonsContainer);
}

let timer = null;
function showNotifications() {
    timer = setTimeout(function () {
        overlay.hidden = false;
        setTimeout(function () {
            createPopup("Notifications", "You have 5 new notifications", [Buttons.OK]);
            overlay.classList.remove("hidden");
        }, 100)
    }, 1000)
}

function clearTimer() {
    console.log("timer cleared");
    overlay.innerHTML = "";
    clearTimeout(timer);
}

function closePopup(e) {
    const button = e.target;
    console.log(returnVal);
    button.parentNode.parentNode.remove();
    overlay.classList.add("hidden");
    setTimeout(function () {
        overlay.hidden = true;
    }, 100)
}