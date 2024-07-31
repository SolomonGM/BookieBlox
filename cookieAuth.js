async function updateCookies() {
    console.log("Please enter your Roblox cookie into the variable `robloxCookie` and then call the function `submitCookie()`");
}

async function submitCookie() {
    const cookie = window.robloxCookie;
    if (cookie) {
        try {
            const response = await fetch('https://api.roblox.com/v1/auth/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `.ROBLOSECURITY=${cookie}`
                }
            });

            if (response.ok) {
                const userInfo = await response.json();
                const userId = userInfo.UserID;

                // Fetch user profile info
                const userProfileResponse = await fetch(`https://users.roblox.com/v1/users/${userId}`);
                const userProfile = await userProfileResponse.json();

                // Update HTML elements with user information
                document.getElementById('username').innerText = userProfile.name;
                document.getElementById('avatar_image').src = `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=420&height=420&format=png`;
            } else {
                alert('Invalid cookie or unable to fetch user info.');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            alert('Error fetching user info. Please try again.');
        }
    } else {
        console.log('No cookie provided. Please enter your Roblox cookie into the variable `robloxCookie` and then call the function `submitCookie()`');
    }
}