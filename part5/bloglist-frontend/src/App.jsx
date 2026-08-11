import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
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
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage('')
      }, 3500)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <h2>Login to the Blogs application!</h2>
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

  const addNewBlog = async (event) => {
    event.preventDefault()
    try {
      const response = await blogService.addBlog({ title, author, url, likes }, user.token)
      setBlogs(blogs.concat(response))
      setTitle('')
      setAuthor('')
      setUrl('')
      setLikes('')
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  const createNewBlogForm = () => {
    return (
      <form onSubmit={addNewBlog} className='create-new-blog'>
        <h2>Create New Blog</h2>
        <label>
          Title*:
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>
        <label>
          Author:
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
        <label>
          URL*:
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </label>
        <label>
          Likes:
          <input
            type="number"
            value={likes}
            onChange={({ target }) => setLikes(target.value)}
          />
        </label>
        <button type="submit">Create</button>
      </form>
    )
  }

  return (
    <div>
      {!user && loginForm()}
      {user && (
        <div className='container'>
          <h2 className='title'>Blogs</h2>
          <div className='user-login'>
            <h3>Hi {user.name}, you are logged in!</h3>
            <button onClick={handleLogout}>Logout</button>
          </div>
          {createNewBlogForm()}
          <div>
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
          </div>
        </div>
      )}
      {errorMessage &&
        <div className='error-dialog'>{errorMessage}</div>
      }
    </div>
  )
}

export default App