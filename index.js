require('dotenv').config()
const express = require('express')
const morganBody = require('morgan-body')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const Person = require('./models/Person.model')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

app.use(bodyParser.json())
morganBody(app)

app.get('/api/persons', (req, res) => {
  Person.find({}).then((people) => res.status(200).json(people))
})

app.post('/api/persons', (req, res) => {
  const { body } = req

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'content missing',
    })
  }

  const personObj = new Person({
    id: Date.now(),
    name: body.name,
    number: body.number,
  })

  Person.find({})
    .then((people) => {
      people.forEach((person) => {
        if (person.name === body.name || person.number === body.number) {
          return res
            .status(402)
            .json({
              error: 'fields must be unique',
            })
            .end()
        }
      })
      personObj
        .save()
        .then((savedPerson) => {
          res.status(201).json(savedPerson)
        })
        .catch((err) => console.error(err.message))
    })
    .catch((err) => console.error(err.message))
})

app.get('/api/persons/:id', (req, res) => {
  const { id } = req.params
  Person.findById(id)
    .then((person) => {
      res.status(200).json(person)
    })
    .catch((err) =>
      res.status(404).json({
        error: 'person not found',
      })
    )
})

app.delete('/api/persons/:id', (req, res) => {
  const { id } = req.params
  Person.findByIdAndDelete(id).then(() => {
    res.status(204).end()
  })
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 5005
app.listen(PORT, () => {
  console.log(`Server 🏃 on port ${PORT}`)
})
