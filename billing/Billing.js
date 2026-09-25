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

// Array to store claims
var forms = JSON.parse(localStorage.getItem('claims')) || [];

// Function to save claims to localStorage
function saveClaimsToLocalStorage() {
    localStorage.setItem('claims', JSON.stringify(forms));
}

function addClaim(policyNo, nameOfPatient, patientId, identification, gender, contactNo, admissionDate, nameOfPhysician, nameOfHospital) {
    // Add the new claim to the forms array
    forms.push({ policyNo, nameOfPatient: `${nameOfPatient} (ID: ${patientId})`, patientId, identification, gender, contactNo, admissionDate, nameOfPhysician, nameOfHospital });

    // Debugging: Ensure identification is correctly added
    console.log("📝 New claim added:", { policyNo, nameOfPatient: `${nameOfPatient} (ID: ${patientId})`, patientId, identification, gender, contactNo, admissionDate, nameOfPhysician, nameOfHospital });

    // Save claims to localStorage
    saveClaimsToLocalStorage();

    // Update the table on the main page
    updateTable();           // Call updateTable to refresh the table with the new data
    calculateTotalClaims();  // Instantly update the number of claims on the html webpage
    alert('Claim data is successfully added!'); // Update user the status
}

// Function to open a pop up modal
function openModal() {
    const modal = document.getElementById('addClaimModal'); // Find the 'addClaimModal' ID from HTML
    modal.style.display ='flex';                            // Show the modal to become visible
    generatePolicyNumber();                                 // Generate a new policy number when the modal is opened
    loadPatientsDropdown();                                 // Load patients into the dropdown
}

// Function to close the pop up modal
function closeModal(){
    const modal = document.getElementById('addClaimModal'); // Find the 'addClaimModal' ID from HTML
    modal.style.display ='none';                  // Hide the modal
    document.getElementById('claimForm').reset(); // Clear the form inputs when closing modal
}

