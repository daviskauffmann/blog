document.getElementById('logout').onclick = e => {
    fetch('/logout', {
        method: 'POST',
    }).then(response => {
        window.location.href = '/';
    });
};
