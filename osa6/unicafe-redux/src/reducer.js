const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }
  
  const counterReducer = (state = initialState, action) => {
    console.log(action)
    switch (action.type) {
      
      case 'GOOD':
        const copyGood = { 
          ...state, 
          good: state.good + 1
        }
        return copyGood

      case 'OK':
        const copyOk = { 
          ...state, 
          ok: state.ok + 1
        }
        return copyOk

      case 'BAD':
        const copyBad = { 
          ...state, 
          bad: state.bad + 1
        }
        return copyBad
        
      case 'ZERO':
        const zero =  {
          good: 0,
          ok: 0,
          bad: 0
        }
        return zero

      default: return state
    }
    
  }
  
  export default counterReducer