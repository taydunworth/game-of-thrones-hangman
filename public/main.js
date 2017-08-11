const hodorModeBtn = document.querySelector('.hodor-mode-btn')
const subtext = document.querySelector('.subtext')
const guessALetter = document.querySelector('.guess-a-letter')
const attempts = document.querySelector('.attempts')
const lettersGuessed = document.querySelector('.guess')

hodorModeBtn.addEventListener('click', function() {
  subtext.textContent = 'Hodor'
  guessALetter.textContent = 'Hodor'
  attempts.textContent = 'Hodor'
  lettersGuessed.textContent = 'Hodor'
})