// Function to update the claim data to the table
function updateTable() {
    const table = document.querySelector("table");
    const tbody = table.querySelector("tbody");

    // Clear the existing rows inside <tbody>
    tbody.innerHTML = "";

    if (forms.length > 0) {
        // Loop through each claim and add a claim data row to the table
        forms.forEach((claim, index) => {
            const row = document.createElement('tr'); // Create a new row for each claim
            // The table is uneditable before clicking the edit mode
            row.innerHTML = `
                <td contenteditable="false">${claim.policyNo}</td>
                <td contenteditable="false">${claim.nameOfPatient}</td>
                <td contenteditable="false">${claim.identification}</td>
                <td contenteditable="false">${claim.gender}</td>
                <td contenteditable="false">${claim.contactNo}</td>
                <td contenteditable="false">${claim.admissionDate}</td>
                <td contenteditable="false">${claim.nameOfPhysician}</td>
                <td contenteditable="false">${claim.nameOfHospital}</td>
                <td class="action">
                    <button class="options" onclick="toggleOptions(this)">&#8942;</button> <!-- Three vertical dots button -->
                    <div class="options-menu" style="display:none;">
                        <button class="edit-option" onclick="editClaim(this, ${index})">Edit</button>
                        <button class="delete-option" onclick="confirmDeleteClaim(${index})">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row); // Add the new row to the <tbody>
        });
    }
    toggleOptionsButton(); // Call the function to display the button
}

// The options button at the side of the data
function toggleOptionsButton() {
    const optionsButtons = document.querySelectorAll(".options");

    optionsButtons.forEach(button => {
        button.style.display = forms.length > 0 ? "inline-block" : "none";
    })
}

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

// Edit button in the table (attached to each row)
function editClaim(button, index) {
    let row = button.closest('tr');
    const editButton = row.querySelector('.edit-option');

    if (editButton.innerText === 'Edit') {
        alert('The table content is editable! Please modify your new value in the table.');
        row.querySelectorAll('td').forEach((cell, cellIndex) => {
            if (cellIndex > 0 || cellIndex < 8) { // Highlight only editable cells
                cell.setAttribute("contenteditable", "true");
                cell.style.backgroundColor = "#fff8e1"; // Highlight the editable cells
            }
        });

        editButton.innerText = 'Save';
    } else {
        const updatedClaim = {
            policyNo: row.cells[0].innerText,
            nameOfPatient: row.children[1].innerText,
            identification: row.children[2].innerText,
            gender: row.children[3].innerText,
            contactNo: row.children[4].innerText,
            admissionDate: row.children[5].innerText,
            nameOfPhysician: row.children[6].innerText,
            nameOfHospital: row.children[7].innerText
        };

        forms[index] = updatedClaim;

        // Save claims to localStorage
        saveClaimsToLocalStorage();

        row.querySelectorAll('td').forEach(cell => {
            cell.setAttribute("contenteditable", "false");
            cell.style.backgroundColor = ""; // Remove the highlight from the editable cells
        });

        // After save, change option back to edit option
        editButton.innerText = "Edit";
        // Inform user changes have been made
        alert('Changes have been made successfully!');

        // Instantly update the table and total claim counts
        updateTable();
        calculateTotalClaims();
    }
}

// Function to confirm deletion of a claim
function confirmDeleteClaim(index) {
    const confirmation = confirm('Are you sure you want to delete?');
    if (confirmation) {
        deleteClaim(index);
    }
}

// Delete claim function
function deleteClaim(index) {
    forms.splice(index, 1); // Remove the claim from the array

    // Save claims to localStorage
    saveClaimsToLocalStorage();
    
    alert('Claim data is deleted successfully!');
    updateTable(); // Refresh the table after deletion
    calculateTotalClaims();
}

// Event listener to handle form submission
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('claimForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        if (formValidation()) {
            const policyNo = document.getElementById('policyNo').value;
            const patientSelect = document.getElementById('patientSelect');
            // Get the selected option element
            const selectedOption = patientSelect.options[patientSelect.selectedIndex];
            // Extract the patient name and ID
            const nameOfPatient = selectedOption.textContent.split(" (ID: ")[0]; // Get the patient name
            const patientId = selectedOption.value; // Get the patient ID
            const identification = document.getElementById('identification').value;            const gender = document.querySelector('input[name="gender"]:checked')?.value;
            const contactNo = document.getElementById('contactNo').value;
            const admissionDate = document.getElementById('admissionDate').value;
            const nameOfPhysician = document.getElementById('nameOfPhysician').value;
            const nameOfHospital = document.getElementById('nameOfHospital').value;

            addClaim(policyNo, nameOfPatient, patientId, identification, gender, contactNo, admissionDate, nameOfPhysician, nameOfHospital);

            document.getElementById('claimForm').reset();

            // After adding data to the table, call function to close modal
            closeModal();
        }
    });

    // Load existing claims from localStorage and update the table
    updateTable();
    calculateTotalClaims();
});

// Function to search for claim
function searchClaims() {
    var input, filter, table, tr, td, i;
    input = document.querySelector('.search-bar');
    filter = input.value.toUpperCase();
    table = document.querySelector('table');
    tr = table.getElementsByTagName('tr');

    // Loop through the data in the table, and hide those who dont match the search query
    for (i=1; i < tr.length; i++) {
        td = tr [i].getElementsByTagName('td');
        if (td.length > 0) {
            var policyNo = td[0].textContent || td[0].innerText;
            var nameOfPatient = td[1].textContent || td[1].innerText;
            if (policyNo.toUpperCase().indexOf(filter) > -1 || nameOfPatient.toUpperCase().indexOf(filter) >-1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

document.querySelector('.search-bar').addEventListener('keyup', searchClaims);

// Function to get instant count of total number of claims data in the table
function calculateTotalClaims() {
    const totalClaims = forms.length; // Get the number of claims in the array
    document.getElementById('claimCounts').innerText = totalClaims; // Update the total claims count on the page
}

// Function to validate the data inputs in the form
function formValidation() {
    var dname = document.getElementById('nameOfPhysician');
    var hname = document.getElementById('nameOfHospital');
    var male = document.getElementById('male');
    var female = document.getElementById('female');
    var contactNo = document.getElementById('contactNo');

    // Validate Names, Gender, and Contact Number
    if(validateName(dname)) {  // Name of Physician validation
        if(validateName(hname)) {  // Name of Hospital validation
            if(validgender(male, female)) {  // Gender validation
                if(validContactno(contactNo)) {  // Contact Number validation
                    return true;  // All validations passed
                }
            }
        }
    }

    // If any validation fails, prevent form submission
    return false;
}

// Function to validate all the name inputs
function validateName(nameField) {
    const name = nameField.value.trim();
    if (name === "") {
        alert("Please enter a valid name.");
        nameField.focus();
        return false;
    }
    return true;
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

// Function to validate contact number
function validContactno(contactNo) {
    var contactno = contactNo.value.replace(/[^0-9]/g, "");  // Remove non-numeric characters

    if (contactno.length >= 10 && contactno.length <= 11 && /^[0-9]+$/.test(contactno)) {
        return true;
    } else {
        alert("Invalid contact number. Please re-enter a valid phone number (10-11 digits)");
        return false;
    }
}

// Function to generate a random policy number
function generatePolicyNumber() {
    const policyNo = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    document.getElementById('policyNo').value = policyNo;
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