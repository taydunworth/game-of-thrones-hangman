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
    lose: req.session.lose
  }
  res.render('index', _data)
})

app.post('/add', function(req, res) {
  req.body.letterGuessed = req.body.letterGuessed.toUpperCase()
  if (req.session.splitWord.includes(req.body.letterGuessed)) {
    req.session.splitWord.forEach(function(letter, index) {
      // if that letter is the letter the user guessed
      if (letter === req.body.letterGuessed) {
        // Replace that *INDEX* within the placeholder with the letter
        req.session.placeholder[index] = letter
      }
    })
  } else {
    req.session.count -= 1
    if (req.session.placeholder.join(',') != req.session.splitWord.join(',') && req.session.count <= 0) {
      req.session.lose = true
    }
  }

  req.session.guess.push({ letter: req.body.letterGuessed })

  if (req.session.placeholder.join(',') === req.session.splitWord.join(',') && req.session.count >= 0) {
    req.session.win = true
  }
  res.redirect('/')
})

app.post('/reset', function(req, res) {
  req.session.splitWord = undefined
  res.redirect('/')
})

app.listen(3000, function() {
  console.log('Successfully started express application!')
})
