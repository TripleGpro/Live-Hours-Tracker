// Configuration - Update these URLs with your n8n webhook endpoints
const CONFIG = {
    // Production n8n webhook URL (only for clock in/out actions)
    CLOCK_IN_WEBHOOK: 'https://tripleg.app.n8n.cloud/webhook/ae8ff51c-f888-4d03-8f22-879b8038f536',
    CLOCK_OUT_WEBHOOK: 'https://tripleg.app.n8n.cloud/webhook/ae8ff51c-f888-4d03-8f22-879b8038f536'
};

// Mock mode for testing (set to false when using real n8n)
const MOCK_MODE = false;

// Admin configuration
const ADMIN_PASSWORD = 'tripleg2024';

// Application state
let currentEmployee = null;
let isClockedIn = false;
let pendingAction = null; // 'clock-in' or 'clock-out'
let isAdminMode = false;

// Employee management
let employees = JSON.parse(localStorage.getItem('employees')) || [
    { name: 'Ronnie Flowers', pin: '8472' },
    { name: 'Collin Crabtree', pin: '3951' },
    { name: 'Brad Tanner', pin: '6284' },
    { name: 'Tristan Humbarger', pin: '1749' },
    { name: 'Ethan Radcliff', pin: '5632' },
    { name: 'Julio Lopez', pin: '9187' },
    { name: 'Aiden Radcliff', pin: '2468' },
    { name: 'Ignacio Navarro', pin: '7531' },
    { name: 'Blake Gaylor', pin: '4096' },
    { name: 'Miguel Dominguez', pin: '2857' },
    { name: 'Luciano Lopez', pin: '6714' },
    { name: 'Manuel Ramirez', pin: '3492' },
    { name: 'Joe Hillis', pin: '8765' },
    { name: 'Deron Peters', pin: '1947' },
    { name: 'John Lambert', pin: '5328' },
    { name: 'Rodolfo Ruiz', pin: '7689' },
    { name: 'Malachi Root', pin: '4153' }
    { name: 'Alyson Flowers', pin: '2222' }
    { name: 'Jared Golts', pin: '1111' }
];

// DOM elements
const loginScreen = document.getElementById('loginScreen');
const adminLoginScreen = document.getElementById('adminLoginScreen');
const adminScreen = document.getElementById('adminScreen');
const timeTrackingScreen = document.getElementById('timeTrackingScreen');
const confirmationScreen = document.getElementById('confirmationScreen');
const thankYouScreen = document.getElementById('thankYouScreen');

// Login form elements
const loginForm = document.getElementById('loginForm');
const adminLoginForm = document.getElementById('adminLoginForm');
const employeeIdInput = document.getElementById('employeeId');
const employeePinInput = document.getElementById('employeePin');
const adminPasswordInput = document.getElementById('adminPassword');
const loginError = document.getElementById('loginError');
const adminLoginError = document.getElementById('adminLoginError');

// Admin elements
const adminBtn = document.getElementById('adminBtn');
const backToLoginBtn = document.getElementById('backToLoginBtn');
const adminLogoutBtn = document.getElementById('adminLogoutBtn');
const newEmployeeNameInput = document.getElementById('newEmployeeName');
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const resetEmployeeListBtn = document.getElementById('resetEmployeeListBtn');
const employeeList = document.getElementById('employeeList');
const adminMessage = document.getElementById('adminMessage');

// Time tracking elements
const logoutBtn = document.getElementById('logoutBtn');
const employeeName = document.getElementById('employeeName');
const currentTimeDisplay = document.getElementById('currentTime');
const currentDateDisplay = document.getElementById('currentDate');
const clockInBtn = document.getElementById('clockInBtn');
const clockOutBtn = document.getElementById('clockOutBtn');
const messageDisplay = document.getElementById('message');

// Confirmation screen elements
const confirmationTitle = document.getElementById('confirmationTitle');
const confirmIcon = document.getElementById('confirmIcon');
const confirmText = document.getElementById('confirmText');
const notesInput = document.getElementById('notesInput');
const confirmYesBtn = document.getElementById('confirmYesBtn');
const confirmNoBtn = document.getElementById('confirmNoBtn');
const backBtn = document.getElementById('backBtn');

