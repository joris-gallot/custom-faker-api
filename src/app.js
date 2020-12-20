const express = require('express')
const app = express()
const { getModels } = require('./utils')
const configWatchers = require('./watchers')
let router = null
try {
  router = require('./server/routes')
} catch (error) {
  console.warn('no routes find')
}

configWatchers()
app.set('views', `${__dirname}/views`)
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index', {
    models: getModels(),
  })
})

if (router) {
  router(app)
}

app.listen(3000)
