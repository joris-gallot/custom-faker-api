const fs = require('fs')
const config = require('./config.json')
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

module.exports = async (model) => {
  try {
    await writeConfigFile(model)

    rl.close()
    console.log(`Route ${model.name} ready!`)
  } catch (error) {
    console.error(`ERROR: error when creating ${model.name} routes`)
    console.error(error)
    rl.close()
    process.exit(1)
  }
}

function writeModelInConfig(model, resolve, reject) {
  const models = config.filter((m) => m.name !== model.name)
  const content = [...models, model]

  fs.writeFile(`${__dirname}/config.json`, JSON.stringify(content), (err) => {
    if (err) reject(err)

    resolve()
  })
}

function writeConfigFile(model) {
  return new Promise((resolve, reject) => {
    const modelExist = !!config.find((m) => m.name === model.name)

    if (modelExist) {
      console.warn(`WARNING: model "${model.name}" already exist`)

      rl.question('Continue and overrite model ? (y/N) ', (answer) => {
        answer = answer.toLocaleLowerCase()

        if (answer === 'y' || answer === 'yes') {
          writeModelInConfig(model, resolve, reject)
        } else {
          console.log('Canceled')
          process.exit(1)
        }
      })
    } else {
      writeModelInConfig(model, resolve, reject)
    }
  })
}