// Thank you screen elements
const thankYouMessage = document.getElementById('thankYouMessage');
const continueBtn = document.getElementById('continueBtn');
const logoutNowBtn = document.getElementById('logoutNowBtn');
const countdownElement = document.getElementById('countdown');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Force reset employee list to ensure new PINs are applied
    resetEmployeeList();
    
    initializeApp();
    setupEventListeners();
    startTimeDisplay();
    updateEmployeeDropdown();
    updateEmployeeList();
});

// Function to reset employee list to new defaults
function resetEmployeeList() {
    const newEmployees = [
        { name: 'Ronnie Flowers', pin: '8472' },
        { name: 'Collin Crabtree', pin: '3951' },
        { name: 'Brad Tanner', pin: '6284' },
        { name: 'Tristan Humbarger', pin: '1749' },
        { name: 'Ethan Radcliff', pin: '5632' },
        { name: 'Julio Lopez', pin: '9187' },
        { name: 'Aiden Radcliff', pin: '2468' },
        { name: 'Ignacio Navarro', pin: '7531' },
        { name: 'Blake Gaylor', pin: '4096' },
        { name: 'Miguel Dominguez', pin: '2857' },
        { name: 'Luciano Lopez', pin: '6714' },
        { name: 'Manuel Ramirez', pin: '3492' },
        { name: 'Joe Hillis', pin: '8765' },
        { name: 'Deron Peters', pin: '1947' },
        { name: 'John Lambert', pin: '5328' },
        { name: 'Avery Dyer', pin: '7689' },
        { name: 'Landon Hammond', pin: '4153' }
    ];
    
    // Clear ALL localStorage data to ensure clean reset
    localStorage.clear();
    
    // Set new employee list
    localStorage.setItem('employees', JSON.stringify(newEmployees));
    employees = newEmployees;
    
    console.log('Employee list reset with new PINs:', employees);
}

function initializeApp() {
    // Check if user is already logged in (from localStorage)
    const savedEmployee = localStorage.getItem('currentEmployee');
    if (savedEmployee) {
        currentEmployee = JSON.parse(savedEmployee);
        showTimeTrackingScreen();
    }
    
    // Clear any error messages on startup
    showLoginError('');
    showAdminLoginError('');
    if (messageDisplay) messageDisplay.textContent = '';
    if (adminMessage) adminMessage.textContent = '';
}

function setupEventListeners() {
    // Login form submission
    loginForm.addEventListener('submit', handleLogin);
    adminLoginForm.addEventListener('submit', handleAdminLogin);
    
    // Admin buttons
    adminBtn.addEventListener('click', showAdminLoginScreen);
    backToLoginBtn.addEventListener('click', showLoginScreen);
    adminLogoutBtn.addEventListener('click', handleAdminLogout);
    
    // Employee management
    addEmployeeBtn.addEventListener('click', addEmployee);
    resetEmployeeListBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset the employee list to defaults? This will remove any custom employees.')) {
            resetEmployeeList();
            updateEmployeeDropdown();
            updateEmployeeList();
            showAdminMessage('Employee list reset to defaults', 'success');
        }
    });
    newEmployeeNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addEmployee();
        }
    });
    
    // Logout button
    logoutBtn.addEventListener('click', handleLogout);
    
    // Clock in/out buttons
    clockInBtn.addEventListener('click', () => showConfirmation('clock-in'));
    clockOutBtn.addEventListener('click', () => showConfirmation('clock-out'));
    
    // Confirmation buttons
    confirmYesBtn.addEventListener('click', handleConfirm);
    confirmNoBtn.addEventListener('click', () => showTimeTrackingScreen());
    backBtn.addEventListener('click', () => showTimeTrackingScreen());
    
    // Continue button
    continueBtn.addEventListener('click', () => showTimeTrackingScreen());
    
    // Logout now button
    logoutNowBtn.addEventListener('click', handleLogout);
    
    // Enter key support for login
    employeeIdInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') loginForm.dispatchEvent(new Event('submit'));
    });
    
    employeePinInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') loginForm.dispatchEvent(new Event('submit'));
    });
    
    adminPasswordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') adminLoginForm.dispatchEvent(new Event('submit'));
    });
}

