const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const User = require('../models/users')
const helper = require('./test_helper')
const app = require('../app.js')
const supertest = require('supertest')
const api = supertest(app)

describe('when there is initially one user is db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'harshil',
            name: 'Harshil Sharma',
            password: 'abcdefgh'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })
})

after(async () => {
    await mongoose.connection.close()
})
