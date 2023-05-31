import { useState, ChangeEvent, useReducer, useEffect } from "react"
import { IOption } from "./interfaces/IOption"
import { IWeatherData } from "./interfaces/IWeatherData"
import axios from "axios"
import WindPng from '../public/assets/icons8-wind-100-2.png'
import HumidityPng from '../public/assets/icons8-drop-of-blood-100.png'
import LoadPng from '../public/assets/time-left.png'
import Worker1 from '../public/assets/images.jpeg'
import Worker2 from '../public/assets/500x500.jpg'
import Worker3 from '../public/assets/rodney-amirebrahimi-bb10.jpg'
import BG from '../public/assets/Brookhaven_Village.jpg'

enum UnitActions {
  changeImperial = "changeImperial",
  changeMeter = "changeMeter",
}

interface UnitState {
  temperature_unit: string,
  windspeed_unit: string,
}

interface UnitAction {
  type: UnitActions
}



const UnitReducer = (state: UnitState, action: UnitAction) => {
  switch (action.type) { 
    case UnitActions.changeImperial:
      return {temperature_unit: 'fahrenheit', windspeed_unit: 'mph'}
    case UnitActions.changeMeter:
      return {temperature_unit: 'celsius', windspeed_unit: 'kmh'}
    default: return state
  }
}

enum DataActions {
  changeDataStateTrue= "changeDataStateT",
  changeLoadStateTrue= "changeLoadStateT",
  changeDataStateFalse= "changeDataStateF",
  changeLoadStateFalse= "changeLoadStateF"
}

interface DataAction {
  type: DataActions
}

interface DataState {
  dataState: boolean
  loadData: boolean
}

const DataReducer = (state: DataState, action: DataAction) => {
  switch (action.type) {
    case DataActions.changeDataStateTrue:
      return {dataState: true, loadData: state.loadData}
    case DataActions.changeDataStateFalse:
      return {dataState: false, loadData: state.loadData}
    case DataActions.changeLoadStateTrue:
      return {dataState: state.dataState, loadData: true}
    case DataActions.changeLoadStateFalse:
      return {dataState: state.dataState, loadData: false}
  }
}

