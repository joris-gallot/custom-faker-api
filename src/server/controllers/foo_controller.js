const foo = require('../models/foo')

module.exports = {
  get(req, res) {
    const per = req.query.per || 30
    const foos = []

    for (let i = 0; i < per; i++) {
      foos.push(new foo())
    }

    res.status(200).send(foos)
  },
}
