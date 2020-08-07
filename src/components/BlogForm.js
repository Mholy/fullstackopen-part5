import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (e) => {
    e.preventDefault()

    createBlog({
      title,
      author,
      url,
    })
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title:{' '}
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          author:{' '}
          <input value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div>
          url: <input value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