const App = () => {
  const [term, setTerm] = useState<string>('')
  const [options, setOptions] = useState<IOption[] | null>([])
  const [showOptions, setShowOptions] = useState(true)
  const [UnitState, UnitDispatch] = useReducer(UnitReducer, {temperature_unit: 'celsius', windspeed_unit: 'kmh'})
  const [weatherData, setWeatherData] = useState(Object)
  const [weatherInfoObject, setWeatherInfoObject] = useState<IWeatherData | null>(Object)
  const [DataState, DataDispatch] = useReducer(DataReducer, {dataState: false, loadData: false})
  
  const getSearchOptions = async (value: string) => {
    const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${value}&count=3`)
    setOptions(response.data.results)
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTerm(value)
    setWeatherData(null)

    if (value === '') return
    
    getSearchOptions(value)
    setShowOptions(true)
    DataDispatch({type: DataActions.changeDataStateFalse})
  }

  const onOptionSelect = (option: IOption) => {
    setTerm(option.name)
    setShowOptions(false)
    setWeatherData(option)
    DataDispatch({type: DataActions.changeDataStateFalse})
  }

  const onSubmit = async (option: IOption) => {
    if (option === undefined) {
      alert('Please select option')
    }
    if (option === null) {
      alert('Please select option')
    }
    if (option.country === undefined) {
      alert('Please select option')
    }
    else {
      DataDispatch({type: DataActions.changeLoadStateTrue})
      DataDispatch({type: DataActions.changeDataStateFalse})
      const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${option.latitude}&longitude=${option.longitude}&hourly=temperature_2m,relativehumidity_2m&temperature_unit=${UnitState.temperature_unit}&windspeed_unit=${UnitState.windspeed_unit}&current_weather=true`)
      setWeatherInfoObject(response.data)
      DataDispatch({type: DataActions.changeLoadStateFalse})
      DataDispatch({type: DataActions.changeDataStateTrue})
    }
  }

  const onUnitChange = ( ) => {
      if (UnitState.temperature_unit === 'celsius') {
        UnitDispatch({type: UnitActions.changeImperial})
      } 
      else {
        UnitDispatch({type: UnitActions.changeMeter})
      }
      DataDispatch({type: DataActions.changeDataStateFalse})
  }

  const onClose = ( ) => {
    DataDispatch({type: DataActions.changeDataStateFalse})
  }

  return (<>
    <div className="bg-transparent fixed top-0 text-white z-50">
      <ul className="flex flex-row gap-5 z-50 w-screen justify-end px-5 text-3xl text-bold bg-white backdrop-blur-3xl bg-opacity-[0.5%] font-extrabold">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#history">History</a></li>
        <li><a href="#crew">Crew</a></li>
        <li><a href="#contacts">Contacts</a></li>
      </ul>
    </div>
    <main className="flex flex-col items-center justify-center align-middle bg-[rgb(16,16,16)] h-fit w-full">
      <section id="home" className="scale-100 backdrop-blur-lg w-full md:max-w-[90vw] p-4 flex flex-col text-center md:px-10 lg:p-24 h-[105vh]">
        <div className="scale-75 md:scale-100 lg:scale-150">
          <h1 className="text-4xl font-thin text-white">Krinj Master <span className="font-bold">Forecast</span></h1>
          <p className="text-sm text-white">Enter a city to get a weather forecast!</p>
          <div className="flex relative justify-center">
            <input type="text" value={term}  onChange={onInputChange} className="px-2 py-1 rounded-l-md border-2 border-white mt-[75px]"/>
            <ul className="absolute top-9 bg-white rounded-xl w-[225px] mt-[80px] mr-[70px]">
            {showOptions &&  options && options.map((option: IOption) => ( 
            <li key={option.id}>
              <button className="text-left text-sm w-full hover:bg-zinc-700 hover:text-white px-2 py-4 cursor-pointer" onClick={() => onOptionSelect(option)}>{option.name}, {option.country}</button>
            </li>
            ))}
            </ul>
            <button onClick={() => onSubmit(weatherData)} className="rounded-r-md text-white border-2 border-zinc-100 hover;border-zinc-500 hover:text-zinc-100 px-2 py cursor-pointer mt-[75px]">Search!</button>
            <div className="flex justify-center absolute top-0 ">
              <h1 className="font-bold text-white mr-2">Metric Units</h1>
              <div>
                <input
                  className="mt-[0.3rem] mr-2 h-3.5 w-8 bg-red-500 appearance-none rounded-[0.4375rem] outline-none before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-white after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]"
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
        </div>
            {DataState.loadData && 
              <div className="absolute left-0 right-0 ml-auto mr-auto mt-3 bg-white bg-opacity-10 rounded-2xl h-[12rem] w-[15rem] align-middle ">
                <img src={LoadPng} width="100px" alt="loading" className="ml-[4rem] mt-5" />
                <h1 className="text-[2rem]">Loading...</h1>
              </div>
            }
            {DataState.dataState &&  <div className="absolute scale-100 2xl:scale-150 2xl:mt-32 left-0 right-0 mt-0.5 ml-auto mr-auto bg-white bg-opacity-10 rounded-2xl h-[18rem] w-[23rem] align-middle text-white">
              <div className="flex flex-col mt-[45px]">
              <h1 className="font-bold content-center text-[50px]">
                {weatherInfoObject?.current_weather.temperature} {weatherInfoObject?.hourly_units.temperature_2m}
              </h1>
              <div className="flex flex-col absolute top-[3px] ml-10">
                <h1 className="font-bold text-3xl">
                  {weatherData.name}
                </h1>
                <h1 className="font-thin">
                  {weatherData.country}
                </h1>
              </div >
              <div className="flex justify-center gap-10 h-[45px]">
                <div className="flex align-middle gap-2" >
                  <img width="45px" src={WindPng}/>
                  <h1 className="font-bold text-[25px] mt-1">{weatherInfoObject?.current_weather.windspeed} {UnitState.windspeed_unit}</h1>
                </div>
                <div className="flex align-middle gap-2">
                  <img width="45px" src={HumidityPng}/>
                  <h1 className="font-bold text-[25px] mt-1"><span className="font-bold">{weatherInfoObject?.hourly.relativehumidity_2m[weatherInfoObject.hourly.time.indexOf(weatherInfoObject?.current_weather.time)]}%</span></h1>
                </div>
              </div>
              <div>
              </div>
              <div className="flex justify-center">
                <ul className="mt-10 flex gap-6 font-bold">
                    {weatherInfoObject?.hourly.time.slice(weatherInfoObject?.hourly.time.indexOf(weatherInfoObject?.current_weather.time) + 1, weatherInfoObject?.hourly.time.indexOf(weatherInfoObject?.current_weather.time) + 6).map((time, index) => {
                      return <li key={index}>
                        <h1>{time.slice(11,16)}</h1>
                        <h1 className="font-normal">
                          {weatherInfoObject.hourly.temperature_2m[index + weatherInfoObject?.hourly.time.indexOf(weatherInfoObject?.current_weather.time) - 2]} {weatherInfoObject.hourly_units.temperature_2m}
                        </h1>
                      </li>
                    })}
                </ul>
              </div>
              </div>
              <button onClick={() => onClose()} className="flex justify-center absolute text-center top-1 hover:text-red-600 text-2xl font-bold px-4 cursor-pointer ">X</button>
          </div>}
        </div>
      </section>
      <div id="about" className="h-screen bg-cover bg-opacity-30 bg-[url(/Users/krinjmaster/Desktop/weather-app-react-ts-tw/public/assets/Brookhaven_Village.jpg)] md:max-w-[80vw] text-white font-bold text-center w-full flex flex-col justify-center items-center">
          <h1 className="text-8xl z-50 backdrop-blur-sm rounded-xl 2xl:backdrop-blur-md">About</h1>
          <h2 className="text-3xl z-50 font-bold backdrop-blur-sm rounded 2xl:backdrop-blur-md">Provider of weather forecasts, content and data based in Brookhaven, Georgia. The company offers up-to-date weather information and localized forecasts to people through television, online, mobile and tablet screens.</h2>
      </div>
      <div id="history" className="h-screen text-white font-bold text-center w-full md:max-w-[90vw] flex flex-col px-5 justify-center items-center">
          <h1 className="text-8xl">History</h1>
          <h2 className="font-thin text-xl">Once upon a time, in a small town nestled in the foothills of a mountain range, there lived a young man named Alex. Alex had always been fascinated by the weather, and he spent countless hours studying meteorology and tracking weather patterns.
            One day, as he was walking home from his job at a local hardware store, Alex noticed that the sky was turning dark and ominous. He knew that a storm was brewing, but he had no way of knowing how severe it would be or when it would hit.
            That's when inspiration struck. What if he could create a company that would provide accurate and up-to-date weather forecasts to people all over the world? It was a bold idea, but Alex was determined to make it a reality.
            He spent months researching and developing his idea, pouring all of his time and energy into creating a weather forecasting system that would be both reliable and accessible. He worked tirelessly, often staying up late into the night, tweaking and refining his algorithms until they were as accurate as possible.
            Finally, after months of hard work, Alex launched his company. He called it "Krinj Forecast," and it quickly became a sensation. People all over the world were amazed by the accuracy of his forecasts, and soon, Krinj Forecast was the go-to source for weather information.</h2>
      </div>
      <div id="crew" className="h-screen text-white font-bold text-center w-full md:max-w-[90vw]">
          <h1 className="text-8xl mt-5">Our workers:</h1>
          <div className="flex gap-3 justify-center h-full mt-[25vh]" >
            <div className="flex flex-col items-center">
              <img src={Worker1} className="w-[135px] rounded-lg"/>
              <h1 className="mt-1">Peter Parker</h1>
              <h1 className="font-thin">Programmer</h1>
            </div>
            <div className="flex flex-col items-center">
              <img src={Worker3} className="w-[145px] rounded-lg"/>
              <h1 className="mt-1">James Charles</h1>
              <h1 className="font-thin">Designer</h1>
            </div>
            <div className="flex flex-col items-center">
              <img src={Worker2} className="w-[180px] rounded-lg"/>
              <h1 className="mt-1">Alex White</h1>
              <h1 className="font-thin">CEO</h1>
            </div>
          </div>
      </div>
      <div id="contacts" className="h-screen text-white font-bold text-center w-full md:max-w-[90vw] flex flex-col justify-center items-center">
        <div className="m-auto">
          <h1 className="text-8xl">Contacts:</h1>
          <div className="flex gap-5 justify-center">
            <a href="https://github.com/krinjmaster" target="_blank" className='text-blue-500 text-5xl'>GitHub</a>
            <a href="https://github.com/krinjmaster" target="_blank" className='text-blue-500 text-5xl'>Telegram</a>
            <a href="https://github.com/krinjmaster" target="_blank" className='text-blue-500 text-5xl'>OK</a>
          </div>
        </div>
        <a href="https://open-meteo.com/" className="bottom-1 font-bold text-white opacity-50 mt-auto mr-auto">&#9925; Weather data by Open-Meteo.com</a>
      </div>
    </main>
  </>
  )
}

export default App