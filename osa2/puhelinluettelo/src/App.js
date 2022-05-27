import { useState, useEffect } from 'react'
import personService from './services/persons'



const Notification = (props) => {
  

  const messageStyle = {
    color: 'green',
    fontStyle: '',
    fontSize: 34,
    borderStyle: 'solid',
    marginBottom: 10,
    backgroundColor: '#D3D3D3'
  }

  const errorStyle = {
    color: 'red',
    fontStyle: '',
    fontSize: 34,
    borderStyle: 'solid',
    marginBottom: 10,
    backgroundColor: '#D3D3D3'
  }

  var style = messageStyle

  if (props.error === true) {
    style = errorStyle
    }
  
  if (props.message === null) {
    return null
  }

  return (
    <div className="message" style = {style}>
      {props.message}
    </div>
  )
}

const Poista = (props) => {
return <button onClick={() => props.poista(props.person)} >delete</button>
}

const Persons = (props) => {

  return <div>
    {props.filter.map(person => 
      <p key={person.name}>
        {person.name} {person.number} <Poista person = {person} poista = {props.poista}/>
      </p>
    )} 
    
  </div>
}

const PersonForm = (props) => {

  return <form>
    <div>name: <input value={props.newName} onChange={props.handleName}/></div>
    <div>number: <input value={props.newNumber} onChange={props.handleNumber}/></div>
    <div>
    <button onClick={props.setNewPerson} type="submit">add</button>
    </div>
  </form>
}

const Filter = (props) => {
  return <div>filter shown with <input value={props.filterPersons} onChange={props.handleFilter}/></div>
}

const App = () => {

  useEffect(() => {

    personService
    .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
        console.log('tiedot haettu')
      })
  }, [])
  
  
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterPersons, setFilter] = useState('')
  const [filter, setFilterBoolean] = useState(false)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState(null)
  const setNewFilter = filter ? persons.filter(person => person.name.toLowerCase().includes(filterPersons.toLowerCase()))
  : persons
  

  const setNewPerson = (event) => {
    event.preventDefault() 
    const copy = persons
    const nimet = copy.map(n => n.name)
    const newPerson = {name: newName, number: newNumber}
    if (nimet.includes(newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        updateNumber(newPerson)
        if(error ===true) {
          setError(false)
          setNewName('')
          setNewNumber('')
          return
        }
        setMessage(
          `Number of ${newPerson.name} is now changed`
        )
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      }
      setNewName('')
      setNewNumber('')
      return
    }

    personService
    .create(newPerson)
    .then(response => {
      setPersons(copy.concat(response))
      setNewName('')
      setNewNumber('')
      setMessage(
        `${newPerson.name} was added to phonebook`
      )
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    })
    .catch(error => {
      setError(true)
      setMessage(
        `${error.response.data.error}`
      )
      setTimeout(() => {
        setMessage(null)
        setError(false)
      }, 3000)
    })  
  }

  const poista = (person) => {
    if (window.confirm(`Delete ${person.name}`)) {
      const copy = persons.filter(p => p.id !== person.id);
      personService
      .poista(person.id)
      .then(response => {
        setPersons(copy)
        console.log('henkilö poistettu')
        setMessage(
          `${person.name} is now deleted`
        )
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
      .catch(error => {
        setError(true)
        setMessage(`Information of ${person.name} has already been removed from server`)
        setPersons(persons.filter(p => p.id !== person.id))
        setTimeout(() => {
          setMessage(null)
          setError(false)
        }, 3000)
      })
    }
  }

  const updateNumber = (newPerson) => {
    const p = persons.find(person => person.name === newPerson.name)
    const newP = {...p, name : p.name, number: newPerson.number}
    personService.update(p.id, newP)
    .then(response => {
      setPersons(persons.map(person => person.name !== newP.name ? person : response))
    })
    .catch(error => {
      setError(true)
      setMessage(`Information of ${p.name} has already been removed from server`)
      setPersons(persons.filter(person => person.id !== p.id))
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    })
  }
 
  const handleName = (event) => {
    setNewName(event.target.value)
  }

  const handleNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    const name = event.target.value
    setFilterBoolean(true)
    setFilter(name)
    
    if (name === '') {
      setFilterBoolean(false)
    }
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message = {message} error = {error}/>
      <Filter filterPersons = {filterPersons}  handleFilter = {handleFilter}/>
      <h2>add a new</h2>
      <PersonForm newName = {newName} 
        newNumber = {newNumber} 
        handleName = {handleName} 
        handleNumber = {handleNumber}
        setNewPerson = {setNewPerson}/>
      <h2>Numbers</h2>
      <div>
      <Persons filter = {setNewFilter} poista = {poista}/>
      
      </div>
    </div>
  )

}

export default App
