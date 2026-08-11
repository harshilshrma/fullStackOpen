import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const addBlog = async (blog, authToken) => {
  const response = await axios.post(
    baseUrl,
    blog,
    {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }
  )
  return response.data
}

export default { getAll, addBlog }