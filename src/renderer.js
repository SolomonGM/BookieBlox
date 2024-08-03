console.log('Renderer process working.');

const axios = require('axios');
const cookieToken = '#';

async function getCryptoData() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    document.getElementById('content').innerText = `Ethereum Price: $${response.data.ethereum.usd}`;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function getUserInfo() {
  try {
    const response = await axios.get('https://users.roblox.com/v1/users/authenticated', {
        headers: {
          'Cookie': `.ROBLOSECURITY=${cookieToken}`,
          'Content-Type' : 'application/json' 
        }
      });
        console.log(response.data.name);
    } catch (err) {
        console.log(`Error while fetching User information,`, err.message);
    }
}

getUserInfo();
getCryptoData();