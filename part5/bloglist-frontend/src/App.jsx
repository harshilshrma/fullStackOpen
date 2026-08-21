import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'
import Home from './components/Home'
import Login from './components/Login'
import SingleBlog from './components/SingleBlog'
import {
  Routes, Route, Link,
  useNavigate
} from 'react-router-dom'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState('')
  const [isError, setIsError] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const clearNotification = () => {
    setTimeout(() => {
      setIsError(false)
      setNotification('')
    }, 5000)
  }

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      setNotification('')
      navigate('/')
      return true
    } catch (error) {
      setIsError(true)
      setNotification(error.response.data.error)
      clearNotification()
      return false
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    setNotification('')
    setIsError(false)
    navigate('/')
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1
    }

    try {
      const response = await blogService.addLike(updatedBlog)
      const newBlogsArray = blogs.map(blog => blog.id === response.id ? response : blog)
      newBlogsArray.sort((a, b) => b.likes - a.likes)
      setBlogs(newBlogsArray)
    } catch (error) {
      setIsError(true)
      setNotification(error.response.data.error)
      clearNotification()
    }
  }

  const handleRemoveBlog = async (blog) => {
    try {
      await blogService.removeBlog(blog.id, user.token)
      setBlogs(
        blogs.filter(b => b.id !== blog.id)
      )
      setIsError(false)
      setNotification(`Blog "${blog.title}" by ${blog.author} was removed!`)
      clearNotification()
    } catch (error) {
      setIsError(true)
      setNotification(error.response.data.error)
      clearNotification()
    }
  }

  const addNewBlog = async (title, author, url, likes) => {
    try {
      const response = await blogService.addBlog({ title, author, url, likes }, user.token)

      const newBlogsArray = blogs.concat(response)
      newBlogsArray.sort((a, b) => b.likes - a.likes)
      setBlogs(newBlogsArray)

      setNotification(`A new blog "${title}" by ${author} has been added!`)
      setIsError(false)
      clearNotification()
      return true
    } catch (error) {
      setNotification(error.response.data.error)
      setIsError(true)
      clearNotification()
      return false
    }
  }

  const handleBlogVisit = (id) => {
    navigate(`/blogs/${id}`)
  }

  return (
    <div>
      <div>
        <div className='navbar'>
          <Link to="/">Blogs</Link>
          {user ? <button onClick={handleLogout}>Logout</button> : <Link to="/login">Login</Link>}
        </div>

        {notification &&
          <div className={`notification-dialog ${isError ? 'error-dialog' : ''}`}>{notification}</div>
        }

        <Routes>
          <Route path="/" element={
            <Home
              user={user}
              blogs={blogs}
              addNewBlog={addNewBlog}
              handleLike={handleLike}
              handleRemoveBlog={handleRemoveBlog}
              handleBlogVisit={handleBlogVisit}
            />
          } />
          <Route path="/login" element={
            <Login user={user} handleLogin={handleLogin} />
          } />
          <Route path="/blogs/:id" element={
            <SingleBlog blogs={blogs} user={user} handleLike={handleLike} handleRemoveBlog={handleRemoveBlog}/>
          } />
        </Routes>
      </div>
    </div>
  )
}

export default App
