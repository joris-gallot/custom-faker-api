const express = require('express')
const app = express()

app.set('views', `${__dirname}/views`)
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index')
})

app.use(require('./routes/foo_routes'))

app.listen(3000)
