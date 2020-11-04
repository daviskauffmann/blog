const email = document.currentScript.getAttribute('email');

document.getElementById('send-password-reset-link').onclick = e => {
    fetch('/send-password-reset-link', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
        }),
    }).then(response => {
        if (response.status === 200) {
            window.location.href = '/';
        }
    });
};
