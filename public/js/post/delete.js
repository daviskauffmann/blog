document.getElementById('delete').onclick = e => {
    fetch('/admin/posts/<%= post.id %>', {
        method: 'DELETE',
    }).then(response => {
        if (response.status === 200) {
            window.location.href = '/';
        }
    });
};
