const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('hello world')
})

{{routes}}

app.listen(3000)
