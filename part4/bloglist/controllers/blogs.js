const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/users')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const usersInDb = await User.find({})
    const firstUser = usersInDb[0]

    const blogWithUser = {
        ...request.body,
        user: firstUser._id
    }
    const createdBlog = new Blog(blogWithUser)

    const savedBlog = await createdBlog.save()

    firstUser.blogs = [...firstUser.blogs, savedBlog._id]
    await firstUser.save()

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