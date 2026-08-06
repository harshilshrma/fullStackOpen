const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

    response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const user = request.user
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

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const { id } = request.params
    const user = request.user

    const blogToDelete = await Blog.findById(id)
    if (!blogToDelete) {
        return response.status(404).json({ message: 'Blog not found!' })
    }

    if (blogToDelete.user.toString() !== user.id.toString()) {
        return response.status(403).json({ error: 'Invalid deletion - only the creator can delete a blog.'})
    }

    await Blog.findByIdAndDelete(id);

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