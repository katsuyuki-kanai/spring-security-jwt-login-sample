document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    errorMessage.classList.add('d-none');
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            // Store access token in localStorage
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('username', data.username);
            localStorage.setItem('role', data.role);
            
            // Redirect to dashboard
            window.location.href = '/dashboard';
        } else {
            const error = await response.json();
            errorMessage.textContent = error.error || 'ログインに失敗しました';
            errorMessage.classList.remove('d-none');
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = 'ネットワークエラーが発生しました';
        errorMessage.classList.remove('d-none');
    }
});
