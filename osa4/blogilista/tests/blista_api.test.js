const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
      },
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
      }
]

beforeEach(async () => {
  await Blog.deleteMany({}) 
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test("identifier is declared as 'id'", async () => {
    const response = await api
      .get('/api/blogs')
      
      const ids = response.body.map(x => x.id)
      console.log(ids)
      
    expect(ids).toBeDefined();
    })

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
    const response = await api
    .get('/api/blogs')
  
    expect(response.body).toHaveLength(initialBlogs.length)
  })

describe('adding a new blog', () => {

  test('contains valid data and the number of blogs increases', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'Author',
      url: 'url',
      likes: 0,
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogsAfter = await Blog.find({})
    blogsAfter.map(blog => blog.toJSON())

    const newTitle = blogsAfter.map(r => r.title)

    expect(newTitle)
      .toContain(
        'New Blog'
      )

    expect(blogsAfter.length)
      .toBe(initialBlogs.length + 1)
      
  })

  test('initializes likes to zero if not defined', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'Author',
      url: 'url',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await Blog.find({})
    const likes = blogsAfter
      .filter(r => r.title === 'New Blog')
      .map(r => r.likes)

    expect(likes[0])
      .toBe(0)
  })


  test('fails if title is missing (with status code 400)', async () => {
      const newBlog = {
        author: 'Author',
        url: 'url',
      }
  
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
  })

  test('fails if url is missing (with status code 400)', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'Author'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })   
})

describe('deletion of a note', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)


    const blogsAfter = await Blog.find({})
    expect(blogsAfter).toHaveLength(
      blogsAtStart.length - 1
    )

    const title = blogsAfter.map(r => r.title)
    expect(title).not.toContain(blogToDelete.title)
  })
})

describe('editing likes', () => {
  test('returns status code 200 if successful', async () => {
  
    const updatedLikes = {
      likes: 100
    }

    const blogs = await Blog.find({})
    const blogToUpdate = blogs[0]

    await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedLikes)
    .expect(200)
    
    const blogsAfter = await Blog.find({})
    const updatedBlog = blogsAfter[0]

    expect(updatedBlog.likes)
      .toBe(100)
  })
})


afterAll(() => {
  mongoose.connection.close()
})