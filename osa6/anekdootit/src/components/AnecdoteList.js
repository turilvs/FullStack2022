import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { createNotification } from '../reducers/notificationReducer'


const Anecdote = ({ anecdote, handleClick }) => {
    return(
        <div >
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={handleClick}>vote</button>
            </div>
        </div>
    )
}


const Anecdotes = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)

    const filteredAnecdotes = anecdotes.filter(a => (a.content.toLowerCase().includes(filter.toLowerCase())))
    const sortedAnecdotes = [...filteredAnecdotes].sort((a, b) => b.votes - a.votes)
    
    return(
      <div>
        {sortedAnecdotes
        .map(anecdote =>
          <Anecdote
            key={anecdote.id}
            anecdote={anecdote}
            handleClick={() => {
              dispatch(voteAnecdote(anecdote.id))
              dispatch(createNotification("you voted for '" + anecdote.content + "'"))
            }
            }
          />
        )}
      </div>
    )
}

export default Anecdotes