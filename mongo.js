const mongoose = require('mongoose')

const password = process.argv[2]
const DB_REMOTE = `mongodb+srv://miky:${password}@cluster0.dyfa5.mongodb.net/phoneguide-app?retryWrites=true`

mongoose.connect(DB_REMOTE)
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  )
  process.exit(1)
}

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then((people) => {
    people.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length > 3 && process.argv.length !== 4) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then((res) => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else if (process.argv.length === 4 || process.argv.length > 5) {
  console.log(
    'Number of arguments invalid. (Usage example: node mongo.js <password> <name> <number>)'
  )
  mongoose.connection.close()
}
