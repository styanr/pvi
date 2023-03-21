const studentsTable = document.getElementById("students-table");
const buttonWrapper = document.getElementById("button-wrapper");
const pages = this.document.getElementById("pages");
const mainNav = document.getElementById("main-nav");

let listHidden = false;
const savedPos = pages.getBoundingClientRect();
const navPos = mainNav.getBoundingClientRect();
const pagesStyle = getComputedStyle(pages);
const bottomPos = pages.offsetHeight - parseFloat(getComputedStyle(pages).getPropertyValue("padding-bottom"));
console.log(savedPos.bottom);
let lastScroll = 0;
window.addEventListener("scroll", function () {
    let thisScoll = this.scrollY;
    if (thisScoll > lastScroll) {
        mainNav.style.top = `-${mainNav.offsetHeight}px`;
    }
    else {
        mainNav.style.top = "0";
    }
    lastScroll = thisScoll;
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

function createForm(name) {
    const notificationWindow = createPopup(name, "", []);
    console.log($(notificationWindow).children("h2"));
    $(notificationWindow).children("h2").after(`
    <form>
      <div class="row my-3 g-0">
        <label class="form-label col-xl-3 col-form-label" for="group-select">Group</label>
        <select class="form-select col-xl" id="group-select" required aria-label="Select Group">
          <option value="" selected disabled>Select Group</option>
          <option>KN-21</option>
          <option>PZ-21</option>
          <option>PZ-22</option>    
        </select>
      </div>
      <div class="row mb-3 g-0">
        <label class="form-label col-xl-3 col-form-label" for="name-input">Name</label>
        <input type="text" id="name-input" class="form-control col-xl" required>
      </div>
      <div class="row mb-3 g-0">
        <label class="form-label col-xl-3 col-form-label" for="surname-input">Surname</label>
        <input type="text" id="surname-input" class="form-control col-xl" required>
      </div>
      <div class="row mb-3 g-0">
        <label class="form-label col-xl-3 col-form-label" for="group-select">Gender</label>
        <select class="form-select col-xl" id="gender-select" required aria-label="Select Gender">
          <option value="" selected disabled>Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Non-Binary</option>    
        </select>
      </div>
      <div class="row mb-3 g-0">
        <label class="form-label col-xl-3 col-form-label" for="date-select">Birthday</label>
        <input type="date" id="surname-input" class="form-control col-xl" required>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>

`);
}


$("#add-button").click(function () {
    // const buttonList = createPopup("Add student", "", [Buttons.OK, Buttons.Cancel]);
    // buttonList[0].addEventListener("click", function () {
    //     let newRow = studentsTable.insertRow(-1);
    //     const cellCount = studentsTable.rows[0].cells.length;
    //     for (let i = 0; i < cellCount; i++) {
    //         newRow.insertCell(0);
    //     }
    //     let newInput = document.createElement("input");
    //     newInput.type = "checkbox";
    //     newRow.cells[0].appendChild(newInput);
    //     newRow.cells[1].textContent = "XX-YY";
    //     newRow.cells[2].textContent = "Test Name";
    //     newRow.cells[3].textContent = "NB";
    //     newRow.cells[4].textContent = "01.01.2004";
    //     let newIndicator = document.createElement("div");
    //     newIndicator.className = "green-dot";
    //     newRow.cells[5].appendChild(newIndicator);
    //     newRow.cells[6].appendChild(buttonWrapper.cloneNode(true));
    // })
    createForm("Add student");
});

function deleteStudent(element) {
    const thisRow = element.parentNode.parentNode.parentNode;
    const thisBody = thisRow.parentNode;
    const thisName = thisRow.cells[2].textContent;
    const buttonList = createPopup("Warning", `Are you sure you want to delete user ${thisName} ? `, [Buttons.OK, Buttons.Cancel]);
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
        button.addEventListener("click", closePopup);
        buttonsContainer.appendChild(button);
    }
    notificationWindow.appendChild(buttonsContainer);
    setTimeout(function () {
        overlay.classList.remove("hidden");
    }, 100)
    overlay.hidden = false;
    return notificationWindow;
}

const notifInfo = document.getElementById("notif-info");
const profileInfo = document.getElementById("profile-info");

function showNotifications() {
    notifInfo.hidden = false;
}

function closeInfo() {
    notifInfo.hidden = true;
}

function showProfile() {
    profileInfo.hidden = false;
}

function closeProfile() {
    profileInfo.hidden = true;
}

function closePopup() {
    overlay.innerHTML = "";
    overlay.classList.add("hidden");
    setTimeout(function () {
        overlay.hidden = true;
    }, 100)
}