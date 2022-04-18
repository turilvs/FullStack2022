import { click } from '@testing-library/user-event/dist/click'
import { useState } from 'react'

const StatisticLine = (props) => {
  if(props.klikattu < 1) {
    return (
      <tr><td>{props.eiArvoja}</td></tr>
    )
  }
  else
    return (
      <tr><td>{props.text}</td><td>{props.value}</td></tr>
  )
}

const Button = (props) => (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
  


const App = () => {

  const [klikattu, setKlikattu] = useState(0)
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [points, setPoints] = useState(0)
  const [average, setAverage] = useState(0)
  const [gProsent, setGP] = useState(0)

  const setToGood = (value, allValue, points) => {
    
    setKlikattu(current => current + 1)
    setGood(value)
    setAll(allValue)
    setPoints(points)
    setAverage(points / allValue)
    setGP(value / allValue * 100)
  }

  const setToValue = (value, target, allValue, points, goodP) => {
    setKlikattu(current => current + 1)
    target(value)
    setAll(allValue)
    setPoints(points)
    setAverage(points / allValue)
    setGP(goodP / allValue * 100)
  }

  return (
    <div>
      <h1>give feedback</h1>

      <Button handleClick={() => setToGood(good + 1, all + 1, points + 1)} text="good" />
      <Button handleClick={() => setToValue(neutral + 1,setNeutral, all + 1, points + 0, good)} text="neutral" />
      <Button handleClick={() => setToValue(bad + 1, setBad, all + 1, points - 1, good)} text="bad" />

      <h1>statistics</h1>

      
      <table>
        <tbody>

          <StatisticLine eiArvoja={"No feedback given"} klikattu={klikattu} />
          <StatisticLine text="good" value ={good} klikattu={klikattu}/>
          <StatisticLine text="neutral" value ={neutral} klikattu={klikattu}/>
          <StatisticLine text="bad" value ={bad} klikattu={klikattu}/>
          <StatisticLine text="all" value ={all} klikattu={klikattu}/>
          <StatisticLine text="average" value ={average} klikattu={klikattu}/>
          <StatisticLine text="positive" value ={gProsent} klikattu={klikattu}/>          

        </tbody>
      </table>          
    </div>
  )
}

export default App
