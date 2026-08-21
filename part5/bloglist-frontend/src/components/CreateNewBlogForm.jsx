import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateNewBlogForm = ({ user, addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const success = await addBlog(title, author, url, likes)

    if (success) {
      setTitle('')
      setAuthor('')
      setUrl('')
      setLikes('')
    }
  }

  if (!user) {
    return (
      <p><a href='/login'>Log in</a> to add a new blog!</p>
    )
  }

  return (
    <div>
        <form onSubmit={handleSubmit} className='create-new-blog'>
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
        <button onClick={() => navigate('/')}>Cancel</button>
    </div>
  )
}

export default CreateNewBlogForm
