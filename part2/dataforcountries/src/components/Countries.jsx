const Countries = ({ countries, showCountry }) => {
    return (
        <div>
            {countries.map(c => (
                <div key={c.name.common}>
                    {c.name.common} {''}
                    <button onClick={() => showCountry(c.name.common)}>Show</button>
                </div>
            ))}
        </div>
    )
}

export default Countries
