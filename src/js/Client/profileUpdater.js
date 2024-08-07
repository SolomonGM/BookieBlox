const updateProfile = async () => {
    try {
        // Fetch the JSON data from the server using Axios
        const response = await axios.get('http://localhost:3000/data/refreshed_cookie.json');

        // Extract data from the response
        const data = response.data;

        // Check if data fields are present
        if (!data.Username || !data.AccountBalanceRobux) {
            throw new Error('Missing required data fields');
        }

        // Extract required fields from the JSON data
        const username = data.Username;
        const balance = data.AccountBalanceRobux;

        // Update the DOM with the extracted information
        document.getElementById('username').textContent = username;
        document.getElementById('balance').textContent = `Balance: ${balance}`;

    } catch (error) {
        console.error('Failed to update profile:', error);
        // Handle errors, e.g., display a message to the user
        document.getElementById('username').textContent = 'Error loading profile';
        document.getElementById('balance').textContent = 'Balance: Error';
    }
};

// Ensure the function runs when the button is clicked
document.getElementById('update-profile-btn').addEventListener('click', updateProfile);
