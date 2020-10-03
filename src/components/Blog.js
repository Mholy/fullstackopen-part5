import React, { useState } from 'react'

const Blog = ({ blog, likeBlog, removeBlog, createdByUser }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const handleBlogLike = () => {
    likeBlog(blog.id)
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`))
      removeBlog(blog.id)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const showWhenVisible = { display: showDetails ? '' : 'none' }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}
        <button onClick={toggleDetails} type="button">
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>
          {blog.likes}
          <button onClick={handleBlogLike} type="button">
            like
          </button>
        </div>
        <div>{blog.author}</div>
        {createdByUser && (
          <button onClick={handleRemove} type="button">
            Remove
          </button>
        )}
      </div>
    </div>
  )
}

export default Blog
