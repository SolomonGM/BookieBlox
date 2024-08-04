var coinFlipButton = document.getElementById('coinFlipButton');
var outcome = document.querySelector('.outcome');
var coinFlipSound = document.getElementById('coinFlipSound');
var coinFlipUltimate = document.getElementById('coinFlipUltimate');
var coinFlipVictory = document.getElementById('coinFlipVictory');

var isUltimateSound = false;

function getRandomNumber() {
  return Math.floor(Math.random() * 2) + 1;  // Simplified the random number generation
}

function chooseCoinFlipSound() {
    if (Math.random() < 0.1) {
        isUltimateSound = true;
        coinFlipUltimate.play();
    } else {
        isUltimateSound = false;
        coinFlipSound.play();
    }
}

coinFlipButton.addEventListener('click', function() {
    var randomNumber = getRandomNumber();
    outcome.textContent = '';
    outcome.classList.toggle('flip');
    outcome.classList.add('toss');
    coinFlipButton.disabled = true;  // Disable the button
    
    // Check if the ultimate sound was played last time
    if (isUltimateSound) {
        coinFlipVictory.play();
        isUltimateSound = false;  // Reset the ultimate sound flag
        // Ensure the button is re-enabled after coinFlipVictory finishes
        setTimeout(function() {
            coinFlipButton.disabled = false;
        }, coinFlipVictory.duration * 1000);
        return;  // Exit the function early
    }
    
    // Play the regular or ultimate sound
    chooseCoinFlipSound();

    // Animation duration
    var animationDuration = 700;  // Duration in milliseconds

    setTimeout(function() {
        if (randomNumber == 1) {
            outcome.textContent = 'heads';
        } else {
            outcome.textContent = 'tails';
        }
        outcome.classList.remove('toss');

        // Allow the sound to continue playing while re-enabling the button
        setTimeout(function() {
            coinFlipButton.disabled = false;  // Re-enable the button
        }, coinFlipSound.duration * 1000 - animationDuration);  // Ensure the button is re-enabled after the sound finishes
    }, animationDuration);
});
