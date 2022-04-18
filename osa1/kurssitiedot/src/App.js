const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Content = (props) => {

  return (
    <div>
      <Part parts={props.parts[0].name + " " + props.parts[0].exercises} />
      <Part parts={props.parts[1].name + " " + props.parts[1].exercises} />
      <Part parts={props.parts[2].name + " " + props.parts[2].exercises} />
    </div>
  )
}

const Part = (props) => {

  return (
    <div>
      <p>{props.parts}</p>
    </div>
  )
}

const Total = (props) => {
  const yht = props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises
  return (
    <div>
      <p>{yht}</p>
    </div>
  )
}
export default App;
