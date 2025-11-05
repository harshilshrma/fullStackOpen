const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        return returnedObject
    }
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)
    .then(() => {
        console.log('Connected to MongoDB!')
    }).catch(error => {
        console.log('Error connecting to MongoDB:', error);
    })

app.use(express.json())

app.get('/', (request, response, next) => {
    response.send('<h1>Henlo! Backend started!</h1>')
})

app.get('/api/blogs', (request, response) => {
    Blog.find({}).then((blogs) => {
        response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
    const blog = new Blog(request.body)

    blog.save().then((result) => {
        response.status(201).json(result)
    })
})

const unknownEndpoint = (request, response) => {
    return response.status(404).send({ error: "unknown endpoint" })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})