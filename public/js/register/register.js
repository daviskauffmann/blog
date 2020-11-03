document.getElementById('register').onclick = () => {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    if (password !== confirmPassword) {
        console.error('Passwords do not match');
        return;
    }
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password,
            email: document.getElementById('email').value,
        }),
    }).then(response => {
        if (response.status === 201) {
            window.location.href = '/';
        }
    });
};
