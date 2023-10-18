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

describe('POST check', () => {

    test('blog successfully added', async () => {
        const newBlog = {
            "title": "Would You Rather...?",
            "author": "Neo",
            "url": "wyr.com",
            "likes": 100
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        const currentBlogs = response.body
        /* console.log(currentBlogs) */

        expect(currentBlogs).toHaveLength(initialBlogList.length + 1)

    })

    test('check for likes', async () => {
        const blogWithoutLikes = {
            "title": "No likes?",
            "author": "Big Blue Head",
            "url": "mm.com"
        }

        await api
            .post('/api/blogs')
            .send(blogWithoutLikes)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        const blogsWithLikeless = response.body

        /* console.log(blogsWithLikeless) */

        expect(blogsWithLikeless[2].likes).toBe(0)

    })

    test('do not save if title missing', async() => {
        const blogWithoutTitle = {
            "author": "Big Blue Head",
            "url": "mm.com"
        }

        await api
            .post('/api/blogs')
            .send(blogWithoutTitle)
            .expect(400)

        const unchangedBlogs = await api.get('/api/blogs')
        const unchangedList = unchangedBlogs.body

        expect(unchangedList).toHaveLength(initialBlogList.length)
    })

    test('do not save if URL missing', async() => {
        const blogWithoutURL = {
            "title": "No lURL?",
            "author": "Big Blue Head",
        }

        await api
            .post('/api/blogs')
            .send(blogWithoutURL)
            .expect(400)

        const unchangedBlogs = await api.get('/api/blogs')
        const unchangedList = unchangedBlogs.body

        expect(unchangedList).toHaveLength(initialBlogList.length)
    })


})

afterAll(async () => {
  await mongoose.connection.close()
})