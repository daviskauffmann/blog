document.getElementById('send-password-reset-link').onclick = () => {
    fetch('/send-password-reset-link', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: document.getElementById('email').value,
        }),
    }).then(response => {
        if (response.status === 200) {
            window.location.href = '/';
        }
    });
};
