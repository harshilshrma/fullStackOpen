const Countries = ({ countries }) => {
    return (
        <div>
            {countries.map(c => (
                <div key={c.name.common}>
                    {c.name.common} {''}
                    
                </div>
            ))}
        </div>
    )
}

export default Countries