// Employee Management Functions
// Function to generate a unique 4-digit PIN
function generateUniquePin() {
    const existingPins = employees.map(emp => emp.pin);
    let newPin;
    do {
        newPin = Math.floor(1000 + Math.random() * 9000).toString();
    } while (existingPins.includes(newPin));
    return newPin;
}

function addEmployee() {
    const name = newEmployeeNameInput.value.trim();
    
    if (!name) {
        showAdminMessage('Please enter an employee name', 'error');
        return;
    }
    
    if (employees.some(emp => emp.name === name)) {
        showAdminMessage('Employee already exists', 'error');
        return;
    }
    
    if (name.length > 50) {
        showAdminMessage('Employee name too long (max 50 characters)', 'error');
        return;
    }
    
    const newPin = generateUniquePin();
    const newEmployee = { name: name, pin: newPin };
    
    employees.push(newEmployee);
    localStorage.setItem('employees', JSON.stringify(employees));
    
    updateEmployeeDropdown();
    updateEmployeeList();
    
    newEmployeeNameInput.value = '';
    showAdminMessage(`Employee "${name}" added successfully with PIN: ${newPin}`, 'success');
}

function deleteEmployee(name) {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
        employees = employees.filter(emp => emp.name !== name);
        localStorage.setItem('employees', JSON.stringify(employees));
        
        updateEmployeeDropdown();
        updateEmployeeList();
        
        showAdminMessage(`Employee "${name}" deleted successfully`, 'success');
    }
}

function updateEmployeeDropdown() {
    employeeIdInput.innerHTML = '<option value="">Select Employee</option>';
    employees.forEach(emp => {
        const option = document.createElement('option');
        option.value = emp.name;
        option.textContent = emp.name;
        employeeIdInput.appendChild(option);
    });
}

function updateEmployeeList() {
    employeeList.innerHTML = '';
    
    if (employees.length === 0) {
        employeeList.innerHTML = '<div class="empty-state">No employees added yet. Add your first employee above.</div>';
        return;
    }
    
    employees.forEach(emp => {
        const employeeItem = document.createElement('div');
        employeeItem.className = 'employee-item';
        employeeItem.innerHTML = `
            <div class="employee-info">
                <span class="employee-name">${emp.name}</span>
                <span class="employee-pin">PIN: ${emp.pin}</span>
            </div>
            <button class="delete-employee-btn" onclick="deleteEmployee('${emp.name}')">
                <i class="fas fa-trash"></i>
                Delete
            </button>
        `;
        employeeList.appendChild(employeeItem);
    });
}

// Admin Functions
function handleAdminLogin(e) {
    e.preventDefault();
    
    const password = adminPasswordInput.value.trim();
    
    if (!password) {
        showAdminLoginError('Please enter admin password');
        return;
    }
    
    if (password === ADMIN_PASSWORD) {
        isAdminMode = true;
        adminPasswordInput.value = '';
        showAdminLoginError('');
        showAdminScreen();
        showAdminMessage('Welcome to Admin Mode', 'success');
    } else {
        showAdminLoginError('Incorrect admin password');
    }
}

function handleAdminLogout() {
    isAdminMode = false;
    showLoginScreen();
    showMessage('Exited admin mode', 'info');
}

function showAdminMessage(message, type = 'info') {
    adminMessage.textContent = message;
    adminMessage.className = `message ${type}`;
    
    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            adminMessage.textContent = '';
            adminMessage.className = 'message';
        }, 3000);
    }
}

function showAdminLoginError(message) {
    adminLoginError.textContent = message;
}

// Screen Navigation Functions
function showLoginScreen() {
    loginScreen.classList.add('active');
    adminLoginScreen.classList.remove('active');
    adminScreen.classList.remove('active');
    timeTrackingScreen.classList.remove('active');
    confirmationScreen.classList.remove('active');
    thankYouScreen.classList.remove('active');
}

