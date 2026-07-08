document.addEventListener('DOMContentLoaded', () => {
    
    // Utility to show message boxes properly
    function showMessage(msgBox, text, isSuccess) {
        msgBox.innerText = text;
        msgBox.className = 'message ' + (isSuccess ? 'success' : 'error');
    }

    // --- Register Form ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const msgBox = document.getElementById('message');

            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();
                if (response.ok) {
                    showMessage(msgBox, data.message + ". You can now login.", true);
                    registerForm.reset();
                } else {
                    showMessage(msgBox, data.error, false);
                }
            } catch (error) {
                showMessage(msgBox, "An error occurred.", false);
            }
        });
    }

    // --- Login Form ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const msgBox = document.getElementById('message');

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                if (response.ok) {
                    window.location.href = "booking.html";
                } else {
                    showMessage(msgBox, data.error, false);
                }
            } catch (error) {
                showMessage(msgBox, "An error occurred.", false);
            }
        });
    }

    // --- Booking Form ---
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        // Load initial grid
        loadAppointments();

        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const patientName = document.getElementById('patientName').value;
            const doctorName = document.getElementById('doctorName').value;
            const date = document.getElementById('date').value;
            const msgBox = document.getElementById('message');

            // Optional frontend validation to ensure date is in future
            const selectedDate = new Date(date);
            selectedDate.setHours(0,0,0,0);
            const today = new Date();
            today.setHours(0,0,0,0);
            
            if(selectedDate < today) {
                showMessage(msgBox, "Please select a future date.", false);
                return;
            }

            try {
                const response = await fetch('/appointments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ patientName, doctorName, date })
                });

                const data = await response.json();
                if (response.ok) {
                    showMessage(msgBox, data.message, true);
                    bookingForm.reset();
                    loadAppointments(); // Refresh the grid
                } else {
                    showMessage(msgBox, data.error, false);
                }
            } catch (error) {
                showMessage(msgBox, "An error occurred.", false);
            }
        });
    }

});

// --- Fetch and Display Appointments in Professional Grid format ---
async function loadAppointments() {
    const list = document.getElementById('appointmentsList');
    if (!list) return;

    try {
        const response = await fetch('/appointments');
        const appointments = await response.json();
        
        list.innerHTML = '';
        if (appointments.length === 0) {
            list.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; background: var(--card-bg); border-radius: var(--radius); border: 2px dashed var(--border-color); color: var(--text-muted);">
                    <div style="font-size: 40px; margin-bottom: 12px;">📅</div>
                    <p style="font-size: 16px; font-weight: 500;">No appointments scheduled yet.</p>
                </div>
            `;
        } else {
            // Reverse so newest are shown first
            appointments.reverse().forEach(app => {
                const card = document.createElement('div');
                card.className = 'appt-card';
                card.innerHTML = `
                    <div class="appt-header">
                        <span class="appt-patient">👤 ${app.patientName}</span>
                        <span class="appt-date">${app.date}</span>
                    </div>
                    <div class="appt-doctor">
                        ${app.doctorName}
                    </div>
                `;
                list.appendChild(card);
            });
        }
    } catch (error) {
        console.error("Error fetching appointments:", error);
    }
}
