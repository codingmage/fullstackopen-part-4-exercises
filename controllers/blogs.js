const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// use express-async-errors instead of try/catch

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
    /* const blog = new Blog(request.body) */

    const body = request.body
    
    const noLikes = !body.likes

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: noLikes ? 0 : body.likes
    })

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)

    /* Try and catch alternative:
    try {
      const savedBlog = await blog.save()
      response.status(201).json(savedBlog)
    } catch (error) {
        next(error)
    }
     */
  
    /* blog
      .save()
      .then(result => {
        response.status(201).json(result)
      }) */
})

module.exports = blogsRouter