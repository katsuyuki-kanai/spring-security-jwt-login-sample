async function loadDashboard() {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
        window.location.href = '/';
        return;
    }
    
    try {
        const response = await fetch('/api/dashboard', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.status === 401 || response.status === 403) {
            console.log('Token expired, attempting to refresh...');
            await refreshToken();
            return loadDashboard();
        }
        
        if (response.ok) {
            const data = await response.json();
            displayUserInfo(data);
        } else {
            console.error('Failed to load dashboard:', response.status);
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error:', error);
        window.location.href = '/';
    }
}

async function refreshToken() {
    try {
        const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken);
            console.log('Token refreshed successfully');
        } else {
            console.error('Failed to refresh token');
            localStorage.removeItem('accessToken');
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        localStorage.removeItem('accessToken');
        window.location.href = '/';
    }
}

async function logout() {
    try {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}` 
            }
        });
    } catch (error) {
        console.error('Error during logout:', error);
    }
    
    localStorage.removeItem('accessToken');
    window.location.href = '/';
}

function displayUserInfo(data) {
    document.getElementById('welcome-message').textContent = data.message;
    document.getElementById('username').textContent = data.username;
    document.getElementById('role').textContent = data.role;
}
