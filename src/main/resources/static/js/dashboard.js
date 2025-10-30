async function fetchWithAuth(url, options = {}) {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
        window.location.href = '/';
        return;
    }
    
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        ...options.headers
    };
    
    let response = await fetch(url, { ...options, headers, credentials: 'include' });
    
    // If token expired, try to refresh
    if (response.status === 401 || response.status === 403) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
            // Retry the request with new token
            const newAccessToken = localStorage.getItem('accessToken');
            headers['Authorization'] = `Bearer ${newAccessToken}`;
            response = await fetch(url, { ...options, headers, credentials: 'include' });
        } else {
            window.location.href = '/';
            return;
        }
    }
    
    return response;
}

async function refreshAccessToken() {
    try {
        const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Token refresh error:', error);
        return false;
    }
}

async function loadDashboard() {
    const loading = document.getElementById('loading');
    const content = document.getElementById('dashboard-content');
    const errorMessage = document.getElementById('error-message');
    
    try {
        const response = await fetchWithAuth('/api/dashboard');
        
        if (response && response.ok) {
            const data = await response.json();
            
            document.getElementById('welcome-message').textContent = data.message;
            document.getElementById('user-username').textContent = data.username;
            document.getElementById('user-role').textContent = data.role;
            
            loading.classList.add('d-none');
            content.classList.remove('d-none');
        } else {
            throw new Error('Failed to load dashboard');
        }
    } catch (error) {
        console.error('Dashboard error:', error);
        errorMessage.textContent = 'ダッシュボードの読み込みに失敗しました';
        errorMessage.classList.remove('d-none');
        loading.classList.add('d-none');
    }
}

document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
        await fetchWithAuth('/api/auth/logout', { method: 'POST' });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        window.location.href = '/';
    }
});

// Load dashboard on page load
loadDashboard();
