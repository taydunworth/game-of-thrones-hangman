const hodorModeBtn = document.querySelector('.hodor-mode-btn')
const subtext = document.querySelector('.subtext')
const guessALetter = document.querySelector('.guess-a-letter')
const attempts = document.querySelector('.attempts')
const lettersGuessed = document.querySelector('.guess')

hodorModeBtn.addEventListener('click', function() {
  if (subtext.textContent === 'HODOR') {
    subtext.textContent = 'When you play the game of thrones, you win or you die.'
    guessALetter.textContent = 'Guess a Letter'
    attempts.textContent = 'Attempts Left:'
    lettersGuessed.textContent = 'Letters Guessed'
  } else {
    subtext.textContent = 'HODOR'
    guessALetter.textContent = 'HODOR'
    attempts.textContent = 'HODOR:'
    lettersGuessed.textContent = 'HODOR'
  }
})
