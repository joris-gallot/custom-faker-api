const WriteNewModel = require('./write_new_model')
const yargs = require('yargs')
const faker = require('faker')
yargs
  .command(
    'model:generate <model> [attributes..]',
    'Generate model routes',
    () => {},
    (argv) => {
      const model = argv.model
      let attributes = {}

      for (const atribute of argv.attributes) {
        if (atribute.includes(':') && atribute.split(':').length === 2) {
          const key = atribute.split(':')[0].trim()
          const fakerFunc = atribute.split(':')[1].trim()

          try {
            faker[fakerFunc.split('.')[0]][fakerFunc.split('.')[1]]() // test faker function

            attributes[key] = fakerFunc
          } catch (error) {
            console.error('ERROR: faker argument must exist')
            console.error(
              'Available arguments are here: https://github.com/marak/Faker.js/#api-methods'
            )
            console.error(
              `Example: caf model:generate user firstname:string:name.firstName lastname:number:name.lastName`
            )
            yargs.exit(1)
          }
        } else {
          console.error(`ERROR: incorect arguments`)
          console.error(
            `Example: caf model:generate user firstname:string:name.firstName lastname:number:name.lastName`
          )
          yargs.exit(1)
        }
      }
      WriteNewModel(model, attributes)
    }
  )
  .help().argv
