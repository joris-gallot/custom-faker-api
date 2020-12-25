const fs = require('fs')
const fsPromises = fs.promises

module.exports = () => {
  fs.watch(`${__dirname}/config.json`, (curr, prev) => {
    fs.readFile(`${__dirname}/config.json`, (err, data) => {
      const config = JSON.parse(data.toString())

      Promise.all([
        writeModelFiles(config),
        writeControllerFiles(config),
        writeRouteFiles(config),
      ])
        .then(() => {
          writeRoutesIndexFile(config)
        })
        .catch((err) => {
          console.error(`ERROR: error when creating routes`)
          console.error(err)
          process.exit(1)
        })
    })
  })
}

async function removeFiles(path, reject) {
  const files = fs.readdirSync(`${__dirname}/server/${path}`).filter((file) => {
    return file.endsWith('.js')
  })

  for (const file of files) {
    await fsPromises.unlink(`${__dirname}/server/${path}/${file}`, (err) => {
      if (err) reject(err)
    })
  }
}

function writeModelFiles(config) {
  return new Promise(async (resolve, reject) => {
    await removeFiles('models', reject)

    fs.readFile(`${__dirname}/blueprints/model.bp`, (err, data) => {
      if (err) reject(err)

      for (const model of config) {
        const name = model.name.toLocaleLowerCase()

        let constructAttributes = ''

        model.attributes.forEach((attribute) => {
          constructAttributes += `this.${attribute.name}=faker.${attribute.faker}()\n`
        })

        const content = data
          .toString()
          .replace(/{{model}}/g, name)
          .replace(/{{attributes}}/g, constructAttributes)

        fs.writeFile(
          `${__dirname}/server/models/${name}.js`,
          content,
          (err) => {
            if (err) reject(err)
            resolve()
          }
        )
      }
    })
  })
}

function writeControllerFiles(config) {
  return new Promise(async (resolve, reject) => {
    await removeFiles('controllers', reject)

    fs.readFile(`${__dirname}/blueprints/controller.bp`, (err, data) => {
      if (err) reject(err)

      for (const model of config) {
        const name = model.name.toLocaleLowerCase()
        const content = data.toString().replace(/{{model}}/g, name)

        fs.writeFile(
          `${__dirname}/server/controllers/${name}_controller.js`,
          content,
          (err) => {
            if (err) reject(err)
            resolve()
          }
        )
      }
    })
  })
}

function writeRouteFiles(config) {
  return new Promise(async (resolve, reject) => {
    await removeFiles('routes', reject)

    fs.readFile(`${__dirname}/blueprints/route.bp`, (err, data) => {
      if (err) reject(err)

      for (const model of config) {
        const name = model.name.toLocaleLowerCase()
        const content = data.toString().replace(/{{model}}/g, name)

        fs.writeFile(
          `${__dirname}/server/routes/${name}_routes.js`,
          content,
          (err) => {
            if (err) reject(err)
            resolve()
          }
        )
      }
    })
  })
}

function writeRoutesIndexFile(config) {
  let body = ''
  for (const model of config) {
    const name = model.name.toLocaleLowerCase()
    body += `app.use(require('./${name}_routes'))\n\t`
  }

  const start = 'module.exports = (app) => {\n\t'
  const end = '}'
  const content = start + body + end

  fs.writeFile(`${__dirname}/server/routes/index.js`, content, (err) => {
    if (err) throw err
  })
}
