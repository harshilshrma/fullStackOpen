import { useParams } from 'react-router-dom'
import { formatUrl } from '../utils'

const SingleBlog = ({ blogs, user, handleLike, handleRemoveBlog }) => {
    const blogId = useParams().id

    const singleBlog = blogs.find(blog => blog.id === blogId)
    if (!singleBlog) {
        return (
            <div>
                <h3>This blog has been deleted!</h3>
                <p>You can get back to <a href='/'>blogs main page</a> now!</p>
            </div>
        )
    }

    const showRemoveButton = singleBlog.user && user && singleBlog.user.id === user.id

    const handleRemoveBlogClick = (blog) => {
        if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
            handleRemoveBlog(blog)
        }
    }

    return (
        <div>
            <h2>{singleBlog.title} – {singleBlog.author}</h2>
            <div className='blog-content'>
                <a href={formatUrl(singleBlog.url)} target='_blank'>{singleBlog.url}</a>
                <div className='likes-container'>
                    Likes: {singleBlog.likes}
                    {user ? <button onClick={() => handleLike(singleBlog)}>like</button> : <p>(<a href='/login'>Log in</a> to like this blog!)</p>}
                </div>
                {singleBlog.user && <span>Created by {singleBlog.user.name} ({singleBlog.user.username})</span>}
            </div>
            {showRemoveButton &&
                <button className='blog-remove-button' onClick={() => handleRemoveBlogClick(singleBlog)}>Remove</button>
            }
        </div>
    )
}

export default SingleBlog