document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form from submitting the traditional way

        // Dummy account credentials
        const correctUsername = "admin";
        const correctPassword = "1234";

        // Get input values
        const enteredUsername = document.querySelector("input[type='text']").value;
        const enteredPassword = document.querySelector("input[type='password']").value;

        // Check credentials
        if (enteredUsername === correctUsername && enteredPassword === correctPassword) {
            window.location.href = "HomePage.html"; // Redirect to HomePage (no pop-up)
        } else {
            alert("Incorrect username or password. Please try again."); // Show pop-up for incorrect login
        }
    });
});
