const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog App', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3001/api/testing/reset')
        await request.post('http://localhost:3001/api/users', {
            data: {
                username: 'max',
                name: 'max verstappen',
                password: 'hs33'
            }
        })

        await page.goto('http://localhost:5173/login')
    })

    test('Login form is shown', async ({ page }) => {
        await expect(page.getByText('Login to the Blogs application!')).toBeVisible()
        await expect(page.getByLabel('Username')).toBeVisible()
        await expect(page.getByLabel('Password')).toBeVisible()
        await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'max', 'hs33')
            await expect(page.getByText('Hi max verstappen (max), you are logged in!')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'abcd', '1234')
            await expect(page.getByLabel('Username')).toBeVisible()
            await expect(page.getByLabel('Password')).toBeVisible()
            await expect(page.getByText('invalid username or password')).toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'max', 'hs33')
        })

        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, 'test blog title', 'test user', 'www.test.com', '43')

            await expect(page.getByText('test blog title – test user')).toBeVisible()
            await expect(page.getByRole('button', { name: 'View', exact: true })).toBeVisible()
            await page
                .locator('.blog-title')
                .getByRole('button', { name: 'View' }).click()
            await expect(page.getByText('www.test.com')).toBeVisible()
            await expect(page.getByText('Likes: 43')).toBeVisible()
            await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
        })

        test('a blog can be liked', async ({ page }) => {
            await createBlog(page, 'test blog title', 'test user', 'www.test.com', '43')

            await page.getByRole('button', { name: 'View', exact: true }).click()
            await page.getByRole('button', { name: 'like' }).click()
            await expect(page.getByText('Likes: 44')).toBeVisible()
        })

        test('the user who added the blog can delete the blog', async ({ page }) => {
            page.once('dialog', async dialog => {
                await dialog.accept()
            })

            await createBlog(page, 'test blog title', 'test user', 'www.test.com', '43')
            await page.getByRole('button', { name: 'View', exact: true }).click()
            await page.getByRole('button', { name: 'Remove' }).click()

            await expect(page.getByText('test blog title – test user')).not.toBeVisible()
            await expect(page.getByRole('button', { name: 'View' })).not.toBeVisible()
        })

        test('only the user who added the blog sees the blog\'s delete button', async ({ page, request }) => {
            await createBlog(page, 'test blog title', 'test user', 'www.test.com', '43')
            await page.getByRole('button', { name: 'View', exact: true }).click()
            await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible()

            // login other user
            await page.getByRole('link', { name: 'Logout' }).click()
            await page.goto('http://localhost:5173/login')
            await request.post(
                'http://localhost:3001/api/users', {
                data: {
                    username: 'hs33',
                    name: 'harshil sharma',
                    password: 'max'
                }
            }
            )
            await loginWith(page, 'hs33', 'max')
            await expect(page.getByText('test blog title – test user')).toBeVisible()

            await page.getByRole('button', { name: 'View', exact: true }).click()
            await expect(page.getByRole('button', { name: 'Remove' })).not.toBeVisible()
        })

        test('the blogs are arranged in the decreasing order of likes', async ({ page }) => {
            // normal insertion check
            await createBlog(page, 'Blog A', 'test user A', 'www.test.com', '10')
            await createBlog(page, 'Blog B', 'test user B', 'www.test.com', '28')
            await createBlog(page, 'Blog C', 'test user C', 'www.test.com', '30')

            const blogs = await page.locator('.blog-container').all()
            await expect(blogs[0]).toContainText('Blog C – test user C')
            await expect(blogs[1]).toContainText('Blog B – test user B')
            await expect(blogs[2]).toContainText('Blog A – test user A')

            // re-ordering after likes
            const blogB = page.locator('.blog-container').filter({ hasText: 'Blog B – test user B' })
            await blogB.getByRole('button', { name: 'View' }).click()

            for (let i = 0; i < 3; i++) {
                const currentLikes = 28 + i
                await blogB.getByRole('button', { name: 'like' }).click()
                await expect(blogB).toContainText(`Likes: ${currentLikes + 1}`)
            }

            const newBlogs = await page.locator('.blog-container').all()
            await expect(newBlogs[0]).toContainText('Blog B – test user B')
            await expect(newBlogs[1]).toContainText('Blog C – test user C')
            await expect(newBlogs[2]).toContainText('Blog A – test user A')
        })
    })
})  
