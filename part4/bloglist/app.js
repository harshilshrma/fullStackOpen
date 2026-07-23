const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

const app = express()

logger.info('Trying to connect to MongoDB...')

mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB!\n------')
    })
    .catch((error) => {
        logger.error('Error connecting to MongoDB:', error);
    })

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.get('/', (request, response, next) => {
    response.send('<h1>Henlo! Backend started!</h1>')
})

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
    
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app