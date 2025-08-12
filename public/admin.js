// Admin Panel JavaScript
let isAuthenticated = false;
let petTypeChart = null;
let activityChart = null;

// DOM Elements
const loginForm = document.getElementById('loginForm');
const adminDashboard = document.getElementById('adminDashboard');
const authForm = document.getElementById('authForm');
const adminLoginInput = document.getElementById('adminLogin');
const adminPasswordInput = document.getElementById('adminPassword');
const logoutBtn = document.getElementById('logoutBtn');
const refreshBtn = document.getElementById('refreshBtn');
const exportBtn = document.getElementById('exportBtn');

// Check if already authenticated
window.addEventListener('load', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        isAuthenticated = true;
        showDashboard();
        loadDashboardData();
    } else {
        // Если не вошли, показываем форму входа
        showLoginForm();
    }
});

// Authentication
authForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const login = adminLoginInput.value.trim();
    const password = adminPasswordInput.value.trim();
    
    if (!login || !password) {
        showMessage('Введите логин и пароль', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login, password })
        });
        
        if (response.ok) {
            isAuthenticated = true;
            localStorage.setItem('isLoggedIn', 'true');
            showDashboard();
            loadDashboardData();
            showMessage('Успешный вход в систему', 'success');
        } else {
            showMessage('Неверный логин или пароль', 'error');
        }
    } catch (error) {
        showMessage('Ошибка подключения к серверу', 'error');
        console.error('Error:', error);
    }
});

// Logout
logoutBtn.addEventListener('click', function() {
    isAuthenticated = false;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    
    // Destroy charts
    if (petTypeChart) {
        petTypeChart.destroy();
        petTypeChart = null;
    }
    if (activityChart) {
        activityChart.destroy();
        activityChart = null;
    }
    
    // Показываем форму входа
    showLoginForm();
});

// Refresh data
refreshBtn.addEventListener('click', function() {
    loadDashboardData();
});

// Export data
exportBtn.addEventListener('click', async function() {
    try {
        const response = await fetch('/api/admin/export');
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `clients_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            showMessage('Данные успешно экспортированы', 'success');
        } else {
            showMessage('Ошибка при экспорте данных', 'error');
        }
    } catch (error) {
        showMessage('Ошибка при экспорте данных', 'error');
        console.error('Error:', error);
    }
});

// Show/Hide functions
function showDashboard() {
    loginForm.style.display = 'none';
    adminDashboard.style.display = 'block';
}

function showLoginForm() {
    loginForm.style.display = 'flex';
    adminDashboard.style.display = 'none';
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // Load statistics
        const statsResponse = await fetch('/api/admin/stats');
        
        if (statsResponse.ok) {
            const stats = await statsResponse.json();
            updateStatistics(stats);
        }
        
        // Load clients
        const clientsResponse = await fetch('/api/admin/clients');
        
        if (clientsResponse.ok) {
            const clients = await clientsResponse.json();
            updateClientsTable(clients);
            updateCharts(clients);
        }
        
    } catch (error) {
        showMessage('Ошибка загрузки данных', 'error');
        console.error('Error:', error);
    }
}

// Update statistics
function updateStatistics(stats) {
    document.getElementById('totalClients').textContent = stats.totalClients || 0;
    
    // Calculate today's clients
    const today = new Date().toDateString();
    const todayClients = stats.totalClients || 0; // This would need backend logic for actual today count
    
    document.getElementById('todayClients').textContent = todayClients;
    document.getElementById('dogClients').textContent = stats.petTypeStats?.собака || 0;
    document.getElementById('catClients').textContent = stats.petTypeStats?.кошка || 0;
}

// Update clients table
function updateClientsTable(clients) {
    const tbody = document.getElementById('clientsTableBody');
    
    if (clients.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <i class="fas fa-users"></i>
                    <p>Пока нет клиентов</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = clients.map(client => `
        <tr>
            <td>${client.id}</td>
            <td>${client.first_name}</td>
            <td>${client.last_name}</td>
            <td>${client.phone || '-'}</td>
            <td>${client.email || '-'}</td>
            <td>${client.pet_name || '-'}</td>
            <td>${client.pet_type || '-'}</td>
            <td>${new Date(client.created_at).toLocaleDateString('ru-RU')}</td>
        </tr>
    `).join('');
}

// Update charts
function updateCharts(clients) {
    // Pet type chart
    const petTypeCtx = document.getElementById('petTypeCanvas');
    if (petTypeCtx) {
        if (petTypeChart) {
            petTypeChart.destroy();
        }
        
        const petTypeData = processPetTypeData(clients);
        
        petTypeChart = new Chart(petTypeCtx, {
            type: 'doughnut',
            data: {
                labels: petTypeData.labels,
                datasets: [{
                    data: petTypeData.values,
                    backgroundColor: [
                        '#4f46e5',
                        '#06b6d4',
                        '#f59e0b',
                        '#10b981',
                        '#ef4444',
                        '#8b5cf6'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Activity chart
    const activityCtx = document.getElementById('activityCanvas');
    if (activityCtx) {
        if (activityChart) {
            activityChart.destroy();
        }
        
        const activityData = processActivityData(clients);
        
        activityChart = new Chart(activityCtx, {
            type: 'line',
            data: {
                labels: activityData.labels,
                datasets: [{
                    label: 'Количество клиентов',
                    data: activityData.values,
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
}

// Process pet type data for chart
function processPetTypeData(clients) {
    const petTypes = {};
    
    clients.forEach(client => {
        if (client.pet_type) {
            petTypes[client.pet_type] = (petTypes[client.pet_type] || 0) + 1;
        }
    });
    
    return {
        labels: Object.keys(petTypes),
        values: Object.values(petTypes)
    };
}

// Process activity data for chart
function processActivityData(clients) {
    const last7Days = [];
    const today = new Date();
    
    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        last7Days.push(date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' }));
    }
    
    // Count clients per day
    const activityData = {};
    last7Days.forEach(date => {
        activityData[date] = 0;
    });
    
    clients.forEach(client => {
        const clientDate = new Date(client.created_at).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' });
        if (activityData.hasOwnProperty(clientDate)) {
            activityData[clientDate]++;
        }
    });
    
    return {
        labels: last7Days,
        values: Object.values(activityData)
    };
}

// Show message function
function showMessage(text, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    // Insert at the top of dashboard main
    const dashboardMain = document.querySelector('.dashboard-main');
    dashboardMain.insertBefore(message, dashboardMain.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        message.remove();
    }, 5000);
}

// Auto-refresh every 5 minutes
setInterval(() => {
    if (isAuthenticated) {
        loadDashboardData();
    }
}, 5 * 60 * 1000);

 