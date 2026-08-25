const loginWith = async (page, username, password) => {
    await page.getByLabel('Username').fill(username)
    await page.getByLabel('Password').fill(password)
    await page.getByRole('button', { name: 'Login' }).click()
}

const createBlog = async (page, title, author, url, likes) => {
    await page.getByRole('link', { name: 'Add a new blog' }).click()

    await page.getByLabel('Title*').fill(title)
    await page.getByLabel('Author').fill(author)
    await page.getByLabel('URL*').fill(url)
    await page.getByLabel('Likes').fill(likes)

    await page.getByRole('button', { name: 'Create' }).click()
    await page.getByText(`${title} – ${author}`).waitFor()
}

export { loginWith, createBlog }