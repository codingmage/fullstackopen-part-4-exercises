const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// use express-async-errors instead of try/catch

const getTokenFrom = request => {  
  const authorization = request.get('authorization')  
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }  
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1})
  response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {

    const body = request.body
 
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)  
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }  
    
    const user = await User.findById(decodedToken.id)
    
    /* const user = await User.findById(body.userId) */
    
    const noLikes = !body.likes

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: noLikes ? 0 : body.likes,
      user: body.userId
    })

    const savedBlog = await blog.save()
    user.blogs = [...user.blogs, blog]
    await user.save()
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

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const user = await User.findById(body.userId)

  const noLikes = !body.likes

  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: noLikes ? 0 : body.likes,
    user: user.id
  }

  await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })
/*   user.blogs = [...user.blogs, updatedBlog]
  await user.save() */
  response.status(200).end()
})

module.exports = blogsRouter