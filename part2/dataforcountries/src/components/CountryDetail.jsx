const CountryDetail = ({ country, weatherData }) => {
    return (
        <div>
            <h1>{country.name.common}</h1>
            <div>Capital: {country.capital}</div>
            <div>Area: {country.area}</div>
            <h2>Languages</h2>
            <ul>
                {Object.values(country.languages).map(l => (
                    <li key={l}>{l}</li>
                ))}
            </ul>
            <img src={country.flags.svg} alt={country.flags.alt} width="200" height="150"></img>
            <h2>Weather in {country.capital}</h2>
            {weatherData?.weather?.[0]?.icon && (
                <div>
                    <img src={`https://openweathermap.org/img/wn/${weatherData && weatherData.weather?.[0].icon}@2x.png`} alt={weatherData.weather[0].description}></img>
                    <p>{weatherData.weather[0].description}</p>
                </div>
            )}
            <div>Temperature: {weatherData && weatherData.main.temp}&deg; C</div>
            <div>Wind: {weatherData && weatherData.wind.speed} m/s</div>


        </div>
    )
}

export default CountryDetail
