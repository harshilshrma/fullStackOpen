import { useState } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [number, setNumber] = useState('')
  const [searchValue, setSearchValue] = useState('')

  const handleSearchValueChange = (event) => {
    setSearchValue(event.target.value);
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNumber(event.target.value);
  }

  const handleContactSave = (event) => {
    event.preventDefault();
    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to the phonebook!`)
      setNewName('');
      setNumber('');
      return;
    }

    const newPerson = {
      name: newName,
      number: number,
      id: persons.length + 1
    }
    setPersons(persons.concat(newPerson));
    setNewName('');
    setNumber('');
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchValue.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchValue={searchValue} handleSearchValueChange={handleSearchValueChange} />

      <h3>Add a new</h3>
      <PersonForm number={number} newName={newName} handleContactSave={handleContactSave} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />

      <h3>Numbers</h3>
      <Persons filteredPersons={filteredPersons}/>
    </div>
  )
}

export default App;