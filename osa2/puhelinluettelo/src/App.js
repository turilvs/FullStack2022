import { useState, useEffect } from 'react'
import personService from './services/persons'


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
    })  
  }

  const poista = (person) => {
    if (window.confirm(`Delete ${person.name}`)) {
      const copy = persons.filter(p => p.id != person.id);
      personService
      .poista(person.id)
      .then(response => {
        setPersons(copy)
        console.log('henkilö poistettu')
      })
    }
  }

  const updateNumber = (newPerson) => {
    const p = persons.find(person => person.name === newPerson.name)
    const newP = {...p, name : p.name, number: newPerson.number}
    personService.update(p.id, newP)
    .then(response => {
      setPersons(persons.map(person => person.name != newP.name ? person : response))
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
