const fs = require('fs')

module.exports = (model, attributes) => {
  writeModel(model, attributes)
  writeController(model)
  writeRoute(model)
  writeApp()
}

function writeModel(model, attributes) {
  fs.readFile(`${__dirname}/server/models/base.model`, (err, data) => {
    if (err) {
      throw err
    }

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
      if (err) throw err

      console.log('The model file was succesfully saved!')
    })
  })
}

function writeController(model) {
  fs.readFile(
    `${__dirname}/server/controllers/base.controller`,
    (err, data) => {
      if (err) {
        throw err
      }

      const content = data.toString().replace(/{{model}}/g, model)

      fs.writeFile(
        `${__dirname}/server/controllers/${model}_controller.js`,
        content,
        (err) => {
          if (err) throw err

          console.log('The controller file was succesfully saved!')
        }
      )
    }
  )
}

function writeRoute(model) {
  fs.readFile(`${__dirname}/server/routes/base.route`, (err, data) => {
    if (err) {
      throw err
    }

    const content = data.toString().replace(/{{model}}/g, model)

    fs.writeFile(
      `${__dirname}/server/routes/${model}_routes.js`,
      content,
      (err) => {
        if (err) throw err

        console.log('The route file was succesfully saved!')
      }
    )
  })
}

function writeApp() {
  fs.readFile(`${__dirname}/server/base.app`, (err, data) => {
    if (err) {
      throw err
    }

    let routes = ''
    fs.readdirSync(`${__dirname}/server/models`)
      .filter((file) => {
        return file !== 'base.model'
      })
      .forEach((file) => {
        routes += `app.use(require('./routes/${file.replace(
          '.js',
          ''
        )}_routes'))\n`
      })

    const content = data.toString().replace(/{{routes}}/g, routes)

    fs.writeFile(`${__dirname}/server/app.js`, content, (err) => {
      if (err) throw err

      console.log('The app file was succesfully saved!')
    })
  })
}
