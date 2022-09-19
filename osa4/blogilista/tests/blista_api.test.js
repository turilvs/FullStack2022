const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const User = require('../models/user')
const Blog = require('../models/blog')
const { response } = require('../app')
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

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
      
    expect(ids).toBeDefined();
    })

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api
    .get('/api/blogs')
  
    expect(response.body).toHaveLength(initialBlogs.length)
  })

describe('adding a new blog', () => {

  let token = null;
  beforeAll(async () => {

    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("asdf", 10);
    const user = await new User({ username: "testaaja", passwordHash }).save();

    const userForToken = {
      username: "testaaja",
      id: user.id,
    }
    return (token = jwt.sign(userForToken, config.SECRET));
  });

  test('a blog contains valid data and is added by authorized user', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'Author',
      url: 'url',
      likes: 0,
    }
    await api
      .post('/api/blogs')
      .set("Authorization", `Bearer ${token}`)
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
      .set("Authorization", `Bearer ${token}`)
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
        .set("Authorization", `Bearer ${token}`)
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
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })   
})

describe('deletion of a blog', () => {

  let token = null;
  beforeEach(async () => {

    await User.deleteMany({});
    await Blog.deleteMany({});

    const passwordHash = await bcrypt.hash("asdf", 10);
    const user = await new User({ username: "testaaja", passwordHash }).save();

    const userForToken = {
      username: "testaaja",
      id: user.id,
    }

    token = jwt.sign(
      userForToken, 
      process.env.SECRET
    )

    const newBlog = {
      title: 'New Blog',
      author: 'Author',
      url: 'url',
    }

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    return token;
  });

  test('succeeds with status code 204 if id is valid', async () => {
    
    const blogsAtStart = await Blog.find({}).populate("user");
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204)

    const blogsAfter = await Blog.find({}).populate("user");
    expect(blogsAfter).toHaveLength(
      blogsAtStart.length - 1
    )

    const titles = blogsAfter.map(r => r.title)
    expect(titles).not.toContain(blogToDelete.title)
  })

  test("fails if user is not authorized (status 401)", async () => {
    const blogsAtStart = await Blog.find({}).populate("user");
    const blogToDelete = blogsAtStart[0];

    token = null;

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(401);

    const blogsAfter = await Blog.find({}).populate("user");

    expect(blogsAfter).toHaveLength(blogsAtStart.length);
    expect(blogsAtStart).toEqual(blogsAfter);
  });
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

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'turilas',
      name: 'Artturi',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('users with bad usernames or passwords are not created (400) and right callbacks are sent ', async () => {
    const usersAtStart = await helper.usersInDb()


    const badUsername = {
      username: 't',
      name: 'Artturi',
      password: 'salasana',
    }

    const badPassword = {
      username: 'turi',
      name: 'Artturi',
    }

    const notUnique = {
      username: 'root',
      name: 'Artturi',
      password: 'salasana'
    }

    await api
      .post('/api/users')
      .send(badUsername)
      .expect(400, {"error":"username missing or too short"})
    

    await api
    .post('/api/users')
    .send(badPassword)
    .expect(400, {"error":"password missing or too short"})

    await api
    .post('/api/users')
    .send(notUnique)
    .expect(400, {"error":"username must be unique"})

    
      
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})