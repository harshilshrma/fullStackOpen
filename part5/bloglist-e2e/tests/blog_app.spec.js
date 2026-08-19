const { test, expect, beforeEach, describe } = require('@playwright/test')

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

        await page.goto('http://localhost:5173/')
    })

    test('Login form is shown', async ({ page }) => {
        await expect(page.getByText('Login to the Blogs application!')).toBeVisible()
        await expect(page.getByLabel('Username')).toBeVisible()
        await expect(page.getByLabel('Password')).toBeVisible()
        await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByLabel('Username').fill('max')
            await page.getByLabel('Password').fill('hs33')

            await page.getByRole('button', { name: 'Login' }).click()
            await expect(page.getByText('Hi max verstappen (max), you are logged in!')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByLabel('Username').fill('abcd')
            await page.getByLabel('Password').fill('1234')

            await page.getByRole('button', { name: 'Login' }).click()
            await expect(page.getByLabel('Username')).toBeVisible()
            await expect(page.getByLabel('Password')).toBeVisible()
            await expect(page.getByText('invalid username or password')).toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await page.getByLabel('Username').fill('max')
            await page.getByLabel('Password').fill('hs33')
            await page.getByRole('button', { name: 'Login' }).click()
        })

        test('a new blog can be created', async ({ page }) => {
            // open create form
            await page.getByRole('button', { name: 'Create a new blog!' }).click()

            // fill input fields
            await page.getByLabel('Title*:').fill('test blog title')
            await page.getByLabel('Author:').fill('test user')
            await page.getByLabel('URL*:').fill('www.test.com')
            await page.getByLabel('Likes:').fill('43')

            // submit the form
            await page.getByRole('button', { name: 'Create' }).click()

            // expect correct fields
            await expect(page.getByText('test blog title – test user')).toBeVisible()
            await expect(page.getByRole('button', { name: 'View' })).toBeVisible()
            await page.getByRole('button', { name: 'View' }).click()
            await expect(page.getByText('www.test.com')).toBeVisible()
            await expect(page.getByText('Likes: 43')).toBeVisible()
            await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
        })

        test('a blog can be liked', async ({ page }) => {
            // open create form
            await page.getByRole('button', { name: 'Create a new blog!' }).click()

            // fill input fields
            await page.getByLabel('Title*:').fill('test blog title')
            await page.getByLabel('Author:').fill('test user')
            await page.getByLabel('URL*:').fill('www.test.com')
            await page.getByLabel('Likes:').fill('43')

            // submit the form
            await page.getByRole('button', { name: 'Create' }).click()

            // click like button
            await page.getByRole('button', { name: 'View' }).click()
            await page.getByRole('button', { name: 'like' }).click()
            await expect(page.getByText('Likes: 44')).toBeVisible()
        })
    })
})
