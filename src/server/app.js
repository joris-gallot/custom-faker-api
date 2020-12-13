const express = require('express')
const app = express()
const router = require('./routes')

app.set('views', `${__dirname}/views`)
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index')
})

router(app)

app.listen(3000)
