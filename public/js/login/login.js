document.getElementById('login').onclick = e => {
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
        }),
    }).then(response => {
        if (response.status === 200) {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('returnurl')) {
                window.location.href = urlParams.get('returnurl')
            } else {
                window.location.href = '/';
            }
        }
    });
};
