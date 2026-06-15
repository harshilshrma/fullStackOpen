const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})

    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    const savedBlog = await blog.save()
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