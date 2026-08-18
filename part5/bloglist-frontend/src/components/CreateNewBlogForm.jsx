import { useState } from 'react'

const CreateNewBlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState('')
  const [createFormVisible, setCreateFormVisible] = useState(false)

  const showWhenVisible = { display: createFormVisible ? '' : 'none' }
  const hideWhenVisible = { display: createFormVisible ? 'none' : '' }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const success = await addBlog(title, author, url, likes)

    if (success) {
      setCreateFormVisible(false)
      setTitle('')
      setAuthor('')
      setUrl('')
      setLikes('')
    }
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={() => setCreateFormVisible(true)}>Create a new blog!</button>
      </div>
      <div style={showWhenVisible}>
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
        <button onClick={() => setCreateFormVisible(false)}>Cancel</button>
      </div>
    </div>
  )
}

export default CreateNewBlogForm
