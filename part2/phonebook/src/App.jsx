import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
import personService from './services/personService'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [number, setNumber] = useState('')
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

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

    const newPerson = {
      name: newName,
      number: number,
    }

    if (persons.find(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with new one?`)) {
        const person = persons.find(person => person.name === newName);
        const changedPerson = { ...person, number: number };

        personService
          .updateNumber(person.id, changedPerson)
          .then(response => {
            setPersons(persons.map(p => p.id !== person.id ? p : response.data));
            setNewName('');
            setNumber('');
            console.log(response);
          })
          .catch(error => {
            console.error("error:", error)
          })
      } else {
        console.log(`Number of ${newName} was not changed.`);
      }
    } else {
      personService
        .addPerson(newPerson)
        .then(response => {
          setPersons(persons.concat(response.data));
          setNewName('');
          setNumber('');
          console.log(response);
        })
        .catch(error => {
          console.error("error: ", error);
        })
    }
  }

  const handlePersonDelete = (person) => {
    console.log(`delete the person with name = ${person.name}?`);

    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deletePerson(person.id)
        .then(response => {
          setPersons(persons.filter(p => p.id !== person.id))
          console.log(`person with name ${person.name} deleted.`)
          console.log(response)
        })
        .catch(error => {
          console.log("error deleting person:", error);
        })
    } else {
      console.log(`okay not deleting ${person.name}`)
    }
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
      <Persons filteredPersons={filteredPersons} handlePersonDelete={handlePersonDelete} />
    </div>
  )
}

export default App;