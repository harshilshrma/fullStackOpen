const Persons = ({ filteredPersons, handlePersonDelete }) => {
    return (
        <div>
            {filteredPersons.map(person =>
                <div key={person.id}>
                    {person.name} {person.number} { }
                    <button onClick={() => handlePersonDelete(person)}>Delete</button>
                </div>
            )}
        </div>
    )
}

export default Persons;