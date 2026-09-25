// Logout button event listener
if (logoutBtn) {
    logoutBtn.addEventListener("click", function (event) {
        if (!confirm("Are you sure you want to logout?")) {
            event.preventDefault();
        } else {
            window.location.href = "login.html";
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    loadPatients();

    const addNewPatientBtn = document.getElementById("addNewPatientBtn");
    const registerPatientModal = document.getElementById("registerPatientModal");
    const closeRegisterPatientModal = document.getElementById("closeRegisterPatientModal");

    addNewPatientBtn.addEventListener("click", function () {
        registerPatientModal.style.display = "block";
    });

    closeRegisterPatientModal.addEventListener("click", function () {
        registerPatientModal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === registerPatientModal) {
            registerPatientModal.style.display = "none";
        }
    });
});

// Function to load patients from localStorage
function loadPatients() {
    let storedPatients = JSON.parse(localStorage.getItem("patients")) || [];
    const table = document.querySelector("#patientsTable tbody");
    if (!table) return;
    table.innerHTML = "";
    storedPatients.forEach(patient => addPatientToTable(patient, false));
}

// Function to generate a unique Patient ID
function generateUniquePatientId() {
    let existingIds = new Set((JSON.parse(localStorage.getItem("patients")) || []).map(p => p.id));
    let newId;
    do {
        newId = Math.floor(Math.random() * 100000);
    } while (existingIds.has(newId));
    return newId;
}

// Function to add a patient to the table
function addPatientToTable(patient, saveToStorage = true) {
    const table = document.querySelector("#patientsTable tbody");
    if (!table) return;
    
    const newRow = table.insertRow();
    newRow.innerHTML = `
        <td>${patient.id}</td>
        <td contenteditable="false">${patient.name}</td>
        <td contenteditable="false">${patient.age}</td>
        <td contenteditable="false">${patient.identification}</td> 
        <td contenteditable="false">${patient.dob}</td>
        <td contenteditable="false">${patient.gender}</td>
        <td contenteditable="false">${patient.height}</td>
        <td contenteditable="false">${patient.weight}</td>
        <td contenteditable="false">${patient.address}</td>
        <td contenteditable="false">${patient.postcode}</td>
        <td contenteditable="false">${patient.phone}</td>
        <td contenteditable="false">${patient.email}</td>
        <td>
            <button class="edit-btn">Edit</button>
            <button class="remove-btn">Remove</button>
        </td>
    `;

    newRow.querySelector(".edit-btn").addEventListener("click", function () {
        editPatient(this);
    });
    newRow.querySelector(".remove-btn").addEventListener("click", function () {
        removePatient(this);
    });

    if (saveToStorage) {
        savePatientsToLocalStorage();
    }
}

// Function to handle patient registration
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const newPatient = {
            id: generateUniquePatientId(),
            name: document.getElementById("name").value,
            age: document.getElementById("age").value,
            identification: document.getElementById("identification").value,
            dob: document.getElementById("dob").value,
            gender: document.getElementById("gender").value,
            height: document.getElementById("height").value,
            weight: document.getElementById("weight").value,
            address: document.getElementById("address").value,
            postcode: document.getElementById("postcode").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
        };

        let storedPatients = JSON.parse(localStorage.getItem("patients")) || [];
        storedPatients.push(newPatient);
        localStorage.setItem("patients", JSON.stringify(storedPatients));

        addPatientToTable(newPatient);
        alert("Patient registered successfully!");
        this.reset();
        document.getElementById("registerPatientModal").style.display = "none"; // Close the modal after registration
    });
}

// Function to save patients to localStorage
function savePatientsToLocalStorage() {
    let patients = [];
    document.querySelectorAll("#patientsTable tbody tr").forEach(row => {
        patients.push({
            id: row.cells[0].textContent,
            name: row.cells[1].textContent,
            age: row.cells[2].textContent,
            identification: row.cells[3].textContent,
            dob: row.cells[4].textContent,
            gender: row.cells[5].textContent,
            height: row.cells[6].textContent,
            weight: row.cells[7].textContent,
            address: row.cells[8].textContent,
            postcode: row.cells[9].textContent,
            phone: row.cells[10].textContent,
            email: row.cells[11].textContent,
        });
    });
    localStorage.setItem("patients", JSON.stringify(patients));
}

// Function to edit patient details
function editPatient(button) {
    let row = button.closest("tr");
    let cells = row.querySelectorAll("td:not(:first-child):not(:last-child)");

    if (button.textContent === "Edit") {
        cells.forEach(cell => {
            cell.setAttribute("contenteditable", "true");
            cell.style.backgroundColor = "#fff8e1";
        });
        button.textContent = "Save";
    } else {
        cells.forEach(cell => {
            cell.setAttribute("contenteditable", "false");
            cell.style.backgroundColor = "";
        });
        button.textContent = "Edit";
        savePatientsToLocalStorage();
        alert("Patient details updated successfully!");
    }
}

// Function to remove a patient
function removePatient(button) {
    if (confirm("Are you sure you want to remove this patient?")) {
        let row = button.closest("tr");
        let patientId = row.cells[0].textContent;
        row.remove();
        removePatientFromLocalStorage(patientId);
    }
}

// Function to remove a patient from localStorage and related data
function removePatientFromLocalStorage(patientId) {
    let storedPatients = JSON.parse(localStorage.getItem("patients")) || [];
    storedPatients = storedPatients.filter(patient => patient.id !== patientId);
    localStorage.setItem("patients", JSON.stringify(storedPatients));

    // Remove related admissions
    let admissions = JSON.parse(localStorage.getItem("admissions")) || [];
    admissions = admissions.filter(admission => admission.patientId !== patientId);
    localStorage.setItem("admissions", JSON.stringify(admissions));

    // Remove related appointments
    let appointments = JSON.parse(localStorage.getItem("appointments")) || {};
    for (let weekKey in appointments) {
        appointments[weekKey] = appointments[weekKey].filter(appointment => appointment.patientId !== patientId);
        if (appointments[weekKey].length === 0) {
            delete appointments[weekKey];
        }
    }
    localStorage.setItem("appointments", JSON.stringify(appointments));

    // Remove related claims
    let claims = JSON.parse(localStorage.getItem("claims")) || [];
    claims = claims.filter(claim => claim.patientId !== patientId);
    localStorage.setItem("claims", JSON.stringify(claims));

    // Remove related medical reports
    let reports = JSON.parse(localStorage.getItem("reports")) || [];
    reports = reports.filter(report => report.patientID !== patientId);
    localStorage.setItem("reports", JSON.stringify(reports));
}