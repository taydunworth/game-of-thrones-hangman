const express = require('express')
const path = require('path')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const words = require('words.js')
const app = express()
const allWords = words.words

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(
  expressSession({
    secret: 'winter is coming',
    resave: false,
    saveUninitialized: true
  })
)
app.engine('mustache', mustacheExpress())

app.set('views', './views')
app.set('view engine', 'mustache')

app.get('/', function(req, res, next) {
  if (!req.session.splitWord) {
    const wordIndex = Math.floor(Math.random() * allWords.length)
    let wordToGuess = allWords[wordIndex]
    wordToGuess = wordToGuess.toUpperCase()
    console.log(wordToGuess)
    req.session.game = true
    // split the array
    req.session.splitWord = wordToGuess.split('')

    req.session.placeholder = req.session.splitWord.map(v => {
      if (v === ' ') {
        return ' '
      } else {
        return '_'
      }
    })

    req.session.guess = []
    req.session.count = 8
  }
  const _data = {
    guess: req.session.guess,
    placeholder: req.session.placeholder,
    count: req.session.count,
    win: req.session.win,
    lose: req.session.lose,
    game: req.session.game,
    message: req.session.message
  }
  res.render('index', _data)
})

app.post('/add', function(req, res) {
  req.body.letterGuessed = req.body.letterGuessed.toUpperCase()
  if (req.session.splitWord.includes(req.body.letterGuessed)) {
    req.session.splitWord.forEach(function(letter, index) {
      // if that letter has already been guessed
      if (req.session.guess.includes(req.body.letterGuessed)) {
        req.session.message = 'You have already chosen that letter.'
        res.redirect('/')
        // if that letter is the letter the user guessed
      } else if (letter === req.body.letterGuessed) {
        // Replace that *INDEX* within the placeholder with the letter
        req.session.placeholder[index] = letter
      }
    })
  } else {
    req.session.count -= 1
    if (req.session.placeholder.join(',') != req.session.splitWord.join(',') && req.session.count <= 0) {
      req.session.lose = true
      req.session.game = false
    }
  }

  req.session.guess.push({ letter: req.body.letterGuessed })

  if (req.session.placeholder.join(',') === req.session.splitWord.join(',') && req.session.count >= 0) {
    req.session.win = true
    req.session.game = false
  }
  res.redirect('/')
})

app.post('/reset', function(req, res) {
  req.session.splitWord = undefined
  req.session.win = false
  req.session.game = true
  req.session.lose = false
  res.redirect('/')
})

app.listen(3000, function() {
  console.log('Dracarys')
})
