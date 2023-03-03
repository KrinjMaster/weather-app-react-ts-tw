export interface IWeatherData {
  current_weather: {
    temperature: number
    windspeed: number
    weathercode: number
    time: string
  }
  hourly_units: {
    temperature_2m: string
  }
  hourly: {
    time: string[]
    temperature_2m: []
    relativehumidity_2m: []
  }
}
