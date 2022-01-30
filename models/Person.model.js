const mongoose = require('mongoose')

const DB_REMOTE = process.env.DB_REMOTE

console.log('Connecting to DB...')

mongoose
  .connect(DB_REMOTE)
  .then((res) => console.log('Successfuly connected to MongoDB 💻'))
  .catch((err) => console.log('Error connecting to MongoDB: ', err.message))

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
