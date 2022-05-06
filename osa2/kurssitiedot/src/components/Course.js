const Content = (props) => {

    const initialValue = 0
    const total = props.part.reduce((sum, {exercises}) =>
      sum + exercises, initialValue
    )
  
    const part =  
      <div>
        {props.part.map(part => 
          <p key={part.id}>
            {part.name} {part.exercises}
          </p>       
        )}
        <h4>total of {total} exercises</h4>
      </div>
    return part 
  }
  
  const Course = (props) => {
    
    return (
      <div>
        <h1>Web development curriculum</h1>
        {props.courses.map(course => 
        <div key ={course.name}>
          <h3>{course.name}</h3>
          <Content part = {course.parts}/>
        </div>)}
      </div>
    )
  }

  export default Course