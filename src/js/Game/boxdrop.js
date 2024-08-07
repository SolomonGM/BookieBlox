const block = document.querySelector('.block');
const coin = document.querySelector('.coin');
const oneup = document.querySelector('.oneup');
const audioCoin = document.querySelector('audio#oneup'); // One-up sound (formerly for the coin)
const audioOneUp = document.querySelector('audio#coin'); // Coin sound (formerly for the one-up)

let isAnimating = false; // Flag to track animation state

// Function to play sound
function playSound(isCoin) {
  if (isCoin && audioOneUp) {
    audioOneUp.currentTime = 0;
    audioOneUp.play();  // Play coin sound
  } else if (!isCoin && audioCoin) {
    audioCoin.currentTime = 0;
    audioCoin.play();  // Play one-up sound
  }
}

// Function to generate rain coins
function generateRainCoins() {
  const rainContainer = document.querySelector('.rain-container') || createRainContainer();
  
  for (let i = 0; i < 50; i++) { // Number of coins to rain
    const coinElement = document.createElement('div');
    coinElement.className = 'rain-coins';
    
    // Randomize position and animation delay
    coinElement.style.left = Math.random() * 100 + 'vw';
    coinElement.style.animationDelay = Math.random() * 2 + 's'; // Random delay between 0s and 2s
    
    rainContainer.appendChild(coinElement);

    // Remove the coin from the DOM after the animation
    coinElement.addEventListener('animationend', () => {
      coinElement.remove();
    });
  }
}

// Function to create rain container
function createRainContainer() {
  const container = document.createElement('div');
  container.className = 'rain-container';
  document.body.appendChild(container);
  return container;
}

// Function to handle block hit
function hit(e) {
  if (!e.isTrusted || isAnimating) return; // Check if event is trusted and not already animating
  
  isAnimating = true; // Set flag to true

  // Determine the random chance
  const chance = Math.random(); // Get a random number between 0 and 1
  const isCoin = chance < 0.1; // 10% chance to get the coin

  if (isCoin) {
    coin.classList.add('active');
    generateRainCoins(); // Generate the raining coins animation
    block.classList.add('shake'); // Add shake effect
  } else {
    oneup.classList.add('oneup-active');
  }

  block.classList.add('bounce');
  
  // Play appropriate sound based on the item that appears
  playSound(isCoin);

  // Wait for animations to finish before re-enabling the button
  const animationsDuration = 500; // Duration of shake animation (adjust if needed)
  const coinAnimationDuration = 300; // Duration of coin animation
  const oneUpAnimationDuration = 400; // Duration of one-up animation

  setTimeout(() => {
    block.classList.remove('bounce', 'shake');
    coin.classList.remove('active');
    oneup.classList.remove('oneup-active');
    isAnimating = false; // Reset flag after animations
  }, Math.max(animationsDuration, coinAnimationDuration, oneUpAnimationDuration) + 100); // Ensure all animations complete
}

// Function to remove bounce effect
function removeBounce(e) {
  if (e.animationName !== 'blockbounce') return;
  this.classList.remove('bounce');
}

// Function to remove active coin effect
function removeActive(e) {
  if (e.animationName !== 'coinmove') return;
  this.classList.remove('active');
}

// Function to remove one-up active effect
function removeOneUpActive(e) {
  if (e.animationName !== 'oneupmove') return;
  this.classList.remove('oneup-active');
}

// Function to remove shake effect
function removeShake(e) {
  if (e.animationName !== 'shake') return;
  this.classList.remove('shake');
}

block.addEventListener('webkitAnimationEnd', removeBounce);
block.addEventListener('animationend', removeBounce);

coin.addEventListener('webkitAnimationEnd', removeActive);
coin.addEventListener('animationend', removeActive);

oneup.addEventListener('webkitAnimationEnd', removeOneUpActive);
oneup.addEventListener('animationend', removeOneUpActive);

block.addEventListener('webkitAnimationEnd', removeShake);
block.addEventListener('animationend', removeShake);

block.addEventListener('click', hit);
