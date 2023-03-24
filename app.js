
class Student {
    constructor(group, name, surname, gender, birthday, id) {
        this.group = group;
        this.name = name;
        this.surname = surname;
        this.gender = gender;
        this.birthday = birthday;
        this.id = id;
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

function createForm(name, id = -1) {
    id = Number(id);
    const notificationWindow = createPopup(name, "", []);
    $(notificationWindow).children("p").remove();
    $(notificationWindow).children(".buttons").remove();
    const newEditForm = $("#edit-form").clone();
    newEditForm.removeAttr("class");
    $(newEditForm).find(".button-cancel").click(closePopup);
    $(notificationWindow).children("h2").after(newEditForm);

    let action;

    if (id >= 0) {
        action = "edit";
        const thisStudent = students.find((student) => Number(student.id) === Number(id));
        console.log(thisStudent);
        newEditForm.find("#group-select").val(thisStudent.group);
        newEditForm.find("#name-input").val(thisStudent.name);
        newEditForm.find("#surname-input").val(thisStudent.surname);
        newEditForm.find("#gender-select").val(thisStudent.gender);
        newEditForm.find("#date-select").val(thisStudent.birthday);
        newEditForm.submit(function (e) {
            e.preventDefault();
            thisStudent.group = newEditForm.find("#group-select").val();
            thisStudent.name = newEditForm.find("#name-input").val();
            thisStudent.surname = newEditForm.find("#surname-input").val();
            thisStudent.gender = newEditForm.find("#gender-select").val();
            thisStudent.birthday = newEditForm.find("#date-select").val();
            console.log(thisStudent);

            const thisRow = $(`tr[data-id=${thisStudent.id}]`);
            thisRow.find("td:nth-child(2)").text(thisStudent.group);
            thisRow.find("td:nth-child(3)").text(`${thisStudent.name} ${thisStudent.surname}`);
            thisRow.find("td:nth-child(4)").text(thisStudent.gender);
            thisRow.find("td:nth-child(5)").text(thisStudent.birthday);
            const thisStudentAction = {
                action: action,
                student: thisStudent
            };
            console.log(JSON.stringify(thisStudentAction));
            closePopup();
        });
    }
    else {
        action = "add";
        newEditForm.submit(function (e) {
            e.preventDefault();
            const newRow = $("<tr>");
            newRow.append($("<td>").append($("<input>").attr("type", "checkbox")));
            newRow.append($("<td>").text(newEditForm.find("#group-select").val()));
            newRow.append($("<td>").text(`${newEditForm.find("#name-input").val()} ${newEditForm.find("#surname-input").val()}`));
            newRow.append($("<td>").text(newEditForm.find("#gender-select").val()));
            newRow.append($("<td>").text(newEditForm.find("#date-select").val()));
            newRow.append($("<td>").text());
            newRow.append($("<td>").append($("<div>").addClass("green-dot")));
            newRow.append($("<td>").append($("#button-wrapper").clone().removeClass("d-none")));
            const thisStudent = new Student(newEditForm.find("#group-select").val(),
                newEditForm.find("#name-input").val(),
                newEditForm.find("#surname-input").val(),
                newEditForm.find("#gender-select").val(),
                newEditForm.find("#date-select").val(),
                generateUniqueID());
            students.push(thisStudent);
            studentIDs.add(thisStudent.id);
            console.log(thisStudent.id);
            console.log($("#edit-button"));
            console.log(newRow);
            $(newRow).attr("data-id", thisStudent.id);
            $("#students-table > tbody").append(newRow);


            $(newRow).find(".edit-button").click(function () {
                createForm("Edit student", $(this).parent().parent().parent().data("id"));
            })
            $(newRow).find(".delete-button").click(function () {
                deleteStudent($(this).parent().parent().parent().data("id"));
            });
            const thisStudentAction = {
                action: action,
                student: thisStudent
            };
            console.log(JSON.stringify(thisStudentAction));
            closePopup();
        });
    }
}

$("#add-button").on("keydown", function (event) {
    console.log(event);
    if (event.keyCode === 13) {
        event.preventDefault();
    }
});

$("#add-button").click(function () {
    createForm("Add student");
});

function deleteStudent(id) {
    console.log(id);
    const thisStudent = students.find((student) => Number(student.id) === Number(id));
    const notificationWindow = createPopup("Warning", `Are you sure you want to delete user ${thisStudent.name} ? `, [Buttons.OK, Buttons.Cancel]);
    console.log(notificationWindow.find("button"));
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

    const notificationHeading = $("<h2>").text(title);
    notificationWindow.append(notificationHeading);

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