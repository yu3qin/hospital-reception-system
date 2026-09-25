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

// Array to store reports
var forms = JSON.parse(localStorage.getItem('reports')) || [];

// Function to save reports to localStorage
function saveReportsToLocalStorage() {
    localStorage.setItem('reports', JSON.stringify(forms));
}

// Function to add a report
function addReport(reportID, patientID, patientName, identification, dob, gender, blood, height, weight, medicalInformation1, medicalInformation2, medicalInformation3, medicalInformation4) {
    // Add the new report to the forms array
    forms.push({ reportID, patientID, patientName, identification, dob, gender, blood, height, weight, medicalInformation1, medicalInformation2, medicalInformation3, medicalInformation4 });

    // Save reports to localStorage
    saveReportsToLocalStorage();

    // Update the table on the main page
    updateTable();  // Call updateTable to refresh the table with the new data
    calculateTotalReport();
    alert('Medical Report is successfully added!');
}

// Open the pop up add report modal
function openModal() {
    // Find the 'addReportModal' ID from HTML 
    const modal = document.getElementById('addReportModal');
    modal.style.display ='flex';// Show the modal to become visible
    generateReportID();         // Generate a new report ID when the modal is opened
    loadPatientsDropdown();     // Load patients into the dropdown
}

// Close the pop up add report modal
function closeModal(){
    // Hide the modal when clicked on x button or after submission
    const modal = document.getElementById('addReportModal');
    modal.style.display ='none'; // Hide the modal
    document.getElementById('reportForm').reset(); // Clear the form inputs when closing modal
}

