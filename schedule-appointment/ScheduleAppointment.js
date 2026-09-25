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
    const prevWeekBtn = document.getElementById("prevWeek");
    const nextWeekBtn = document.getElementById("nextWeek");
    const weekDisplay = document.getElementById("weekDisplay");
    const calendar = document.querySelector(".calendar");
    let currentWeekOffset = 0;

    let appointments = JSON.parse(localStorage.getItem("appointments")) || {};
    let patients = JSON.parse(localStorage.getItem("patients")) || []; 

    function getWeekKey(offset) {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1 + offset * 7));
        return `${startOfWeek.getFullYear()}-${startOfWeek.getMonth() + 1}-${startOfWeek.getDate()}`;
    }

    function getDateOfWeek(day, offset) {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1 + offset * 7));
        const date = new Date(startOfWeek.setDate(startOfWeek.getDate() + (day - 1)));
        return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
    }

    function saveAppointments() {
        localStorage.setItem("appointments", JSON.stringify(appointments));
    }

    function updateWeek(offset) {
        currentWeekOffset = offset;
        const weekKey = getWeekKey(offset);
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1 + offset * 7));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        if (weekDisplay) {
            weekDisplay.textContent = `${startOfWeek.toLocaleDateString("en-US", { month: "long", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "long", day: "numeric" })}`;
        }

        document.querySelectorAll(".slot").forEach(slot => {
            slot.textContent = "";
            slot.classList.remove("booked");
        });

        if (appointments[weekKey]) {
            appointments[weekKey].forEach(({ time, day, patientId, patientName }) => {
                let slot = document.querySelector(`.slot[data-time="${time}"][data-day="${day}"]`);
                if (slot) {
                    slot.textContent = `${patientName} (ID: ${patientId})`;
                    slot.classList.add("booked");
                    slot.dataset.patientId = patientId;
                }
            });
        }
    }

    calendar.addEventListener("click", function (event) {
        const slot = event.target;
        const time = slot.getAttribute("data-time");
        const day = slot.getAttribute("data-day");
        const weekKey = getWeekKey(currentWeekOffset);

        if (!time || !day) return;

        if (slot.classList.contains("booked")) {
            const appointment = appointments[weekKey].find(app => app.time === time && app.day === day);
            if (!appointment) return;

            showEditModal(slot, weekKey, appointment, day);
        } else {
            showBookingModal(slot, weekKey, time, day);
        }
    });

    function showBookingModal(slot, weekKey, time, day) {
        const modal = document.getElementById("bookingModal");
        modal.style.display = "block";

        document.getElementById("selectedTime").textContent = time;
        document.getElementById("selectedDay").textContent = getDayName(day);
        document.getElementById("selectedDate").textContent = getDateOfWeek(day, currentWeekOffset);

        const patientSelect = document.getElementById("patientSelect");
        patientSelect.innerHTML = `
            <option value="">-- Select Patient --</option>
            ${patients.map(p => `<option value="${p.id}">${p.name} (ID: ${p.id})</option>`).join("")}
        `;

        const confirmBookingBtn = document.getElementById("confirmBooking");
        const closeBookingModalBtn = document.getElementById("closeBookingModal");

        // Remove existing event listeners
        confirmBookingBtn.replaceWith(confirmBookingBtn.cloneNode(true));
        closeBookingModalBtn.replaceWith(closeBookingModalBtn.cloneNode(true));

        document.getElementById("confirmBooking").addEventListener("click", function () {
            const patientId = patientSelect.value;
            if (!patientId) return alert("Please select a patient!");

            const patient = patients.find(p => p.id === patientId);
            if (!patient) return alert("Invalid patient!");

            if (!appointments[weekKey]) {
                appointments[weekKey] = [];
            }

            appointments[weekKey].push({ time, day, patientId, patientName: patient.name });
            slot.textContent = `${patient.name} (ID: ${patientId})`;
            slot.classList.add("booked");
            slot.dataset.patientId = patientId;
            saveAppointments();
            closeModal("bookingModal");
        });

        document.getElementById("closeBookingModal").addEventListener("click", function() {
            closeModal("bookingModal");
        });
    }

    function showEditModal(slot, weekKey, appointment, day) {
        const modal = document.getElementById("editingModal");
        modal.style.display = "block";

        document.getElementById("editSelectedTime").textContent = appointment.time;
        document.getElementById("editSelectedDay").textContent = getDayName(appointment.day);
        document.getElementById("editSelectedDate").textContent = getDateOfWeek(day, currentWeekOffset);

        const patientSelect = document.getElementById("editPatientSelect");
        patientSelect.innerHTML = `
            <option value="">-- Select Patient --</option>
            ${patients.map(p => `<option value="${p.id}" ${p.id === appointment.patientId ? 'selected' : ''}>${p.name} (ID: ${p.id})</option>`).join("")}
        `;

        const updateBookingBtn = document.getElementById("updateBooking");
        const removeBookingBtn = document.getElementById("removeBooking");
        const closeEditingModalBtn = document.getElementById("closeEditingModal");

        // Remove existing event listeners
        updateBookingBtn.replaceWith(updateBookingBtn.cloneNode(true));
        removeBookingBtn.replaceWith(removeBookingBtn.cloneNode(true));
        closeEditingModalBtn.replaceWith(closeEditingModalBtn.cloneNode(true));

        document.getElementById("updateBooking").addEventListener("click", function () {
            const patientId = patientSelect.value;
            if (!patientId) return alert("Please select a patient!");

            const patient = patients.find(p => p.id === patientId);
            if (!patient) return alert("Invalid patient!");

            appointment.patientId = patientId;
            appointment.patientName = patient.name;
            slot.textContent = `${patient.name} (ID: ${patientId})`;
            slot.classList.add("booked");
            slot.dataset.patientId = patientId;
            saveAppointments();
            closeModal("editingModal");
        });

        document.getElementById("removeBooking").addEventListener("click", function () {
            appointments[weekKey] = appointments[weekKey].filter(app => app.time !== appointment.time || app.day !== appointment.day);
            slot.textContent = "";
            slot.classList.remove("booked");
            saveAppointments();
            closeModal("editingModal");
        });

        document.getElementById("closeEditingModal").addEventListener("click", function() {
            closeModal("editingModal");
        });
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = "none";
    }

    function getDayName(dayNumber) {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        return days[dayNumber - 1] || "Unknown";
    }

    prevWeekBtn.addEventListener("click", () => updateWeek(currentWeekOffset - 1));
    nextWeekBtn.addEventListener("click", () => updateWeek(currentWeekOffset + 1));

    updateWeek(currentWeekOffset);
});