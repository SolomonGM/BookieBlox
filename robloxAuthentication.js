const ProfileUser = document.getElementById("User"); 
const userInfoUrl = "https://users.roblox.com/v1/users/authenticated";

const robloxCookieWarning = "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_";
const robloxCookieToken = "#"; //Replace with roblox cookie. 
const robloxCookie = `.ROBLOSECURITY=${robloxCookieWarning}${robloxCookieToken}`

async function getUserInfo(){
    try {
        const response = await fetch(userInfoUrl, {
            method: 'GET',
            headers: {
                'Cookie': robloxCookie,
                'Content-type': "application/json" 
            },
            credentials: 'include'    
        });

        if(!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        const username = data.name; 
        const id = data.id;
        const displayName = data.displayName;

        console.log(`Username: ${username}`)
        console.log(`ID: ${id}`);
        console.log(`Display Name: ${displayName}`);

        ProfileUser.textContent = username;
    } catch (error) {
        console.error('Failed to fetch user information:', error);
    }
}


getUserInfo();
