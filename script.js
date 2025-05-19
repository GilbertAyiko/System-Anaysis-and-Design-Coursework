function loginUser() {
  const email = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value.trim();
  const status = document.getElementById('login-status');

  const users = [
    { email: 'student@vu.ac.ug', password: 'pass123', redirect: 'events.html' },
    { email: 'admin@vu.ac.ug', password: 'admin123', redirect: 'admin-dashboard.html' },
    { email: 'checkin@vu.ac.ug', password: 'check123', redirect: 'check-in.html' }
  ];

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem('user', JSON.stringify(user)); // Store the whole user object
    status.textContent = 'Login successful!';
    status.style.color = 'green';
    setTimeout(() => window.location.href = user.redirect, 1000);
  } else {
    status.textContent = 'Invalid credentials. Please try again.';
    status.style.color = 'red';
  }

  return false;
}

// ========== UTILITY FUNCTIONS ==========
function filterEvents(value) {
  const cards = document.querySelectorAll('.event-card');
  cards.forEach(card => {
    const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
    card.style.display = name.includes(value.toLowerCase()) ? 'block' : 'none';
  });
}

function registerEvent(eventName) {
  const ticketId = `Ticket#${eventName}-${Date.now()}`;
  localStorage.setItem('ticket', ticketId);
  alert(`Successfully registered for ${eventName}`);
}

function generateTicketQR() {
  const canvas = document.getElementById('ticket-qr');
  const ticket = localStorage.getItem('ticket') || 'No Ticket Found';
  if (canvas && window.QRCode) {
    QRCode.toCanvas(canvas, ticket, function (error) {
      if (error) console.error('QR Generation Error:', error);
    });
  }
}

function initQRScanner() {
  const video = document.getElementById('qr-video');
  if (video && navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => video.srcObject = stream)
      .catch(err => console.error("Camera Error:", err));
  }
}

function validateCode(code) {
  const feedback = document.getElementById('validation-feedback');
  const ticket = localStorage.getItem('ticket');

  if (feedback) {
    if (code === ticket) {
      feedback.textContent = 'Valid Ticket';
      feedback.style.color = 'green';
    } else {
      feedback.textContent = 'Invalid Ticket';
      feedback.style.color = 'red';
    }
  }
}

let attendance = 0;
function simulateAttendance() {
  const count = document.getElementById('attendance-count');
  const status = document.getElementById('capacity-status');

  setInterval(() => {
    attendance += Math.floor(Math.random() * 3);
    if (count) count.textContent = attendance;
    if (status) {
      status.textContent = attendance > 100 ? 'FULL' : 'OK';
      status.style.color = attendance > 100 ? 'red' : 'green';
    }
  }, 4000);
}

function exportData(format) {
  alert(`Exporting data to ${format.toUpperCase()}...`);
}

// =============== PAGE INITIALIZERS ===============
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split("/").pop();

  // LOGIN GUARD – Redirect if not logged in
  if (currentPage !== 'login.html') {
    const user = localStorage.getItem('user');
    if (!user) {
      alert('Session expired. Redirecting to login.');
      window.location.href = 'login.html';
    }
  }

  // LOGOUT FUNCTIONALITY
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('user');
      alert('Logged out successfully.');
      window.location.href = 'login.html';
    });
  }

  // PAGE SPECIFIC INIT
  if (document.getElementById('ticket-qr')) generateTicketQR();
  if (document.getElementById('qr-video')) initQRScanner();
  if (document.getElementById('attendance-count')) simulateAttendance();
});
