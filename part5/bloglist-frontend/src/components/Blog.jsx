import { useState } from 'react'
import '../App.css'

const Blog = ({ blog }) => {
  const [allDetailsVisible, setAllDetailsVisible] = useState(false)

  return (
    <div className='blog-container'>
      <div className='blog-title'>
        {blog.title}
        <button onClick={() => setAllDetailsVisible(!allDetailsVisible)}>{allDetailsVisible ? "Hide" : "View"}</button>
      </div>
      {allDetailsVisible &&
        <div className='blog-content'>
          {blog.url}
          <div className='likes-container'>
            Likes: {blog.likes}
            <button>like</button>
          </div>
          {blog.author}
        </div>
      }
    </div>
  )
}

export default Blog