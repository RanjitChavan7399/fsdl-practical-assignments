// Display feedback message
function showMessage(elementId, text, type) {
    const msgElement = document.getElementById(elementId);
    msgElement.textContent = text;
    msgElement.className = `message ${type}`;
    msgElement.style.display = 'block';
    
    setTimeout(() => {
        msgElement.style.display = 'none';
    }, 3000);
}

// Handle User Registration
async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        if (data.success) {
            showMessage('msg', data.message, 'success');
            document.getElementById('registerForm').reset();
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        } else {
            showMessage('msg', data.message, 'error');
        }
    } catch (err) {
        showMessage('msg', 'Error connecting to server', 'error');
    }
}

// Handle User Login
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        if (data.success) {
            // Simple auth using localStorage
            localStorage.setItem('username', data.username);
            showMessage('msg', data.message, 'success');
            setTimeout(() => {
                window.location.href = 'booking.html';
            }, 1000);
        } else {
            showMessage('msg', data.message, 'error');
        }
    } catch (err) {
        showMessage('msg', 'Error connecting to server', 'error');
    }
}

// Handle Booking
async function handleBooking(e) {
    e.preventDefault();
    const name = document.getElementById('b_name').value;
    const packageName = document.getElementById('b_package').value;
    const date = document.getElementById('b_date').value;
    
    try {
        const response = await fetch('/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, packageName, date })
        });
        
        const data = await response.json();
        if (data.success) {
            showMessage('msg', data.message, 'success');
            document.getElementById('bookingForm').reset();
            // Restore name field since form resetted
            document.getElementById('b_name').value = localStorage.getItem('username');
            // Refresh list
            fetchBookings();
        } else {
            showMessage('msg', data.message, 'error');
        }
    } catch (err) {
        showMessage('msg', 'Error connecting to server', 'error');
    }
}

// Fetch all bookings
async function fetchBookings() {
    try {
        const response = await fetch('/bookings');
        const data = await response.json();
        
        if (data.success) {
            const list = document.getElementById('bookingsList');
            if(!list) return; // not on booking page
            
            list.innerHTML = '';
            
            if (data.bookings.length === 0) {
                list.innerHTML = '<tr><td colspan="3" class="text-center">No bookings yet!</td></tr>';
                return;
            }
            
            data.bookings.forEach(b => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${b.name}</td>
                    <td>${b.packageName}</td>
                    <td>${b.date}</td>
                `;
                list.appendChild(tr);
            });
        }
    } catch (err) {
        console.error('Error fetching bookings:', err);
    }
}

function checkAuthForNav() {
    const username = localStorage.getItem('username');
    if (username) {
        const navLogin = document.getElementById('nav-login');
        const navRegister = document.getElementById('nav-register');
        const navBooking = document.getElementById('nav-booking');
        const navLogout = document.getElementById('nav-logout');
        
        if (navLogin) navLogin.style.display = 'none';
        if (navRegister) navRegister.style.display = 'none';
        if (navBooking) navBooking.style.display = 'inline-block';
        if (navLogout) navLogout.style.display = 'inline-block';
    }
}

function logout() {
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}

// on page load
document.addEventListener('DOMContentLoaded', checkAuthForNav);
