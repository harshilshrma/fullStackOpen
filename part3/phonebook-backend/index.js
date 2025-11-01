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

app.get('/api/persons/:id', async (request, response, next) => {
    try {
        const foundPerson = await Person.findById(request.params.id)
        if (!foundPerson) {
            return response.status(404).json({ error: 'not found' })
        }

        return response.json(foundPerson);
    } catch (error) {
        next(error)
    }
})

app.delete('/api/persons/:id', async (request, response, next) => {
    try {
        const deleted = await Person.findByIdAndDelete(request.params.id);
        if (!deleted) {
            return response.status(404).json({ error: 'person not found' })
        }

        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

app.post('/api/persons/', async (request, response, next) => {
    try {
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

        const savedPerson = await person.save();
        response.json(savedPerson)
    } catch (error) {
        next(error)
    }
})

app.put('/api/persons/:id', async (request, response, next) => {
    try {
        const { name, number } = request.body

        // finding person by id
        const person = await Person.findById(request.params.id)
        if (!person) return response.status(404).json({ error: 'person not found' })

        person.name = name;
        person.number = number;

        const updatedPerson = await person.save()
        response.json(updatedPerson)
    } catch (error) {
        next(error)
    }
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
}) 