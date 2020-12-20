const express = require('express')
const app = express()
const configWatchers = require('./watch_config')
const config = require('./config.json')

let router = null
try {
  router = require('./server/routes')
} catch (error) {
  console.warn('no routes find')
}

configWatchers()
app.use(express.static(__dirname))

app.set('views', `${__dirname}/views`)
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index', {
    models: config,
  })
})

if (router) {
  router(app)
}

app.listen(3000)
