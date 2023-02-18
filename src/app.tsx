import { useState, ChangeEvent } from "react"

const App = (): JSX.Element => {

  const [term, setTerm] = useState<string>('')

  const getSearchOptions = (value: string) => {
    fetch(`url`)
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setTerm(value)

    if (value === '') return

    getSearchOptions(value)
  }
 
  return (
    <main className="flex justify-center items-center bg-gradient-to-br from-sky-400 via-rose-400 to-lime-400 h-[100vh] w-full">
      <section className="bg-white bg-opacity-20 backdrop-blur-lg drop-shadow-lg rounded w-full md:max-w-[500px] p-4 flex flex-col text-center justify-center md:px-10 lg:p-24 h-full lg:h-[500px]">
        <h1 className="text-4xl font-thin">Weather <span className="font-bold">Forecast</span></h1>
        <p className="text-sm mt-2">Enter a place to get a weather forecast!</p>
        <div className="flex flex-row mt-10 md:mt-4 justify-center">
        <input type="text" value={term}  onChange={onInputChange} className="px-2 py-1 rounded-l-md border-2 border-white"/>
        <button className="rounded-r-md border-2 border-zinc-100 hover;border-zinc-500 hover:text-zinc-100 px-2 py cursor-pointer">Search!</button>
        </div>
      </section>
    </main>
  )
}

export default App