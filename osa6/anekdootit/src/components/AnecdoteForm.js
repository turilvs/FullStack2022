import {useDispatch} from 'react-redux'
import {createAnecdote} from '../reducers/anecdoteReducer'
import {createNotification} from '../reducers/notificationReducer'
import anecdoteService from "../services/anecdotes"


const NewAnecdote = (props) => {

  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
    dispatch(createNotification("new anecdote created: '" + content + "'"))
  }

  return (
    <div>
        <h2>create new</h2>
        <form onSubmit={addAnecdote}>
            <div><input name="anecdote"/></div>
            <button>create</button>
        </form>
    </div>
  )
}

export default NewAnecdote