const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

// changing body in morgan log if req is POST
morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '{no body}'
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
// app.use(express.static('dist')) // shows frontend
app.use(express.json())


app.get('/', (request, response) => {
    response.send('<h1>Henlo! Backend started!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(person => {
            response.json(person)
        })
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`
        <p>Phonebook has info for ${Person.length} people</p>
        <p>${date}</p>
    `)
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const person = new Person({
        content: body.content
    })

    person.save().then(person => {
        response.json(person)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
}) 