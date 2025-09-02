import axios from 'axios'
const baseUrl = 'https://phonebook-backend-8kiy.onrender.com/api/persons';

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