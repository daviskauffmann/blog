document.getElementById('resend-email-verification').onclick = e => {
    fetch('/resend-email-verification', {
        method: 'POST',
    });
};
