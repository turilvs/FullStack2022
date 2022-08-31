const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {

  const body = request.body
  const user = request.user

  const blog = await new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  }).populate("user", { username: 1, name: 1 });

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  if (!blog.title || !blog.url || !blog.author) response.status(400).end()

  else response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  
    
    const blog = await Blog.findById(request.params.id)
    const userid = request.user._id.toString()

    if (blog === undefined || blog === null) {
      return response.status(400).json({ error: 'blog not found' })
    }
    console.log('blogin kirjoittaja', blog.user.toString())
    console.log('poistava kayttaja', userid)

    if (blog.user.toString() === userid) {
      
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    }
})


blogsRouter.put('/:id', async (request, response) => {

  const body = request.body

  const blog = {
    likes: body.likes
  }
  
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).populate("user", { username: 1, name: 1 });
    response
    .status(200)
    .json(updatedBlog)
    .end()
})
module.exports = blogsRouter