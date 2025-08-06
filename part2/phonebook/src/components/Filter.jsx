const Filter = ({ searchValue, handleSearchValueChange }) => {
    return (
        <div>
            Filter shown with: <input value={searchValue} onChange={handleSearchValueChange} />
        </div>
    )
}

export default Filter;