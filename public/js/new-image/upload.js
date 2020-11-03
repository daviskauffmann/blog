let file;
document.getElementById('file').onchange = e => {
    file = e.target.files[0];
};

document.getElementById('upload').onclick = () => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const data = reader.result;
        fetch('/admin/images', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filename: file.name,
                data,
            }),
        }).then(response => {
            if (response.status === 201) {
                window.location.href = '/admin/images';
            }
        });
    };
};
