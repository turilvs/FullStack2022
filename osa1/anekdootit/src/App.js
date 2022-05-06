import { useState } from 'react'
import React from 'react'


const random = () => {
  const numero= Math.floor(Math.random() * 7)
  console.log(numero)
  return numero
}


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
    
  const [selected, setSelected] = useState(0)
  const [arr, setArray] = useState(Array(7).fill(0))
  const isoinArvo = Math.max(...arr)
  const isoimmanIndeksi = arr.indexOf(isoinArvo)
  
  
  const setToVote = (current) => {
    const kopio = [...arr]
    kopio[selected] += 1
    setArray(kopio)
  }

  const setToSelected = (rnd) => {
    setSelected(rnd)
  }
  
  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div> {anecdotes[selected]}</div>
      <div> has {arr[selected]} votes</div>

      <button onClick={() => setToVote(selected)}>vote</button>      
      <button onClick={() => setToSelected(random)}>next anecdote</button>

      <h1>Anecdote with most votes</h1>
      <div>{anecdotes[isoimmanIndeksi]}</div>
      <div> has {isoinArvo} votes</div>
      
    </div>
  )
}

export default App