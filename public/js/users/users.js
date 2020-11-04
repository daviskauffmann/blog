const users = JSON.parse(document.currentScript.getAttribute('users'));

users.forEach(user => {
    document.getElementById(`edit-roles-${user.id}`).onclick = e => {
        const input = prompt("Enter a comma-separated list of roles", user.roles);
        if (input !== null) {
            const roles = input.split(',');

            fetch(`/admin/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    roles,
                }),
            }).then(response => {
                if (response.status == 200) {
                    window.location.href = '/admin/users';
                }
            });
        }
    };

    document.getElementById(`delete-${user.id}`).onclick = e => {
        if (confirm("Are you sure you want to delete this user?")) {
            fetch(`/admin/users/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                if (response.status == 200) {
                    window.location.href = '/admin/users';
                }
            });
        }
    };
});
