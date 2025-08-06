const PersonForm = ({ number, newName, handleContactSave, handleNameChange, handleNumberChange }) => {

    return (
        <div>
            <form onSubmit={handleContactSave}>
                <div>
                    Name: <input value={newName} onChange={handleNameChange} />
                </div>
                <div>
                    Number: <input value={number} onChange={handleNumberChange} />
                </div>
                <div>
                    <button type="submit">Add</button>
                </div>
            </form>
        </div>
    )
}

export default PersonForm;