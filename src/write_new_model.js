const fs = require('fs')

module.exports = (model, attributes) => {
  new Promise((resolve) => {
    resolve(
      writeModel(model, attributes),
      writeController(model),
      writeRoute(model)
    )
  })
    .then(() => {
      writeRoutesIndex()
    })
    .catch((error) => {
      console.error(`ERROR: error when creating ${model} routes`)
      console.error(error)
      process.exit(1)
    })
}

function writeModel(model, attributes) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${__dirname}/server/models/base.model`, (err, data) => {
      if (err) reject(err)

      let contructAttributes = ''
      for (const key in attributes) {
        if (attributes.hasOwnProperty(key)) {
          const fakerFuc = attributes[key]
          contructAttributes += `this.${key}=faker.${fakerFuc}()\n`
        }
      }

      const content = data
        .toString()
        .replace(/{{model}}/g, model)
        .replace(/{{attributes}}/g, contructAttributes)

      fs.writeFile(`${__dirname}/server/models/${model}.js`, content, (err) => {
        if (err) reject(err)

        console.log('The model file was succesfully saved!')
        resolve()
      })
    })
  })
}

function writeController(model) {
  return new Promise((resolve, reject) => {
    fs.readFile(
      `${__dirname}/server/controllers/base.controller`,
      (err, data) => {
        if (err) reject(err)

        const content = data.toString().replace(/{{model}}/g, model)

        fs.writeFile(
          `${__dirname}/server/controllers/${model}_controller.js`,
          content,
          (err) => {
            if (err) reject(err)

            console.log('The controller file was succesfully saved!')
            resolve()
          }
        )
      }
    )
  })
}

function writeRoute(model) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${__dirname}/server/routes/base.route`, (err, data) => {
      if (err) reject(err)

      const content = data.toString().replace(/{{model}}/g, model)

      fs.writeFile(
        `${__dirname}/server/routes/${model}_routes.js`,
        content,
        (err) => {
          if (err) reject(err)

          console.log('The route file was succesfully saved!')
          resolve()
        }
      )
    })
  })
}

function writeRoutesIndex() {
  let body = ''
  fs.readdirSync(`${__dirname}/server/models`)
    .filter((file) => {
      return file !== 'base.model'
    })
    .forEach((file) => {
      body += `app.use(require('./${file.replace('.js', '')}_routes'))\n`
    })

  const start = 'module.exports = (app) => {\n\t'
  const end = '}'
  const content = start + body + end

  fs.writeFile(`${__dirname}/server/routes/index.js`, content, (err) => {
    if (err) throw err

    console.log('The app file was succesfully saved!')
  })
}
