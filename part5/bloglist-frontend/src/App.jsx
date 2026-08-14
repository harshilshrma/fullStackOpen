import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'
import CreateNewBlogForm from './components/CreateNewBlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState('')
  const [isError, setIsError] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      setUsername('')
      setPassword('')
      setNotification('')
    } catch (error) {
      setIsError(true)
      setNotification(error.response.data.error)
      setTimeout(() => {
        setIsError(false)
        setNotification('')
      }, 3500)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    setUsername('')
    setPassword('')
    setNotification('')
    setIsError(false)
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      user: user.id,
      likes: blog.likes + 1
    }

    try {
      const response = await blogService.addLike(updatedBlog)
      setBlogs(
        blogs.map(blog => blog.id === response.id ? response : blog)
      )
    } catch (error) {
      setIsError(true)
      setNotification(error.response.data.error)
      setTimeout(() => {
        setIsError(false)
        setNotification('')
      }, 5000)
    }
  }

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <div>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    )
  }

  const addNewBlog = async (title, author, url, likes) => {
    try {
      const response = await blogService.addBlog({ title, author, url, likes }, user.token)
      setBlogs(blogs.concat(response))
      setNotification(`A new blog "${title}" by ${author} has been added!`)
      setIsError(false)
      setTimeout(() => {
        setNotification('')
      }, 5000)
      return true
    } catch (error) {
      setNotification(error.response.data.error)
      setIsError(true)
      setTimeout(() => {
        setNotification('')
        setIsError(false)
      }, 5000)
      return false
    }
  }

  const heading = () => {
    return (
      <>
        {!user && <h2>Login to the Blogs application!</h2>}
        {user && <h2 className='title'>Blogs</h2>}
      </>
    )
  }

  const dashboard = () => {
    return (
      <div className='container'>
        <div className='user-login'>
          <h3>Hi {user.name}, you are logged in!</h3>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <CreateNewBlogForm addBlog={addNewBlog} />
        <div className='blog-parent'>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} handleLike={handleLike} />
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      {heading()}
      {notification &&
        <div className={`notification-dialog ${isError ? "error-dialog" : ""}`}>{notification}</div>
      }
      {!user && loginForm()}
      {user && dashboard()}
    </div>
  )
}

export default App