const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogList = [
    {
        "title": "Your movie is awesome",
        "author": "Floating Head",
        "url": "ymia.com",
        "likes": 500
    },
    {
        "title": "What are THOSE?",
        "author": "John Anonymous",
        "url": "wat.com",
        "likes": 220
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogList[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogList[1])
    await blogObject.save()
})


test('get blogs as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogList.length)
})

test('check id property', async () => {
    const response = await api.get('/api/blogs')

    for (let blog of response.body) {
        expect(blog.id).toBeDefined()
    }

    /* expect(response.body[0].id).toBeDefined() */
})

afterAll(async () => {
  await mongoose.connection.close()
})