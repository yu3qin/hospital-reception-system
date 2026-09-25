// Function to get the date of the week with day name
function getDateOfWeekWithDay(day, offset) {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1 + offset * 7));
    const date = new Date(startOfWeek.setDate(startOfWeek.getDate() + (day - 1)));
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    return `${date.toLocaleDateString("en-US", { month: "long", day: "numeric" })} (${dayName})`;
}

// Function to switch between pages
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
}


// Show home page by default
document.addEventListener("DOMContentLoaded", () => {
    showPage("home");
    updateTable();           // Call updateTable to refresh the table with the new data
});

// Ensure DOM elements exist before running scripts
document.addEventListener("DOMContentLoaded", function () {
    let modal = document.getElementById("patientModal");
    let popupDetails = document.getElementById("popup-details");
    let searchForm = document.getElementById("searchForm");
    let logoutBtn = document.getElementById("logoutBtn");
    let closeButton = document.querySelector(".close-btn");

    if (!modal || !popupDetails) {
        console.error("❌ ERROR: Modal or popup-details element missing!");
        return;
    }

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

    // Search form event listener
    if (searchForm) {
        searchForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let searchId = document.getElementById("searchId").value.trim();
            let searchName = document.getElementById("searchName").value.trim().toLowerCase();

            let patients = JSON.parse(localStorage.getItem("patients")) || [];

            let foundPatient = patients.find(patient =>
                (searchId && patient.id.trim() === searchId) ||
                (searchName && patient.name.trim().toLowerCase() === searchName)
            );

            if (!foundPatient) {
                alert("No patient found with the given details.");
                return;
            }

            console.log("✅ Patient found:", foundPatient);

            // Retrieve additional details
            let rawAdmissions = JSON.parse(localStorage.getItem("admissions") || "{}");
            let admissionData = Object.values(rawAdmissions).flat();

            let rawAppointments = JSON.parse(localStorage.getItem("appointments") || "{}");
            let appointmentData = Object.values(rawAppointments).flat();

            let rawClaims = JSON.parse(localStorage.getItem("claims")) || [];
            // Extract patient ID from nameOfPatient field
            let claim = rawClaims.find(claim => {
                let claimPatientId = claim.nameOfPatient.match(/\(ID: (\d+)\)/);
                return claimPatientId && claimPatientId[1] === foundPatient.id;
            });
            let policyNo = claim ? claim.policyNo : "No Policy";

            let rawMedical = JSON.parse(localStorage.getItem("reports") || "{}");
            let medicalData = Object.values(rawMedical).flat();

            let admissionType = (admissionData.find(adm => adm.patientId === foundPatient.id) || {}).admissionType || "Not Admitted";
            let appointment = appointmentData.find(app => app.patientId === foundPatient.id);
            let appointmentDate = appointment ? getDateOfWeekWithDay(appointment.day, 0) : "No Appointment";
            let appointmentTime = appointment ? appointment.time : "No Appointment";
            let medicalReportID = (medicalData.find(med => med.patientID === foundPatient.id) || {}).reportID || "No Report Available";

            // Populate modal with patient details
            popupDetails.innerHTML = `
                <table>
                    <tr><th>ID</th><td>${foundPatient.id}</td></tr>
                    <tr><th>Name</th><td>${foundPatient.name}</td></tr>
                    <tr><th>Age</th><td>${foundPatient.age}</td></tr>
                    <tr><th>Gender</th><td>${foundPatient.gender}</td></tr>
                    <tr><th>Phone</th><td>${foundPatient.phone}</td></tr>
                    <tr><th>Admission Type</th><td>${admissionType}</td></tr>
                    <tr><th>Appointment Date</th><td>${appointmentDate}</td></tr>
                    <tr><th>Appointment Time</th><td>${appointmentTime}</td></tr>
                    <tr><th>Insurance Policy No.</th><td>${policyNo}</td></tr>
                    <tr><th>Medical Report (ID)</th><td>${medicalReportID}</td></tr>
                </table>
            `;

            console.log("ℹ️ Displaying modal...");
            modal.style.display = "block";

            // Clear the input fields
            document.getElementById("searchId").value = "";
            document.getElementById("searchName").value = "";
        });
    } else {
        console.error("❌ ERROR: #searchForm not found!");
    }

    // Close modal event listener
    if (closeButton) {
        closeButton.addEventListener("click", function () {
            console.log("❌ Closing modal...");
            modal.style.display = "none";
        });
    }

    // Close modal when clicking outside
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            console.log("❌ Closing modal (clicked outside)...");
            modal.style.display = "none";
        }
    });

    calculateTotalClaims()
    calculateTotalPatients()
    calculateTotalAdmission()
    calculateTotalAppointment()
});

// Function to update the total number of claims
function calculateTotalClaims() {
    let claims = JSON.parse(localStorage.getItem("claims")) || [];
    console.log("💰 Claims from storage:", claims.length); // Debugging

    let totalClaimsElement = document.getElementById("totalClaims");

    if (totalClaimsElement) {
        totalClaimsElement.innerText = claims.length;
        console.log("✅ Total Claims Updated:", claims.length);
    } else {
        console.error("❌ totalClaims element not found in the DOM!");
    }
}

// Function to update the total number of patients
function calculateTotalPatients() {
    let claims = JSON.parse(localStorage.getItem("patients")) || [];
    console.log(" Patients from storage:", claims.length); // Debugging

    let totalPatientsElement = document.getElementById("totalPatients");

    if (totalPatientsElement) {
        totalPatientsElement.innerText = claims.length;
        console.log("✅ Total Patients Updated:", claims.length);
    } else {
        console.error("❌ totalPatients element not found in the DOM!");
    }
}

// Function to update the total number of admissions
function calculateTotalAdmission() {
    let claims = JSON.parse(localStorage.getItem("admissions")) || [];
    console.log(" Admission from storage:", claims.length); // Debugging

    let totalAdmissionElement = document.getElementById("inOutPatients");

    if (totalAdmissionElement) {
        totalAdmissionElement.innerText = claims.length;
        console.log("✅ Total Admission Updated:", claims.length);
    } else {
        console.error("❌ totalAdmission element not found in the DOM!");
    }
}

// Function to update the total number of appointments
function calculateTotalAppointment() {
    let appointmentsData = JSON.parse(localStorage.getItem("appointments")) || {};
    console.log("📅 Appointments from storage:", appointmentsData); // Debugging

    // Count total appointments across all dates
    let totalAppointments = Object.values(appointmentsData)
        .reduce((sum, appointmentsArray) => sum + appointmentsArray.length, 0);

    let totalAppointmentElement = document.getElementById("totalAppointments");

    if (totalAppointmentElement) {
        totalAppointmentElement.innerText = totalAppointments;
        console.log("✅ Total Appointments Updated:", totalAppointments);
    } else {
        console.error("❌ totalAppointments element not found in the DOM!");
    }
}

// Ensure function runs after page is fully loaded
document.addEventListener("DOMContentLoaded", calculateTotalAppointment);
