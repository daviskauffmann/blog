Array.from(document.getElementsByTagName('button')).forEach(element => {
    element.onclick = e => {
        fetch(`/admin/images/${element.id}`, {
            method: 'DELETE'
        }).then(response => {
            if (response.status === 200) {
                window.location.href = '/admin/images';
            }
        });
    };
});
