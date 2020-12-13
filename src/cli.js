const WriteNewModel = require('./write_new_model')
const yargs = require('yargs')
const TYPES = [
  'STRING',
  'TEXT',
  'DATE',
  'FLOAT',
  'INTEGER',
  'DOUBLE',
  'UUID',
  'JSON',
  'BLOB',
]
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
          const value = atribute.split(':')[1].trim().toUpperCase()

          if (TYPES.includes(value)) {
            attributes[key] = value
          } else {
            console.error(`ERROR: "${key}" type is not correct`)
            console.error(`Available types: ${TYPES}`)
            yargs.exit(1)
          }
        } else {
          console.error(`ERROR: incorect arguments`)
          console.error(
            `Example: caf model:generate user fisrtname:string lastname:number`
          )
          yargs.exit(1)
        }
      }
      WriteNewModel(model, attributes)
    }
  )
  .help().argv
