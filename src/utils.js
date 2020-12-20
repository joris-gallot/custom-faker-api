const fs = require('fs')

module.exports = {
  getModels() {
    return fs
      .readdirSync(`${__dirname}/server/models`)
      .filter((file) => {
        return !file.startsWith('.')
      })
      .map((file) => file.replace('.js', ''))
  },
  custructModelObject(model, attributes) {
    return {
      name: model,
      attributes: Object.entries(attributes).map(([key, value]) => ({
        name: key,
        faker: value,
      })),
    }
  },
}
