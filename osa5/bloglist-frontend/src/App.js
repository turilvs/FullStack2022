import { useState, useEffect, useRef } from "react"
import Blog from "./components/Blog"
import BlogForm from "./components/BlogForm"
import Notification from "./components/Notification"
import Togglable from "./components/Togglable"
import blogService from "./services/blogs"
import loginService from "./services/login"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState(null)
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])


  const createBlog = async (title, author, url) => {
    try {

      blogFormRef.current.toggleVisibility()
      const blog = await blogService.create({
        title,
        author,
        url,
      })
      setBlogs(blogs.concat(blog))
      setMessage("a new blog added")
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch (exception) {
      setMessage("error missing information")
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }

  const updateLikes = async (id, blogToUpdate) => {
    try {
      const updatedBlog = await blogService.update(id, blogToUpdate)
      const newBlogs = blogs.map((blog) =>
        blog.id === id ? updatedBlog : blog
      )
      setBlogs(newBlogs)
    } catch (exception) {
      setMessage("error can't update likes")
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      const updatedBlogs = blogs.filter((blog) => blog.id !== id)
      setBlogs(updatedBlogs)
      setMessage("Blog deleted")
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch (exception) {
      setMessage("error" + exception.response.data.error)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log("logging in with", username, password)

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        "loggedBlogappUser", JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
    } catch (exception) {
      setMessage("error wrong username or password")
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }

  const handleLogout = () =>  {
    localStorage.removeItem("loggedBlogappUser")
    setUser(null)
  }


  const loginForm = () => (

    <form onSubmit={handleLogin}>
      <h2>Log in to application</h2>
      <Notification message={message} />

      <div>
        username
        <input
          type="text"
          id="username"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="text"
          id="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">
          login
      </button>
    </form>
  )

  if (user === null) {
    return (
      loginForm()
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <p> {user.name} logged in <button onClick={handleLogout}>logout</button></p>

      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (
          <Blog key={blog.id} blog={blog} updateLikes={updateLikes} deleteBlog={deleteBlog} username={user.username} />
        ))}
    </div>
  )}

export default App
