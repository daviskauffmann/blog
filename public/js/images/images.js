const images = JSON.parse(document.currentScript.getAttribute('images'));

images.forEach(image => {
    document.getElementById(`delete-${image.id}`).onclick = e => {
        if (confirm("Are you sure you want to delete this image?")) {
            fetch(`/admin/images/${image.id}`, {
                method: 'DELETE'
            }).then(response => {
                if (response.status === 200) {
                    window.location.href = '/admin/images';
                }
            });
        }
    };
});
