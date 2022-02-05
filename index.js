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
  Person.find({})
    .then((people) => res.status(200).json(people))
    .catch((err) => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const { body } = req

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'content missing',
    })
  }

  const personObj = new Person({
    name: body.name,
    number: body.number,
  })

  personObj
    .save()
    .then((savedPerson) => {
      res.status(201).json(savedPerson.toJSON())
    })
    .catch((err) => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  const { id } = req.params
  Person.findById(id)
    .then((person) => {
      person ? res.status(200).json(person) : res.status(404).end()
    })
    .catch((err) => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const { id } = req.params
  Person.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end()
    })
    .catch((err) => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { id } = req.params
  const { body } = req

  const personObj = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(id, personObj, { new: true, runValidators: true })
    .then((updatedPerson) => res.status(200).json(updatedPerson))
    .catch((err) => next(err))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT || 5005
app.listen(PORT, () => {
  console.log(`Server 🏃 on port ${PORT}`)
})
