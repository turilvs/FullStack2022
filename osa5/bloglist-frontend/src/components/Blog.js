import { useState } from "react"

const Blog = ({ blog, updateLikes, deleteBlog, username }) => {
  const [visible, setVisible] = useState(false)
  const [notVisible, setNotVisible] = useState(false)

  const showIfOwned = { display: notVisible ? "none" : "" }

  const checkIfOwned = () => {
    setVisible(!visible)
    if (blog.user.username !== username) {
      setNotVisible(true)
    }
  }

  const handleLike = () => {
    const blogToUpdate = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }
    updateLikes(blog.id, blogToUpdate)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }


  return (
    <div className="blog" data-testid="blog" >
      <div>
        <em className="title" data-testid="title">{blog.title} - </em>
        <em className="author" data-testid="author">{blog.author}</em>{" "}
        <button data-testid="info-btn" id="info-btn" onClick={checkIfOwned}>
          {visible ? "hide" : "info"}
        </button>
      </div>
      {visible && (
        <div data-testid="togglableContent">
          <div data-testid="url">{blog.url}</div>
          <div data-testid="likes">
            Likes: {blog.likes}{" "}
            <button type="button" id="like-btn" data-testid="like-btn" onClick={handleLike}>
              like
            </button>
          </div>
          <div>
            added by {blog.user.name}{" "}
            <button onClick={handleDelete} style={showIfOwned} id="delete-btn" type="button">remove</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Blog