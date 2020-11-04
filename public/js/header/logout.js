document.getElementById('logout').onclick = e => {
    e.preventDefault();

    fetch('/logout', {
        method: 'POST',
    }).then(response => {
        window.location.href = '/';
    });
};
