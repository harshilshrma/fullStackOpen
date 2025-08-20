import { useEffect, useState } from 'react'
import axios from 'axios'
import TooManyMatches from './components/TooManyMatches'
import CountryDetail from './components/CountryDetail'
import Countries from './components/Countries'

const App = () => {
  const [countryName, setCountryName] = useState('');
  const [allCountryData, setAllCountryData] = useState([]);

  const handleCountryNameChange = (event) => {
    setCountryName(event.target.value);
  }

  useEffect(() => {
    axios.get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setAllCountryData(response.data)
      })
  }, [])

  const filteredCountryData = allCountryData.filter(country =>
    country.name.common.toLowerCase().includes(countryName.toLowerCase())
  )

  const renderContent = () => {
    if (!countryName) return null
    if (filteredCountryData.length > 10) return <TooManyMatches />
    if (filteredCountryData.length === 1) return <CountryDetail country={filteredCountryData[0]} />
    return <Countries countries={filteredCountryData} />
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