// Function to update the table with the new report data
function updateTable() {
    const table = document.querySelector("table");
    const tbody = table.querySelector("tbody");

    // Clear the existing rows inside <tbody>
    tbody.innerHTML = "";

    if (forms.length > 0) {
        // Loop through each report and add a row to the table
        forms.forEach((report, index) => {
            const row = document.createElement('tr'); // Create a new row for each report
            row.innerHTML = ` 
                <td contenteditable="false">${report.reportID}</td>
                <td contenteditable="false">${report.patientName} (ID: ${report.patientID})</td>
                <td contenteditable="false">${report.identification}</td>
                <td contenteditable="false">${report.dob}</td>
                <td contenteditable="false">${report.gender}</td>
                <td contenteditable="false">${report.blood}</td>
                <td contenteditable="false">${report.height}</td>
                <td contenteditable="false">${report.weight}</td>
                <td class="action">
                    <button class="options" onclick="toggleOptions(this)">&#8942;</button> <!-- Three vertical dots button -->
                    <div class="options-menu" style="display:none;">
                        <button class="view-option" onclick="viewReport(${index})">View</button>
                        <button class="delete-option" onclick="confirmDeleteReport(${index})">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row); // Add the new row to the <tbody>
        });
    } 
    toggleOptionsButton(); // Call the function to appear
}

// The options button at the side of the data
function toggleOptionsButton() {
    const optionsButtons = document.querySelectorAll(".options");

    optionsButtons.forEach(button => {
        button.style.display = forms.length > 0 ? "inline-block" : "none";
    })
}

// Function for the menu options available in the function
function toggleOptions(button) {
    console.log("Button clicked:", button); // Check if the button is being passed
    const menu = button.nextElementSibling;
    if (menu) { // Check if the menu exists
        console.log("Menu found:", menu); // Check if the menu exists
        menu.style.display = menu.style.display === 'none' || menu.style.display === '' ? 'block' : 'none';
    } else {
        console.error("No menu found next to the button");
    }
}

// Function to open the view report modal and show the data
function viewReport(index) {
    // Get the report from the forms array
    const report = forms[index];

    // Set the data to the modal elements
    document.getElementById('viewReportID').innerText = report.reportID;
    document.getElementById('viewPatientName').innerText = `${report.patientName} (ID: ${report.patientID})`;
    document.getElementById('viewIdentification').innerText = report.identification;
    document.getElementById('viewDOB').innerText = report.dob;
    document.getElementById('viewGender').innerText = report.gender;
    document.getElementById('viewBlood').innerText = report.blood;
    document.getElementById('viewHeight').innerText = report.height;
    document.getElementById('viewWeight').innerText = report.weight;
    document.getElementById('viewMedicalInformation1').innerText = report.medicalInformation1;
    document.getElementById('viewMedicalInformation2').innerText = report.medicalInformation2;
    document.getElementById('viewMedicalInformation3').innerText = report.medicalInformation3;
    document.getElementById('viewMedicalInformation4').innerText = report.medicalInformation4;

    // Show the the modal
    const modal = document.getElementById('viewReportModal');
    modal.style.display = 'block';

    // Add event listener to the Edit button
    const editButton = document.getElementById('editReportButton');
    editButton.onclick = function() {
        enableEditing();
        alert('You can edit the information now');
    };

    // Add event listener to the Save button
    const saveButton = document.getElementById('saveReportButton');
    saveButton.onclick = function() {
        saveReport(index);
    };
}

// Function to close the view report modal
function closeViewModal() {
    const modal = document.getElementById('viewReportModal');
    modal.style.display = 'none';
}

// Function to enable editing in the view report modal
function enableEditing() {
    const editableFields = [
        document.getElementById('viewMedicalInformation1'),
        document.getElementById('viewMedicalInformation2'),
        document.getElementById('viewMedicalInformation3'),
        document.getElementById('viewMedicalInformation4')
    ];

    editableFields.forEach(field => {
        field.contentEditable = "true";
        field.style.backgroundColor = "#fff8e1"; // Highlight the editable fields
    });
}

// Function to save the edited report
function saveReport(index) {
    const updatedReport = {
        reportID: document.getElementById('viewReportID').innerText,
        patientID: document.getElementById('viewPatientName').innerText.split(' (ID: ')[1].slice(0, -1),
        patientName: document.getElementById('viewPatientName').innerText.split(' (ID: ')[0],
        identification: document.getElementById('viewIdentification').innerText,
        dob: document.getElementById('viewDOB').innerText,
        gender: document.getElementById('viewGender').innerText,
        blood: document.getElementById('viewBlood').innerText,
        height: document.getElementById('viewHeight').innerText,
        weight: document.getElementById('viewWeight').innerText,
        medicalInformation1: document.getElementById('viewMedicalInformation1').innerText,
        medicalInformation2: document.getElementById('viewMedicalInformation2').innerText,
        medicalInformation3: document.getElementById('viewMedicalInformation3').innerText,
        medicalInformation4: document.getElementById('viewMedicalInformation4').innerText
    };

    forms[index] = updatedReport;

    // Save reports to localStorage
    saveReportsToLocalStorage();

    // Inform user changes have been made
    alert('Changes have been saved successfully!');

    // Instantly update the table and total report counts
    updateTable();
    calculateTotalReport();

    // Remove highlight from editable fields
    const editableFields = [
        document.getElementById('viewMedicalInformation1'),
        document.getElementById('viewMedicalInformation2'),
        document.getElementById('viewMedicalInformation3'),
        document.getElementById('viewMedicalInformation4')
    ];

    editableFields.forEach(field => {
        field.contentEditable = "false";
        field.style.backgroundColor = ""; // Remove the highlight from the editable fields
    });

    // Close the modal
    closeViewModal();
}

// Function to confirm deletion of a report
function confirmDeleteReport(index) {
    const confirmation = confirm('Are you sure you want to delete?');
    if (confirmation) {
        deleteReport(index);
    }
}

// Delete report function
function deleteReport(index) {
    forms.splice(index, 1); // Remove the report from the array

    // Save reports to localStorage
    saveReportsToLocalStorage();
    
    alert('Report is deleted successfully!'); // Show user the report status
    updateTable();          // Refresh the table after deletion
    calculateTotalReport(); // Instantly update the count for report
}

// Event listener that handles form submission
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('reportForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        console.log("Form submission attempted");

        if (formValidation()) {
            console.log('Form validation passed');
            const reportID = document.getElementById('reportID').value;
            const patientID = document.getElementById('patientSelect').value;
            const patientName = document.getElementById('patientSelect').selectedOptions[0].textContent.split(' (ID: ')[0];
            const identification = document.getElementById('identification').value;
            const dob = document.getElementById('dob').value;
            const gender = document.querySelector('input[name="gender"]:checked')?.value;
            const blood = document.querySelector('input[name="blood"]:checked')?.value;
            const height = document.getElementById('height').value;
            const weight = document.getElementById('weight').value;

            const medicalInformation1 = document.getElementById('medicalInformation1').value;
            const medicalInformation2 = document.getElementById('medicalInformation2').value;
            const medicalInformation3 = document.getElementById('medicalInformation3').value;
            const medicalInformation4 = document.getElementById('medicalInformation4').value;

            addReport(reportID, patientID, patientName, identification, dob, gender, blood, height, weight, medicalInformation1, medicalInformation2, medicalInformation3, medicalInformation4);

            document.getElementById('reportForm').reset();

            // After adding data to the table, call function to close modal
            closeModal();
        }
    });

    // Load existing reports from localStorage and update the table
    updateTable();
    calculateTotalReport();

    // Initially hide the modals
    document.getElementById('addReportModal').style.display = 'none';
    document.getElementById('viewReportModal').style.display = 'none';

    // Add event listener to the "+ Add Report" button
    const addReportButton = document.getElementById('addReportButton');
    addReportButton.addEventListener('click', openModal);
});

// Function to search for report
function searchReport() {
    var input, filter, table, tr, td, i;
    input = document.querySelector('.search-bar');
    filter = input.value.toUpperCase();
    table = document.querySelector('table');
    tr = table.getElementsByTagName('tr');

    // Loop through the data in the table, and hide those who dont match the search query
    for (i=1; i < tr.length; i++) {
        td = tr [i].getElementsByTagName('td');
        if (td.length > 0) {
            var reportID = td[0].textContent || td[0].innerText;
            var patientID = td[1].textContent || td[1].innerText;
            var nameOfPatient = td[2].textContent || td[2].innerText;
            if (reportID.toUpperCase().indexOf(filter) > -1 || 
                patientID.toUpperCase().indexOf(filter) >-1 ||
                nameOfPatient.toUpperCase().indexOf(filter) >-1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

document.querySelector('.search-bar').addEventListener('keyup', searchReport);

// Function to get instant result of total number of report
function calculateTotalReport() {
    const totalReport = forms.length; // Get the number of reports in the array
    document.getElementById('reportCounts').innerText = totalReport; // Update the total reports count on the page
}

// Function for the form validation
function formValidation() {
    var rid = document.getElementById('reportID');
    var id = document.getElementById('identification');
    var male = document.getElementById('male');
    var female = document.getElementById('female');
    var ta = document.getElementById('typeA');
    var tb = document.getElementById('typeB');
    var tab = document.getElementById('typeAB');
    var to = document.getElementById('typeO');

    // Validate Report ID, Patient ID, Patient name, Identification/passport, Gender, and Blood type
    if(reportid_validation(rid, 5, 10)) {        // Report ID validation with minimum and maximum length

                if(validateICAndPassport(id)) {  // Validation for Identification/Passport 
                    if(validgender(male, female)) {        // Gender validation
                        if(validblood(ta, tb, tab, to)) {  // Blood Type validation
                            return true;                   // All validations passed
                        }
                     }
                }
            
        
    }
    // If any validation fails, prevent form submission
    return false;
}

// Validation for report ID with minimum and maximum length of 5 and maximum of 10
function reportid_validation(rid, mx, my) {
    var rid_len = rid.value.length;   // Check the length
    if (rid_len < mx || rid_len > my) {
        console.log("Report ID validation failed");
        // Show alert to user if there is no input or short length in input
        alert("Report ID should not be empty / the length must be between " + mx + " and " + my);
        rid.focus();
        return false;
    }
    return true;
}

// Function to validate national id and passport
function validateICAndPassport(id) {
    var idv = id.value.trim();  
    idv = idv.replace(/[^a-zA-Z0-9]/g,'');

    // Check if it's a valid Malaysian IC (12 digits)
    if (idv.length === 12 || /^[0-9]+$/.test(idv)) {
        return true;
    }
    // Check if it's a Passport number (6 to 9 characters, alphanumeric)
    else if (idv.length >= 6 || idv.length <= 9 || /^[a-zA-Z0-9]+$/.test(idv)) {
        return true;
    } else {
        alert("Invalid ID. Please re-enter a valid Malaysian IC or Passport number");
        return false;
    }
}

// Function to validate gender
function validgender(male, female) {
    let x = 0;

    // Check if Male or Female radio button is selected
    if (male.checked) {
        x++;
    }

    if (female.checked) {
        x++;
    }

    // If neither Male nor Female is selected, show an alert
    if (x == 0) {
        alert('Please select Male or Female');
        male.focus();  // Focus on male radio button
        return false;
    }

    // If valid, return true
    return true;
}

// Function to validate blood
function validblood(ta, tb, tab, to) {
    let x = 0;

    // Check if Male or Female radio button is selected
    if (ta.checked) {
        x++;
    }

    if (tb.checked) {
        x++;
    }

    if (tab.checked) {
        x++;
    }

    if(to.checked) {
        x++;
    }

    // If neither Male nor Female is selected, show an alert
    if (x == 0) {
        alert('Please select a blood type');
        ta.focus();     // Focus on type a radio button
        return false;   // If there is no valid response
    }

    // If valid, return true
    return true;
}

// Function to generate a random report ID
function generateReportID() {
    const reportID = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    document.getElementById('reportID').value = reportID;
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