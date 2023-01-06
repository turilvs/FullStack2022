import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const initialState = []

  const anecdoteSlice = createSlice({
    name: 'anecdotes',
    initialState,
    reducers: {
      updateVote(state, action) {
        console.log(action)
        const id = action.payload
        const anecdoteToVote = state.find(a => a.id === id)
        const votedAnectode = { 
          ...anecdoteToVote, 
          votes: anecdoteToVote.votes + 1
        }
        
        return state.map(anecdote =>
          anecdote.id !== action.payload ? anecdote : votedAnectode)
      },
      appendAnecdote(state, action) {
        state.push(action.payload)
      },
      setAnecdotes(state, action) {
        return action.payload
      }
    }
  })

  export const initializeAnecdotes = () => {
    return async dispatch => {
      const anecdotes = await anecdoteService.getAll()
      dispatch(setAnecdotes(anecdotes))
    }
  }

  export const createAnecdote = content => {
    return async dispatch => {
      console.log(content)
      const newAnecdote = await anecdoteService.createNew(content)
      dispatch(appendAnecdote(newAnecdote))
    }
  }

  export const voteAnecdote = anecdote => {
    return async (dispatch) => {
      const votedAnecdote = await anecdoteService.update(anecdote)
      dispatch(updateVote(votedAnecdote.id))
    }
  }

  
  export const { updateVote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions
  export default anecdoteSlice.reducer