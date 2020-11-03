document.getElementById('change-password').onclick = e => {
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    if (newPassword !== confirmPassword) {
        console.error('Passwords do not match');
        return;
    }
    fetch(`/change-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            currentPassword: document.getElementById('current-password').value,
            newPassword,
        }),
    }).then(response => {
        window.location.href = '/';
    });
};
