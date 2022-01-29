const express = require('express')
const persons = require('./data.json')
const morganBody = require('morgan-body')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

app.use(bodyParser.json())
morganBody(app)

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.post('/api/persons', (req, res) => {
  const { body } = req

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'content missing',
    })
  }

  const person = {
    id: Date.now(),
    name: body.name,
    number: body.number,
  }

  persons.find((person) => {
    if (person.name === body.name) {
      return res.status(401).json({
        error: 'name must be unique',
      })
    }
  })
  persons.push(person)
  res.status(201).json(person)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find((person) => person.id === id)
  person
    ? res.status(200).json(person)
    : res.status(404).json({
        error: 'person not found',
      })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons.splice(id, 1)
  res.status(204).end()
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 5005
app.listen(PORT, () => {
  console.log(`Server 🏃 on port ${PORT}`)
})
