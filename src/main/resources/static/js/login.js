async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showError('ユーザー名とパスワードを入力してください');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken);
            window.location.href = '/dashboard';
        } else {
            showError('ログインに失敗しました。ユーザー名またはパスワードが正しくありません。');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('エラーが発生しました。もう一度お試しください。');
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.classList.remove('d-none');
    
    setTimeout(() => {
        errorDiv.classList.add('d-none');
    }, 5000);
}

document.getElementById('username').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        login();
    }
});

document.getElementById('password').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        login();
    }
});
