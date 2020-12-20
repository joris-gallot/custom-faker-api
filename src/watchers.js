const fs = require('fs')
const fsPromises = fs.promises

module.exports = () => {
  fs.watch(`${__dirname}/config.json`, (curr, prev) => {
    writeModelFiles()
    writeControllerFiles()
    writeRouteFiles()
    writeRoutesIndexFile()
  })
}

async function removeFiles(path) {
  const files = fs.readdirSync(`${__dirname}/server/${path}`).filter((file) => {
    return file.endsWith('.js')
  })

  for (const file of files) {
    await fsPromises.unlink(`${__dirname}/server/${path}/${file}`, (err) => {
      if (err) throw err
    })
  }
}

async function writeModelFiles() {
  const config = require('./config.json')
  await removeFiles('models')

  fs.readFile(`${__dirname}/blueprints/model.bp`, (err, data) => {
    if (err) throw err

    for (const model of config) {
      const name = model.name.toLocaleLowerCase()

      let constructAttributes = ''

      model.attributes.forEach((attribute) => {
        constructAttributes += `this.${attribute.name}=faker.${attribute.faker}()\n`
      })

      const content = data
        .toString()
        .replace(/{{model}}/g, model.name)
        .replace(/{{attributes}}/g, constructAttributes)

      fs.writeFile(`${__dirname}/server/models/${name}.js`, content, (err) => {
        if (err) throw err
      })
    }
  })
}

async function writeControllerFiles() {
  const config = require('./config.json')
  await removeFiles('controllers')

  fs.readFile(`${__dirname}/blueprints/controller.bp`, (err, data) => {
    if (err) throw err

    for (const model of config) {
      const name = model.name.toLocaleLowerCase()
      const content = data.toString().replace(/{{model}}/g, model.name)

      fs.writeFile(
        `${__dirname}/server/controllers/${name}_controller.js`,
        content,
        (err) => {
          if (err) throw err
        }
      )
    }
  })
}

async function writeRouteFiles() {
  const config = require('./config.json')
  await removeFiles('routes')

  fs.readFile(`${__dirname}/blueprints/route.bp`, (err, data) => {
    if (err) throw err

    for (const model of config) {
      const name = model.name.toLocaleLowerCase()
      const content = data.toString().replace(/{{model}}/g, model.name)

      fs.writeFile(
        `${__dirname}/server/routes/${name}_routes.js`,
        content,
        (err) => {
          if (err) throw err
        }
      )
    }
  })
}

function writeRoutesIndexFile() {
  const config = require('./config.json')

  let body = ''
  for (const model of config) {
    const name = model.name.toLocaleLowerCase()
    body += `app.use(require('./${name}_routes'))\n`
  }

  const start = 'module.exports = (app) => {\n\t'
  const end = '}'
  const content = start + body + end

  fs.writeFile(`${__dirname}/server/routes/index.js`, content, (err) => {
    if (err) throw err
  })
}
