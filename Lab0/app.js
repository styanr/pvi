const studentsTable = document.getElementById("students-table");
const buttonWrapper = document.getElementById("button-wrapper");
const pages = this.document.getElementById("pages");

let listHidden = false;
const savedPos = pages.getBoundingClientRect();
const navPos = document.getElementById("main-nav").getBoundingClientRect();
const bottomPos = savedPos.bottom - navPos.bottom;
window.addEventListener("scroll", function () {
    const rect = pages.getBoundingClientRect();
    console.log(this.scrollY, savedPos.bottom - navPos.bottom);
    console.log(window.matchMedia('(max-width: 720px)').matches, window.screen.width);
    console.log(this.scrollY > bottomPos, window.matchMedia('(min-width: 720px)').matches)
    if (this.scrollY > bottomPos && window.matchMedia('(min-width: 720px)').matches) {
        pages.parentNode.style.display = "none";
        listHidden = true;
    }
    else if (listHidden) {
        pages.parentNode.style.position = "";
        pages.parentNode.style.display = "";
        listHidden = false;
    }
})

const Buttons = {
    Cancel: 0,
    OK: 1,
}

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
    newIndicator.className = "green-dot";
    newRow.cells[5].appendChild(newIndicator);
    newRow.cells[6].appendChild(buttonWrapper.cloneNode(true));
}

function deleteStudent(element) {
    const thisRow = element.parentNode.parentNode.parentNode;
    const thisBody = thisRow.parentNode;
    const thisName = thisRow.cells[2].textContent;
    const buttonList = createPopup("Removing " + thisName, `Are you sure you want to remove ${thisName}?`, [Buttons.OK, Buttons.Cancel]);
    for (const button of buttonList) {
        console.log(button.role);
        if (button.role == Buttons.OK) {
            button.addEventListener("click", function () {
                thisBody.removeChild(thisRow);
            })
        }
    }
}

function showDot() {
    let notif = document.getElementById("notif");
    notif.className = "notif";
}


const overlay = document.getElementById("overlay");


function createPopup(title, content, buttonRoleList) {
    const buttonList = [];
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

    for (const btnVal of buttonRoleList) {
        const button = document.createElement("button");
        button.classList.add("btn");
        console.log(btnVal, Buttons.OK);
        if (btnVal == Buttons.OK) {
            button.classList.add("btn-outline-success", "mx-1");
            button.role = Buttons.OK;
            button.textContent = "OK";
        }
        else if (btnVal == Buttons.Cancel) {
            button.classList.add("btn-outline-danger", "mx-1");
            button.role = Buttons.Cancel;
            button.textContent = "Cancel";
        }
        buttonList.push(button);
        button.addEventListener("click", closePopup);
        buttonsContainer.appendChild(button);
    }
    notificationWindow.appendChild(buttonsContainer);
    setTimeout(function () {
        overlay.classList.remove("hidden");
    }, 100)
    overlay.hidden = false;
    return buttonList;
}

let timer = null;

function showNotifications() {
    timer = setTimeout(function () {
        createPopup("Notifications", "You have 1345 new notifications.", [Buttons.OK]);
    }, 1000)
}

function clearTimer() {
    console.log("timer cleared");
    if (overlay.hidden) {
        overlay.innerHTML = "";
    }
    clearTimeout(timer);
}

function closePopup() {
    overlay.innerHTML = "";
    overlay.classList.add("hidden");
    setTimeout(function () {
        overlay.hidden = true;
    }, 100)
}