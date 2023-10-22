const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

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
            "title": "No URL?",
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

test('DELETE check', async() => {
    const blogsAtStart = await api.get('/api/blogs')
    const firstBlog = blogsAtStart.body[0]

    await api.delete(`/api/blogs/${firstBlog.id}`).expect(204)

    const newResponse = await api.get('/api/blogs')

    const blogsAfterDeletion = newResponse.body

    expect(blogsAfterDeletion).toHaveLength(initialBlogList.length - 1)

    const eachBlogTitle = blogsAfterDeletion.map(blog => blog.title)

    expect(eachBlogTitle).not.toContain(firstBlog.title)
})

test('PUT check', async () => {
    const oldBlogs = await api.get('/api/blogs')
    const blogToUpdate = oldBlogs.body[0]

    const updatedBlog = {
        "title": "Your movie is awesome",
        "author": "Floating Head",
        "url": "ymia.com",
        "likes": 777
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

    const updatedBlogs = await api.get('/api/blogs')
    const blogNowUpdated = updatedBlogs.body[0]

    expect(updatedBlogs.body).toHaveLength(initialBlogList.length)
    expect(blogNowUpdated.likes).toBe(777)
        
})

describe('initial single user', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('spooky', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await User.find({})
      const usersJSON = usersAtStart.map(user => user.toJSON())
  
      const newUser = {
        username: 'mage',
        name: 'Jean Fellipe',
        password: 'tomato',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await User.find({})
      const finalUsers = usersAtEnd.map(user => user.toJSON())

      console.log(finalUsers)

      expect(finalUsers).toHaveLength(usersJSON.length + 1)
  
      const usernames = finalUsers.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })
  
/*     test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      expect(result.body.error).toContain('expected `username` to be unique')
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    }) */
  })  

afterAll(async () => {
  await mongoose.connection.close()
})