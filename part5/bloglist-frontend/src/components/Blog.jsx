import { useState } from 'react'
import '../App.css'

const Blog = ({ blog, handleLike, handleRemoveBlog, user }) => {
  const [allDetailsVisible, setAllDetailsVisible] = useState(false)
  const showRemoveButton = blog.user.id == user.id

  const handleRemoveBlogClick = () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      handleRemoveBlog(blog)
    }
  }

  return (
    <div className='blog-container'>
      <div className='blog-title'>
        {blog.title}
        <button onClick={() => setAllDetailsVisible(!allDetailsVisible)}>{allDetailsVisible ? "Hide" : "View"}</button>
      </div>
      {allDetailsVisible &&
        <div>
          <div className='blog-content'>
            {blog.url}
            <div className='likes-container'>
              Likes: {blog.likes}
              <button onClick={() => handleLike(blog)}>like</button>
            </div>
            {blog.author}
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
