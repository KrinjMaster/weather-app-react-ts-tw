import { useState, ChangeEvent } from "react"
import { IOption } from "./Interfaces/IOption"
import { IWeatherData } from "./Interfaces/IWeatherData"

const App = () => {
  const [term, setTerm] = useState<string>('')
  const [options, setOptions] = useState([])
  const [showOptions, setShowOptions] = useState(true)
  const [dataWeather, setDataWeather] = useState<IOption>(Object)
  const [weather, setWeather] = useState<IWeatherData>(Object)
  const [weatherState, setWeatherState] = useState(false)
  
  const getSearchOptions = (value: string) => {
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${value}&count=5`)
    .then((res) => res.json())
    .then((data) => setOptions(data.results))
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTerm(value)
    
    if (value === '') return
    
    getSearchOptions(value)
    setShowOptions(true)
    setWeatherState(false)
  }

  const onOptionSelect = (option: IOption) => {
    setTerm(option.name)
    setShowOptions(false)
    setDataWeather(option)
  }

  const onSubmit = (option: IOption) => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${option.latitude}&longitude=${option.longitude}&current_weather=true`)
    .then(response => response.json())
    .then(data => setWeather(data.current_weather))
    .then(data => setWeatherState(true))
  }

  return (
    <main className="flex justify-center items-center bg-gradient-to-br from-sky-400 via-rose-400 to-lime-400 h-[100vh] w-full">
      <section className="bg-white bg-opacity-20 backdrop-blur-lg drop-shadow-lg rounded w-full md:max-w-[500px] p-4 flex flex-col text-center justify-center md:px-10 lg:p-24 h-full lg:h-[500px]">
        <h1 className="text-4xl font-thin">Krinj Master <span className="font-bold">Forecast</span></h1>
        <p className="text-sm mt-2">Enter a city to get a weather forecast!</p>

        <div className="flex mt-10 md:mt-4 relative justify-center">
          <input type="text" value={term}  onChange={onInputChange} className="px-2 py-1 rounded-l-md border-2 border-white"/>
          <ul className="absolute top-9 bg-white rounded-b-md w-1/2">
          {showOptions &&  options && options.map((option: IOption) => ( 
          <li key={option.id}>
            <button className="text-left text-sm w-full hover:bg-zinc-700 hover:text-white px-2 py-4 cursor-pointer" onClick={() => onOptionSelect(option)}>{option.name}, {option.country}</button>
          </li>
          ))}
          </ul>
          <button onClick={() => onSubmit(dataWeather)} className="rounded-r-md border-2 border-zinc-100 hover;border-zinc-500 hover:text-zinc-100 px-2 py cursor-pointer">Search!</button>
          {weatherState && <div className="absolute top-10 bg-white rounded h-32 w-48 align-middle">
            <h1 className="font-normal">Current temperature: <br></br><span className="font-bold">{weather.temperature} °C</span></h1>
            <h1>Current windspeed: <br></br>{weather.windspeed} km/h</h1>
            <button onClick={() => setWeatherState(false)} className=" border rounded  hover:bg-zinc-700 hover:text-white px-4 cursor-pointer">Close</button>
          </div>}
        </div>
        <a href="https://open-meteo.com/" className="absolute top-1 font-bold text-white">&#9925; Weather data by Open-Meteo.com</a>
      </section>
    </main>
  )
}

export default App