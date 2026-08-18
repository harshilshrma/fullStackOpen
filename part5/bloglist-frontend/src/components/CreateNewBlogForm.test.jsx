import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateNewBlogForm from './CreateNewBlogForm'

test('The CreateNewBlog form calls addBlog with the right details when a new blog is created', async () => {
    const mockHandler = vi.fn()
    const user = userEvent.setup()

    render(<CreateNewBlogForm addBlog={mockHandler} />)

    const titleInput = screen.getByLabelText('Title*:')
    const authorInput = screen.getByLabelText('Author:')
    const urlInput = screen.getByLabelText('URL*:')
    const likesInput = screen.getByLabelText('Likes:')

    const enableCreateButton = screen.getByRole('button', { name: 'Create a new blog!' })
    await user.click(enableCreateButton)

    const createButton = screen.getByRole('button', { name: 'Create' })

    await user.type(titleInput, 'test title')
    await user.type(authorInput, 'test author')
    await user.type(urlInput, 'testurl.com')
    await user.type(likesInput, '199')

    await user.click(createButton)

    expect(mockHandler).toHaveBeenCalledTimes(1)
    expect(mockHandler).toHaveBeenCalledWith(
        'test title',
        'test author',
        'testurl.com',
        '199'
    )
})
