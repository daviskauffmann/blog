let file;
document.getElementById('file').onchange = e => {
    file = e.target.files[0];
};

document.getElementById('post').onclick = () => {
    const reader = new FileReader();
    reader.readAsText(document.getElementById('file').files[0]);
    reader.onload = e => {
        const content = e.target.result;
        fetch('/admin/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: document.getElementById('title').value,
                content,
            }),
        }).then(response => {
            if (response.status === 201) {
                response.json().then(post => {
                    window.location.href = `/posts/${post.slug}`;
                });
            }
        });
    };
};
