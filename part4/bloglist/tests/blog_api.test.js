// part4\bloglist\tests\blog_api.test.js

const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app.js')
const Blog = require('../models/blogs.js')

const api = supertest(app)

const initialBlogs = [
    {
        title: "test title 1",
        author: "cccccc",
        url: "c",
        likes: 100
    },
    {
        title: "test title 2",
        author: "dv",
        url: "sdvv",
        likes: 23
    },
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})

test('blogs are returned as JSON', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
})

test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const firstBlog = response.body[0];

    assert(firstBlog.hasOwnProperty("id"));
})

test('making an HTTP POST request to the /api/blogs URL successfully creates a new blog post', async() => {
    const testBlog = {
        title: "test blog",
        author: "abvdd",
        url: ".com",
        likes: 3
    }

    await api.post('/api/blogs').send(testBlog);
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length + 1)

    const blogsTitleArray = response.body.map(blog => blog.title)
    assert(blogsTitleArray.includes("test blog"))
})

after(async () => {
    await mongoose.connection.close()
})
