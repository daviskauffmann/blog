document.getElementById('reset-password').onclick = () => {
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    if (newPassword !== confirmPassword) {
        console.error('Passwords do not match');
        return;
    }
    fetch(`/reset-password${window.location.search}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            newPassword,
        }),
    }).then(response => {
        if (response.status === 200) {
            window.location.href = '/';
        }
    });
};
