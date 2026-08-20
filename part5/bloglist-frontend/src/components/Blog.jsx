import '../App.css'

const Blog = ({ blog, handleLike, handleRemoveBlog, user, isVisible, toggleVisibility }) => {
  const showRemoveButton = blog.user && user && blog.user.id === user.id

  const handleRemoveBlogClick = () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      handleRemoveBlog(blog)
    }
  }

  const formatUrl = (url) => {
    if (!url) return '#'
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`
  }

  return (
    <div className='blog-container'>
      <div className='blog-title'>
        {blog.title} – {blog.author}
        <button onClick={() => toggleVisibility(blog.id)}>{isVisible ? 'Hide' : 'View'}</button>
      </div>
      {isVisible &&
        <div>
          <div className='blog-content'>
            <a href={formatUrl(blog.url)} target='_blank'>{blog.url}</a>
            <div className='likes-container'>
              Likes: {blog.likes}
              <button onClick={() => handleLike(blog)}>like</button>
            </div>
            {blog.user && <span>Created by {blog.user.name} ({blog.user.username})</span>}
          </div>
          {showRemoveButton &&
            <button className='blog-remove-button' onClick={handleRemoveBlogClick}>Remove</button>
          }
        </div>
      }
    </div>
  )
}

export default Blog
