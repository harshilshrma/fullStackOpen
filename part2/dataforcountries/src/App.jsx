import { useEffect, useState } from 'react'
import axios from 'axios'
import TooManyMatches from './components/TooManyMatches'
import CountryDetail from './components/CountryDetail'
import Countries from './components/Countries'

const App = () => {
  const [countryName, setCountryName] = useState('');
  const [allCountryData, setAllCountryData] = useState([]);
  const [weatherData, setWeatherData] = useState('');
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const handleCountryNameChange = (event) => {
    setCountryName(event.target.value);
  }

  useEffect(() => {
    axios.get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setAllCountryData(response.data)
      })
      .catch(error => {
        console.log("error in country fetch:", error);
      })
  }, [])

  const filteredCountryData = allCountryData.filter(country =>
    country.name.common.toLowerCase().includes(countryName.toLowerCase())
  )

  const exactMatch = allCountryData.filter(country =>
    country.name.common.toLowerCase() === countryName.toLowerCase()
  );

  const countriesToShow = exactMatch.length > 0 ? exactMatch : filteredCountryData;

  useEffect(() => {
    if (countriesToShow.length === 1) {
      const capital = countriesToShow[0].capital?.[0];
      if (weatherData && weatherData.name === capital) return;

      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`)
        .then(response => {
          console.log(response);
          setWeatherData(response.data);
        })
        .catch(error => {
          console.log("error in weather:", error);
        })  
    }
  }, [countriesToShow])

  const handleShowCountry = (countryName) => {
    setCountryName(countryName)
  }

  const renderContent = () => {
    if (!countryName) return null
    if (countriesToShow.length > 10) return <TooManyMatches />
    if (countriesToShow.length === 1) return <CountryDetail country={countriesToShow[0]} weatherData={weatherData} />
    return <Countries countries={countriesToShow} showCountry={handleShowCountry} />
  }

  return (
    <div>
      Find countries: <input value={countryName} onChange={handleCountryNameChange} />
      <div>
        {renderContent()}
      </div>
    </div>
  )
}

export default App
