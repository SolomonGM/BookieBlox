document.getElementById('useridForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const profileID = document.getElementById('profileID').value;
    const url = `https://users.roblox.com/v1/users/${profileID}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        return response.json();
        })
        .then(data => {
            const userInfoDiv = document.getElementById('userInfo');
            userInfoDiv.innerHTML = `<p><strong>Username:</strong> ${data.name}</p>`;
        })
        .catch(error => {
            alert('Error fetching information')     
        });
});