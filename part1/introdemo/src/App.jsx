import { useState } from 'react'

const Hello = (props) => {
  console.log(props);
  
  const friends = [
    {name: 'saca', age: '23'},
  ]

  return (
    <div>
      <p> Hello {props.name} and you are {props.age} </p>
      <p>{friends[0].age}</p>
    </div >
  )
}
const App = () => {
  const [counter, setCounter] = useState(0)

  return (
    <div>
      <p>
        <button onClick={() => setCounter(counter + 1)}>
          plus
        </button> {counter}
        <button onClick={() => setCounter(counter - 1)}>
          minus
        </button>
        <button onClick={() => setCounter(0)}>
          reset
        </button>
        {counter % 2 === 0 && <p>counter is even and is = {counter}</p>}
        {counter % 2 !== 0 && <p>counter is odd</p>}
      </p>

      <Hello name="haesh" age='23'/>

    </div>
  )
}

export default App