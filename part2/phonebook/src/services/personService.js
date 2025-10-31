import axios from 'axios'
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const getAll = () => {
    return axios.get(baseUrl);
}

const addPerson = (newPerson) => {
    return axios.post(baseUrl, newPerson)
}

const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`);
}

const updateNumber = (id, updatedNumber) => {
    return axios.put(`${baseUrl}/${id}`, updatedNumber)
}

export default { getAll, addPerson, deletePerson, updateNumber }