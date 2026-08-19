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
})
