if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(function () {
            console.log('sw registered');
        })
        .catch(function (e) {
            console.log('sw-error:', e);
        });
} else {
    console.error('this browser does not support service workers');
}

class Student {
    constructor(group, name, surname, gender, birthday, id) {
        this.group = group;
        this.name = name;
        this.surname = surname;
        this.gender = gender;
        this.birthday = birthday;
        this.id = id;
    }

    updateFromForm(form) {
        this.group = form.find("#group-select").val();
        this.name = form.find("#name-input").val();
        this.surname = form.find("#surname-input").val();
        this.gender = form.find("#gender-select").val();
        this.birthday = form.find("#date-select").val();
    }
}

const students = [];
const studentIDs = new Set();

const studentsTable = document.getElementById("students-table");
const pages = this.document.getElementById("pages");
const mainNav = document.getElementById("main-nav");

let listHidden = false;
const savedPos = pages.getBoundingClientRect();
const navPos = mainNav.getBoundingClientRect();
const pagesStyle = getComputedStyle(pages);
const bottomPos = pages.offsetHeight - parseFloat((pagesStyle).getPropertyValue("padding-bottom"));
console.log(savedPos.bottom);
let lastScroll = 0;

window.addEventListener("scroll", function () {
    let thisScroll = this.scrollY;
    if (thisScroll > lastScroll) {
        mainNav.style.top = `-${mainNav.offsetHeight}px`;
    } else {
        mainNav.style.top = "0";
    }
    lastScroll = thisScroll;
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

function isAssigned(id) {
    return studentIDs.has(id);
}

function generateUniqueID() {
    let id = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
    while (isAssigned(id)) {
        id = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
    }
    return id;
}

function populateForm(form, student) {
    form.find("#group-select").val(student.group);
    form.find("#name-input").val(student.name);
    form.find("#surname-input").val(student.surname);
    form.find("#gender-select").val(student.gender);
    form.find("#date-select").val(student.birthday);
}

function createRow(student) {
    const newRow = $("<tr>");
    newRow.append($("<td>").append($("<input>").attr("type", "checkbox")));
    for (let i = 0; i < 4; i++) {
        newRow.append($("<td>"));
    }
    newRow.append($("<td>").append($("<div>").addClass("green-dot")));
    newRow.append($("<td>").append($("#button-wrapper").clone().removeClass("d-none")));
    return newRow;
}

function populateRow(row, student) {
    row.find("td:nth-child(2)").text(student.group);
    row.find("td:nth-child(3)").text(`${student.name} ${student.surname}`);
    row.find("td:nth-child(4)").text(student.gender);
    row.find("td:nth-child(5)").text(student.birthday);
}

function logAction(action, student) {
    let thisAction;
    if (action === "delete") {
        thisAction = {
            action: action,
            id: student.id
        };
    } else {
        thisAction = {
            action: action,
            student: student
        };
    }
    console.log(JSON.stringify(thisAction));
}

function createForm(name, id = -1) {
    id = Number(id);
    const notificationWindow = createPopup(name, "", []);
    $(notificationWindow).children("p, .buttons").remove();
    const newEditForm = $("#edit-form").clone();
    newEditForm.removeAttr("class");
    $(newEditForm).find(".button-cancel").click(closePopup);
    $(notificationWindow).children(".heading-wrapper").after(newEditForm);

    let action;
    let selectedStudent;
    if (id >= 0) {
        action = "edit";
        const selectedStudent = students.find((student) => Number(student.id) === Number(id));

        populateForm(newEditForm, selectedStudent);

        newEditForm.submit((e) => {
            e.preventDefault();
            selectedStudent.updateFromForm(newEditForm);
            const thisRow = $(`tr[data-id=${selectedStudent.id}]`);
            populateRow(thisRow, selectedStudent);
            logAction(action, selectedStudent);
            closePopup();
        });
    }
    else {
        action = "add";
        newEditForm.submit((e) => {
            e.preventDefault();
            selectedStudent = new Student();
            selectedStudent.updateFromForm(newEditForm);
            selectedStudent.id = generateUniqueID();

            const newRow = createRow();
            populateRow(newRow, selectedStudent);

            students.push(selectedStudent);
            studentIDs.add(selectedStudent.id);

            $(newRow).attr("data-id", selectedStudent.id);
            $("#students-table > tbody").append(newRow);


            $(newRow).find(".edit-button").click(function () {
                createForm("Edit student", $(this).parent().parent().parent().data("id"));
            })
            $(newRow).find(".delete-button").click(function () {
                deleteStudent($(this).parent().parent().parent().data("id"));
            });
            logAction(action, selectedStudent);
            closePopup();
        });
    }
}

$("#add-button").on("keydown", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
    }
});

$("#add-button").click(function () {
    createForm("Add student");
});

function deleteStudent(id) {
    const thisStudent = students.find((student) => Number(student.id) === Number(id));
    const notificationWindow = createPopup("Warning", `Are you sure you want to delete user ${thisStudent.name}?`, [Buttons.OK, Buttons.Cancel]);
    for (const button of notificationWindow.find("button")) {
        if ($(button).attr("role") == Buttons.OK) {
            button.addEventListener("click", function () {
                $(`tr[data-id=${id}]`).remove();
                students.splice(students.findIndex((student) => Number(student.id) === Number(id)));
                studentIDs.delete(id.toString());
                let action = "delete";
                const thisStudentAction = {
                    action: action,
                    id: thisStudent.id
                };
                console.log(JSON.stringify(thisStudentAction));
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
    const notificationWindow = $("<div>").addClass("alerts");

    const headingWrapper = $("<div>").addClass("heading-wrapper");
    const notificationHeading = $("<h2>").text(title);
    headingWrapper.append(notificationHeading);
    const closeButton = $("<button>").click(closePopup).append($("<i>").addClass("bi bi-x-square"));
    closeButton.append($("<i>").addClass("bi bi-x-square-fill icon-hover")).click(closePopup);
    console.log(closeButton);
    headingWrapper.append(closeButton);
    notificationWindow.append(headingWrapper);

    const notificationContent = $("<p>").text(content);
    notificationWindow.append(notificationContent);

    const buttonsContainer = $("<div>").addClass("buttons");

    for (const btnVal of buttonRoleList) {
        const button = $("<button>").addClass("btn");

        if (btnVal == Buttons.OK) {
            button.addClass("btn-outline-success mx-1").attr("role", Buttons.OK).text("OK");
        } else if (btnVal == Buttons.Cancel) {
            button.addClass("btn-outline-danger mx-1").attr("role", Buttons.Cancel).text("Cancel");
        }

        button.on("click", closePopup);
        buttonsContainer.append(button);
    }
    notificationWindow.append(buttonsContainer);
    $(overlay).append(notificationWindow);
    setTimeout(function () {
        overlay.classList.remove("hidden");
    }, 100);
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