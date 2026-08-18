import { useState } from 'react'
import '../App.css'

const Blog = ({ blog, handleLike, handleRemoveBlog, user }) => {
  const [allDetailsVisible, setAllDetailsVisible] = useState(false)
  const showRemoveButton = blog.user && user && blog.user.id === user.id

  const handleRemoveBlogClick = () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      handleRemoveBlog(blog)
    }
  }

  const formatUrl = (url) => {
    if (!url) return '#';
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  };

  return (
    <div className='blog-container'>
      <div className='blog-title'>
        {blog.title} – {blog.author}
        <button onClick={() => setAllDetailsVisible(!allDetailsVisible)}>{allDetailsVisible ? 'Hide' : 'View'}</button>
      </div>
      {allDetailsVisible &&
        <div>
          <div className='blog-content'>
            <a href={formatUrl(blog.url)} target='_blank'>{blog.url}</a>
            <div className='likes-container'>
              Likes: {blog.likes}
              <button onClick={() => handleLike(blog)}>like</button>
            </div>
            <span>Created by {blog.user.name} ({blog.user.username})</span>
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
