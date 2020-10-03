import './App.css'
import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from 'components/LoginForm'
import BlogForm from 'components/BlogForm'
import Togglable from 'components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [sorted, setSorted] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)

      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const createBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(newBlog))
      setSuccessMessage(
        `a new blog ${blogObject.title} by ${blogObject.author} added`
      )
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error) {
      setErrorMessage(error.message)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const likeBlog = async (id) => {
    const blog = blogs.find((b) => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }

    try {
      const response = await blogService.mutate(id, changedBlog)
      setBlogs(blogs.map((b) => (b.id !== id ? b : response)))

      setSuccessMessage(`You like ${blog.title} by ${blog.author}`)
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error) {
      setErrorMessage(error.message)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const removeBlog = async (id) => {
    const blog = blogs.find((b) => b.id === id)

    try {
      await blogService.deleteById(id)
      setBlogs(blogs.filter((b) => b.id !== id))

      setSuccessMessage(`Removed ${blog.title} by ${blog.author}`)
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error) {
      setErrorMessage(error.message)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleSort = () => {
    let newSort = sorted === 'desk' ? 'ask' : 'desk'

    setBlogs(
      blogs.sort((a, b) => {
        if (!sorted || newSort === 'desk') return b.likes - a.likes
        if (newSort === 'ask') return a.likes - b.likes
        return null
      })
    )
    setSorted(newSort)
  }

  if (user === null)
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} className="error" />
        <LoginForm
          handleSubmit={handleLogin}
          handleUsernameChange={(e) => setUsername(e.target.value)}
          handlePasswordChange={(e) => setPassword(e.target.value)}
          username={username}
          password={password}
        />
      </div>
    )

  return (
    <div>
      <p>
        {user.name} logged in{' '}
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </p>
      <Notification message={errorMessage} className="error" />
      <Notification message={successMessage} className="success" />
      <Togglable buttonLabel="create blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      <button onClick={handleSort} type="button">
        sort by likes
      </button>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={likeBlog}
          removeBlog={removeBlog}
          createdByUser={user.name === blog.user.name}
        />
      ))}
    </div>
  )
}

export default App
