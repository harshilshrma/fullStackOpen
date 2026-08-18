import { render } from '@testing-library/react'
import Blog from './Blog'

test('Blog component renders title and author by default but not URL & likes', () => {
    const blog = {
        title: 'test blog',
        author: 'test user',
        url: 'www.test.com',
        likes: 20
    }

    const { container } = render(<Blog blog={blog} />)

    const div = container.querySelector('.blog-container')
    expect(div).toHaveTextContent('test blog – test user')
    expect(div).not.toHaveTextContent('www.test.com')
    expect(div).not.toHaveTextContent('20')
})