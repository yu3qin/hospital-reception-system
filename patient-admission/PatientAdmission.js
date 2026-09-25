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
    setupRoomSelection();
    loadAdmissions(); // Load existing admissions on page load
    loadPatientsDropdown(); // Populate the patient dropdown on page load
    initializeRooms();

    const admissionForm = document.getElementById("admissionForm");
    const roomSection = document.getElementById("roomSection");

    // Hide Room Selection initially
    if (roomSection) {
        roomSection.style.display = "none";
    }

    // Show/hide Room Type & Room Number based on Admission Type
    document.getElementById("admissionType").addEventListener("change", function () {
        if (this.value === "Inpatient") {
            roomSection.style.display = "block";
        } else {
            roomSection.style.display = "none";
        }
    });

    if (admissionForm) {
        admissionForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const patientId = document.getElementById("patientSelect").value; // Dropdown selection
            const patientName = document.getElementById("patientSelect").selectedOptions[0].textContent.split(" (ID:")[0]; // Extract patient name
            const admissionDate = document.getElementById("admissionDate").value;
            const doctorName = document.getElementById("doctorName").value;
            const admissionType = document.getElementById("admissionType").value;
            const roomType = document.getElementById("roomType").value;
            const roomNumber = document.getElementById("roomNumber").value;

            if (!patientId || !admissionDate || !doctorName) {
                alert("Please fill in all required fields.");
                return;
            }

            if (admissionType === "Inpatient" && (!roomType || !roomNumber)) {
                alert("Please select Room Type and Room Number for inpatients.");
                return;
            }

            const newAdmission = {
                patientId,
                patientName,
                admissionDate,
                doctorName,
                admissionType,
                roomType,
                roomNumber
            };

            // Save the admission data to localStorage
            saveAdmission(newAdmission);

            // Update the table with the new admission
            updateTable();

            document.getElementById("admissionForm").reset();
            roomSection.style.display = "none";
        });
    }
});

// Handle Edit and Delete Buttons
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("edit-btn")) {
        const row = event.target.closest("tr");
        const patientId = row.cells[0].innerText;
        const admission = getAdmissionById(patientId);

        if (admission) {
            document.getElementById("patientSelect").value = admission.patientId;
            document.getElementById("admissionDate").value = admission.admissionDate;
            document.getElementById("doctorName").value = admission.doctorName;
            document.getElementById("admissionType").value = admission.admissionType;
            if (admission.admissionType === "Inpatient") {
                document.getElementById("roomType").value = admission.roomType;
                document.getElementById("roomNumber").value = admission.roomNumber;
                roomSection.style.display = "block";
            } else {
                roomSection.style.display = "none";
            }

            // Remove the existing row
            row.remove();
            deleteAdmission(patientId);

            // Show alert to the user
            alert("Please edit the patient details below.");
        }
    } else if (event.target.classList.contains("delete-btn")) {
        if (confirm("Are you sure you want to delete this entry?")) {
            const row = event.target.closest("tr");
            const patientId = row.cells[0].innerText;
            row.remove();
            deleteAdmission(patientId);
        }
    }
});

// Function to get admission by patient ID
function getAdmissionById(patientId) {
    let admissions = JSON.parse(localStorage.getItem("admissions")) || [];
    return admissions.find(admission => admission.patientId === patientId);
}

// Function to load patients into the Select dropdown
function loadPatientsDropdown() {
    let storedPatients = JSON.parse(localStorage.getItem("patients")) || [];
    const patientSelect = document.getElementById("patientSelect");
    
    if (!patientSelect) return;
    
    // Clear existing options
    patientSelect.innerHTML = "<option value=\"\">Select Patient</option>";
    
    // Populate dropdown with patient names
    storedPatients.forEach(patient => {
        let option = document.createElement("option");
        option.value = patient.id; // Store Patient ID as the value
        option.textContent = `${patient.name} (ID: ${patient.id})`;
        patientSelect.appendChild(option);
    });
}

// Function to initialize room availability
function initializeRooms() {
    if (!localStorage.getItem("rooms")) {
        let initialRooms = {
            ICU: Array.from({ length: 20 }, (_, i) => `ICU ${i + 1}`),
            General: Array.from({ length: 50 }, (_, i) => `General ${i + 1}`),
            VIP: Array.from({ length: 30 }, (_, i) => `VIP ${i + 1}`)
        };
        localStorage.setItem("rooms", JSON.stringify(initialRooms));
    }
}

// Function to populate room numbers based on room type selection
function setupRoomSelection() {
    const roomTypeSelect = document.getElementById("roomType");
    const roomNumberSelect = document.getElementById("roomNumber");

    if (!roomTypeSelect || !roomNumberSelect) return;

    roomTypeSelect.addEventListener("change", function () {
        let selectedType = roomTypeSelect.value;
        let rooms = JSON.parse(localStorage.getItem("rooms")) || {};

        console.log("Selected Type:", selectedType);
        console.log("Available Rooms:", rooms); // Debugging log

        // Clear previous room numbers
        roomNumberSelect.innerHTML = "<option value=''>-- Choose a Room --</option>";

        if (rooms[selectedType] && rooms[selectedType].length > 0) {
            rooms[selectedType].forEach(room => {
                let option = document.createElement("option");
                option.value = room;
                option.textContent = room;
                roomNumberSelect.appendChild(option);
            });
        } else {
            console.log("No available rooms for this type."); // Debugging log
        }
    });
}

// Function to save admission data to localStorage
function saveAdmission(admission) {
    let admissions = JSON.parse(localStorage.getItem("admissions")) || [];
    const existingIndex = admissions.findIndex(a => a.patientId === admission.patientId);

    if (existingIndex !== -1) {
        admissions[existingIndex] = admission; // Update existing admission
    } else {
        admissions.push(admission); // Add new admission
    }

    localStorage.setItem("admissions", JSON.stringify(admissions));
}

// Function to load admissions from localStorage
function loadAdmissions() {
    let admissions = JSON.parse(localStorage.getItem("admissions")) || [];
    const tableBody = document.querySelector("#admissionTable tbody");

    if (!tableBody) return;

    admissions.forEach(admission => {
        const newRow = `<tr>
            <td>${admission.patientId}</td>
            <td>${admission.patientName} (ID: ${admission.patientId})</td>
            <td>${admission.admissionDate}</td>
            <td>${admission.doctorName}</td>
            <td>${admission.admissionType}</td>
            <td>${admission.roomType || ""}</td>
            <td>${admission.roomNumber || ""}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        </tr>`;
        tableBody.insertAdjacentHTML("beforeend", newRow);
    });
}

// Function to delete admission data from localStorage
function deleteAdmission(patientId) {
    let admissions = JSON.parse(localStorage.getItem("admissions")) || [];
    admissions = admissions.filter(admission => admission.patientId !== patientId);
    localStorage.setItem("admissions", JSON.stringify(admissions));
}

// Function to update the table with the new admission
function updateTable() {
    const tableBody = document.querySelector("#admissionTable tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    loadAdmissions(); // Reload admissions from localStorage
}