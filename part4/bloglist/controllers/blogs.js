const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/users')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }

    return null
}

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'invalid token' })
    }

    const user = await User.findById(decodedToken.id)
    if (!user) {
        return response.status(400).json({ error: 'UserId missing or not valid' })
    }

    const blogWithUser = {
        ...request.body,
        user: user._id
    }
    const createdBlog = new Blog(blogWithUser)

    const savedBlog = await createdBlog.save()

    user.blogs = [...user.blogs, savedBlog._id]
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const { id } = request.params

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
        return response.status(404).json({ message: 'Blog not found!' })
    }

    return response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const { likes } = request.body

    const fetchedBlog = await Blog.findById(request.params.id)
    if (!fetchedBlog) return response.status(404).end()

    fetchedBlog.likes = likes

    const updateResponse = await fetchedBlog.save()
    response.status(200).json(updateResponse)
})

module.exports = blogsRouter