function showAdminLoginScreen() {
    loginScreen.classList.remove('active');
    adminLoginScreen.classList.add('active');
    adminScreen.classList.remove('active');
    timeTrackingScreen.classList.remove('active');
    confirmationScreen.classList.remove('active');
    thankYouScreen.classList.remove('active');
}

function showAdminScreen() {
    loginScreen.classList.remove('active');
    adminLoginScreen.classList.remove('active');
    adminScreen.classList.add('active');
    timeTrackingScreen.classList.remove('active');
    confirmationScreen.classList.remove('active');
    thankYouScreen.classList.remove('active');
}

function showTimeTrackingScreen() {
    loginScreen.classList.remove('active');
    adminLoginScreen.classList.remove('active');
    adminScreen.classList.remove('active');
    confirmationScreen.classList.remove('active');
    thankYouScreen.classList.remove('active');
    timeTrackingScreen.classList.add('active');
    
    // Update employee name
    if (currentEmployee) {
        employeeName.textContent = currentEmployee.name;
    }
    
    // Update clock status
    updateClockStatus();
}

function showConfirmationScreen() {
    loginScreen.classList.remove('active');
    adminLoginScreen.classList.remove('active');
    adminScreen.classList.remove('active');
    timeTrackingScreen.classList.remove('active');
    thankYouScreen.classList.remove('active');
    confirmationScreen.classList.add('active');
}

