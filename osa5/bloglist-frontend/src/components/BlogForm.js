import { useState } from "react"
import PropTypes from "prop-types"

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" })

  BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired,
  }

  const handleCreateBlog = (event) => {

    event.preventDefault()
    createBlog(newBlog.title, newBlog.author, newBlog.url)
    setNewBlog({ title: "", author: "", url: "" })
  }

  const handleInput = (event) => {

    const { name, value } = event.target
    setNewBlog({ ...newBlog, [name]: value })
  }

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={handleCreateBlog}>
        <div>
          title
          <input
            type="text"
            data-testid="title"
            value={newBlog.title}
            name="title"
            onChange={handleInput}
          />
        </div>
        <div>
          author
          <input
            type="text"
            data-testid="author"
            value={newBlog.author}
            name="author"
            onChange={handleInput}
          />
        </div>
        <div>
          url
          <input
            type="text"
            data-testid="url"
            value={newBlog.url}
            name="url"
            onChange={handleInput}
          />
        </div>
        <button type="submit">
          create
        </button>
      </form>
    </div>
  )
}

export default BlogForm