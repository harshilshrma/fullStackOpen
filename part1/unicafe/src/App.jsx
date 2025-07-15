import { useState } from 'react'

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Button = ({ onClick, text }) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const Statistics = ({ total, good, neutral, bad, average, positive }) => {
  return (
    <>
      <h1>Statistics</h1>
      {total === 0 ? (
        <p>No feedback given! :(</p>
      ) : (
        <table>
          <tbody>
            <StatisticLine text="Good" value={good} />
            <StatisticLine text="Neutral" value={neutral} />
            <StatisticLine text="Bad" value={bad} />
            <StatisticLine text="Total" value={total} />
            <StatisticLine text="Average Score" value={average} />
            <StatisticLine text="Positive Feedback" value={positive + " %"} />
          </tbody>
        </table>
      )}
    </>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleOnGoodClick = () => {
    setGood(good + 1);
  }

  const handleOnNeutralClick = () => {
    setNeutral(neutral + 1);
  }

  const handleOnBadClick = () => {
    setBad(bad + 1);
  }

  const total = good + neutral + bad
  const average = total === 0 ? 0 : (good - bad) / total
  const positive = total === 0 ? 0 : (good / total) * 100

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button onClick={handleOnGoodClick} text="Good" />
      <Button onClick={handleOnNeutralClick} text="Neutral" />
      <Button onClick={handleOnBadClick} text="Bad" />

      <Statistics
        total={total}
        average={average}
        positive={positive}
        good={good}
        neutral={neutral}
        bad={bad}
      />
    </div>
  )
}

export default App;