function showThankYouScreen(action) {
    loginScreen.classList.remove('active');
    adminLoginScreen.classList.remove('active');
    adminScreen.classList.remove('active');
    timeTrackingScreen.classList.remove('active');
    confirmationScreen.classList.remove('active');
    thankYouScreen.classList.add('active');
    
    // Set appropriate thank you message based on action
    if (action === 'clock-in') {
        thankYouMessage.textContent = `Thank you for clocking in, ${currentEmployee.name}! Don't forget to log out when you're done.`;
    } else {
        thankYouMessage.textContent = `Thank you for clocking out, ${currentEmployee.name}! Don't forget to log out.`;
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const employeeId = employeeIdInput.value.trim();
    const employeePin = document.getElementById('employeePin').value.trim();
    
    if (!employeeId) {
        showLoginError('Please select an employee');
        return;
    }
    
    if (!employeePin) {
        showLoginError('Please enter your PIN');
        return;
    }
    
    if (employeePin.length !== 4 || !/^\d{4}$/.test(employeePin)) {
        showLoginError('PIN must be exactly 4 digits');
        return;
    }
    
    // Find the employee and validate PIN
    const employee = employees.find(emp => emp.name === employeeId);
    if (!employee) {
        showLoginError('Employee not found');
        return;
    }
    
    console.log('Debug - Employee found:', employee);
    console.log('Debug - Entered PIN:', employeePin);
    console.log('Debug - Expected PIN:', employee.pin);
    console.log('Debug - PIN match:', employee.pin === employeePin);
    
    if (employee.pin !== employeePin) {
        showLoginError('Incorrect PIN');
        return;
    }
    
    // Show loading state
    const loginBtn = loginForm.querySelector('.login-btn');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    loginBtn.disabled = true;
    
    try {
        // Store employee info (no webhook needed for login)
        currentEmployee = {
            id: employeeId,
            name: employeeId,
            pin: employeePin,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentEmployee', JSON.stringify(currentEmployee));
        
        // Clear form and show time tracking screen
        loginForm.reset();
        showLoginError('');
        showTimeTrackingScreen();
        showMessage('Login successful!', 'success');
    } catch (error) {
        console.error('Login error:', error);
        showLoginError('Login failed. Please try again.');
    } finally {
        // Restore button state
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
    }
}

function showConfirmation(action) {
    pendingAction = action;
    
    // Update confirmation screen content
    if (action === 'clock-in') {
        confirmationTitle.textContent = 'Confirm Clock In';
        confirmIcon.className = 'fas fa-play';
        confirmText.textContent = 'Are you sure you want to clock in?';
        // Hide notes section for clock in
        document.querySelector('.notes-section').style.display = 'none';
    } else {
        confirmationTitle.textContent = 'Confirm Clock Out';
        confirmIcon.className = 'fas fa-stop';
        confirmText.textContent = 'Are you sure you want to clock out?';
        // Show notes section for clock out
        document.querySelector('.notes-section').style.display = 'block';
    }
    
    // Clear notes
    notesInput.value = '';
    
    // Show confirmation screen
    showConfirmationScreen();
}

async function handleConfirm() {
    if (!currentEmployee) {
        showMessage('Please log in first', 'error');
        return;
    }
    
    try {
        const data = {
            employeeId: currentEmployee.id,
            employeeName: currentEmployee.name,
            timestamp: new Date().toISOString(),
            action: pendingAction,
            date: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
            time: new Date().toLocaleTimeString(),
            notes: notesInput.value.trim()
        };
        
        console.log('Attempting to send data:', data);
        
        const webhookUrl = pendingAction === 'clock-in' ? CONFIG.CLOCK_IN_WEBHOOK : CONFIG.CLOCK_OUT_WEBHOOK;
        console.log('Using webhook URL:', webhookUrl);
        
        const response = await sendToN8n(webhookUrl, data);
        
        console.log('Webhook response received:', response);
        
        // Show thank you screen only on successful webhook response
        showThankYouScreen(pendingAction);
        showMessage(`${pendingAction} successful!`, 'success');
        
    } catch (error) {
        console.error(`${pendingAction} error:`, error);
        showMessage(`Network error: ${error.message}. Please try again.`, 'error');
        showTimeTrackingScreen();
    }
}

function handleLogout() {
    // Clear the auto-logout countdown if it exists
    if (window.autoLogoutInterval) {
        clearInterval(window.autoLogoutInterval);
        window.autoLogoutInterval = null;
    }
    
    // Clear stored data
    localStorage.removeItem('currentEmployee');
    currentEmployee = null;
    isClockedIn = false;
    
    // Reset UI
    showLoginScreen();
    showMessage('Logged out successfully', 'info');
}

function startTimeDisplay() {
    // Update time and date every second
    setInterval(() => {
        const now = new Date();
        
        // Update current time
        currentTimeDisplay.textContent = now.toLocaleTimeString();
        
        // Update current date
        currentDateDisplay.textContent = now.toLocaleDateString();
    }, 1000);
}

function updateClockStatus() {
    // No longer disabling buttons - users can choose either option
    // This function is kept for potential future use
}

function showLoginError(message) {
    loginError.textContent = message;
}

function showMessage(message, type = 'info') {
    messageDisplay.textContent = message;
    messageDisplay.className = `message ${type}`;
    
    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageDisplay.textContent = '';
            messageDisplay.className = 'message';
        }, 3000);
    }
}

async function sendToN8n(webhookUrl, data) {
    // Mock mode for testing
    if (MOCK_MODE) {
        console.log('Mock mode - Data that would be sent to n8n:', data);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Return mock success response
        return {
            success: true,
            employeeName: data.employeeName || data.employeeId,
            message: `${data.action} successful`
        };
    }
    
    // Real n8n integration
    try {
        console.log('Sending data to n8n:', { webhookUrl, data });
        
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'GGG-Hours-Tracker/1.0'
            },
            mode: 'cors',
            body: JSON.stringify(data)
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response error text:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Success response:', result);
        return result;
    } catch (error) {
        console.error('Error sending to n8n:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            webhookUrl: webhookUrl
        });
        throw error;
    }
}

// Utility function to format time
function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Handle page visibility changes (pause timer when tab is not active)
document.addEventListener('visibilitychange', function() {
    if (document.hidden && isClockedIn) {
        // Page is hidden, could implement additional logic here
        console.log('Page hidden - session continues in background');
    }
});

// Handle beforeunload event (warn user if they're clocked in)
window.addEventListener('beforeunload', function(e) {
    if (isClockedIn) {
        e.preventDefault();
        e.returnValue = 'You are currently clocked in. Are you sure you want to leave?';
        return e.returnValue;
    }
}); 
