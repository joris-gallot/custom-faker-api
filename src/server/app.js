const express = require('express')
const app = express()

let router = null
try {
  router = require('./routes')
} catch (error) {
  console.log('no routes find')
}

app.set('views', `${__dirname}/views`)
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index')
})

if (router) {
  router(app)
}

app.listen(3000)
