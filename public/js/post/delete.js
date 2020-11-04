const id = document.currentScript.getAttribute('post-id');

document.getElementById('delete').onclick = e => {
    if (confirm("Are you sure you want to delete this post?")) {
        fetch(`/admin/posts/${id}`, {
            method: 'DELETE',
        }).then(response => {
            if (response.status === 200) {
                window.location.href = '/';
            }
        });
    }
};
