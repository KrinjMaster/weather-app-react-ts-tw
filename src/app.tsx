import { useState, ChangeEvent } from "react"
import { IOption } from "./interfaces/IOption"
import { IWeatherData } from "./interfaces/IWeatherData"

const App = () => {
  const [term, setTerm] = useState<string>('')
  const [options, setOptions] = useState([])
  const [showOptions, setShowOptions] = useState(true)
  const [dataWeather, setDataWeather] = useState<IOption>(Object)
  const [weather, setWeather] = useState<IWeatherData>(Object)
  const [weatherState, setWeatherState] = useState(false)
  const [unitTempState, setUnitTempState] = useState('celsius')
  const [unitSpeedState, setUnitSpeedState] = useState('kmh')
  const [image, setImage]=  useState<string>('')

  
  const getSearchOptions = (value: string) => {
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${value}&count=3`)
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
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${option.latitude}&longitude=${option.longitude}&current_weather=true&temperature_unit=${unitTempState}&windspeed_unit=${unitSpeedState}`)
    .then(response => response.json())
    .then(data => setWeather(data.current_weather))
    .then(data => setWeatherState(true))
  }

  const onUnitChange = ( ) => {
    if (unitTempState === 'celsius') {
      setUnitTempState('fahrenheit')
    } else if(unitTempState === 'fahrenheit') {
      setUnitTempState('celsius')
    }
    onUnitSpeedChange()
    setWeatherState(false)
  }

  const onUnitSpeedChange = () => {
    if (unitSpeedState === 'kmh') {
      setUnitSpeedState('mph')
    } else {
      setUnitSpeedState('kmh')
    }
    setWeatherState(false)
  }

  return (
    <main className="flex justify-center bg-zinc-700 h-[100vh] w-full">
      <section className="bg-white bg-opacity-20 backdrop-blur-lg drop-shadow-lg rounded w-full md:max-w-[900px] p-4 flex flex-col text-center md:px-10 lg:p-24 h-screen]">
        <h1 className="text-4xl font-thin text-white">Krinj Master <span className="font-bold">Forecast</span></h1>
        <p className="text-sm mt-2 text-white">Enter a city to get a weather forecast!</p>

        <div className="flex mt-10 md:mt-4 relative justify-center">
          <input type="text" value={term}  onChange={onInputChange} className="px-2 py-1 rounded-l-md border-2 border-white mt-[75px]"/>
          <ul className="absolute top-9 bg-white rounded-xl w-[225px] mt-[80px] mr-[70px]">
          {showOptions &&  options && options.map((option: IOption) => ( 
          <li key={option.id}>
            <button className="text-left text-sm w-full hover:bg-zinc-700 hover:text-white px-2 py-4 cursor-pointer" onClick={() => onOptionSelect(option)}>{option.name}, {option.country}</button>
          </li>
          ))}
          </ul>
          <button onClick={() => onSubmit(dataWeather)} className="rounded-r-md text-white border-2 border-zinc-100 hover;border-zinc-500 hover:text-zinc-100 px-2 py cursor-pointer mt-[75px]">Search!</button>
          <div className="flex justify-center absolute top-0">
            <h1 className="font-bold text-white mr-2">Metric Units</h1>
            <div>
              <input
                className="mt-[0.3rem] mr-2 h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-[rgba(0,0,0,0.25)] outline-none before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-white after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
                onChange={onUnitChange}
                />
              <label
                className="inline-block hover:cursor-pointer text-white font-bold"
                htmlFor="flexSwitchCheckDefault"
                >Imperial Units</label>
            </div>
          </div>
            {weatherState && <div className="absolute mt-[150px] bg-white bg-opacity-10 rounded-2xl h-64 w-96 align-middle text-white">
              <div className="flex flex-col mt-[45px]">
              <h1 className="font-bold content-center text-[50px]">
                {weather.temperature}° 
              </h1>
              <img src={image} alt="" className="absolute mt-[-5px] ml-[250px] w-[90px]"/>
              <div className="flex flex-col absolute top-[3px] ml-10">
                <h1 className="font-bold text-3xl">
                  {dataWeather.name}
                </h1>
                <h1 className="font-thin mt-[-8px]">
                  {dataWeather.country}
                </h1>
              </div>
                <h1 className="font-thin mb-[80px]"><span className="font-normal">{weather.windspeed} {unitSpeedState}</span> <br></br>windspeed </h1>
              <div>
              </div>
              </div>
              <button onClick={() => setWeatherState(false)} className="flex justify-center absolute text-center top-1 hover:text-red-600 text-2xl font-bold px-4 cursor-pointer ">X</button>
          </div>}
        </div>
        <a href="https://open-meteo.com/" className="absolute top-1 font-bold text-white opacity-50 left-9">&#9925; Weather data by Open-Meteo.com</a>
      </section>
    </main>
  )
}

export default App