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

app.get('/info', async (request, response) => {
    const date = new Date();
    const total = await Person.countDocuments({});
    response.send(`
        <p>Phonebook has info for ${total} people</p>
        <p>${date}</p>
    `)
})

app.get('/api/persons/:id', async (request, response) => {
    try {
        const foundPerson = await Person.findById(request.params.id)
        if (!foundPerson) {
            return response.status(404).json({ error: 'not found' })
        }

        response.json(foundPerson);
    } catch (error) {
        response.status(400).json({ error: error.message })
    }
})

app.delete('/api/persons/:id', async (request, response) => {
    try {
        const deleted = await Person.findByIdAndDelete(request.params.id);
        if (!deleted) {
            return response.status(404).json({ error: 'not found' })
        }

        response.status(204).end()
    } catch (error) {
        response.status(400).json({ error: error.message })
    }
})

app.post('/api/persons/', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'Name Missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
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