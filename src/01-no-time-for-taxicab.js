/*
 * Helper functions
 */

const rotateLeft = (facingDirection) => {
  switch (facingDirection) {
    case 'N':
      return 'W'
    case 'E':
      return 'N'
    case 'S':
      return 'E'
    case 'W':
      return 'S'
  }
  throw "Unknown direction: " + facingDirection
}

const rotateRight = (facingDirection) => {
  switch (facingDirection) {
    case 'N':
      return 'E'
    case 'E':
      return 'S'
    case 'S':
      return 'W'
    case 'W':
      return 'N'
  }
  throw "Unknown direction: " + facingDirection
}

const calculateRotation = (facingDirection, rotationSide) => {
  switch (rotationSide) {
    case 'L':
      return rotateLeft(facingDirection)
    case 'R':
      return rotateRight(facingDirection)
  }
  throw "Unknown side: " + rotationSide
}

const calculateMovement = (state, distance) => {
  switch (state.facing) {
    case 'N':
      return {...state.position, y: state.position.y + distance}
    case 'E':
      return {...state.position, x: state.position.x + distance}
    case 'S':
      return {...state.position, y: state.position.y - distance}
    case 'W':
      return {...state.position, x: state.position.x - distance}
  }
}

const toActions = (instruction) => {
  const parsedInstruction = /([LR])(\d+)/.exec(instruction)

  return [ rotate(parsedInstruction[1]), move(parseInt(parsedInstruction[2])) ]
}


/*
 * Actions
 */

const rotate = (side) => ({ type: 'ROTATE', side })
const move = (distance) => ({ type: 'MOVE', distance })


/*
 * Reducer
 */

const initialState = {
  position: {
    x: 0,
    y: 0,
  },
  facing: 'N'
}

const noTimeForTaxicab = (state = initialState, action) => {
  switch (action.type) {
    case 'ROTATE':
      return {...state, facing: calculateRotation(state.facing, action.side)}
    case 'MOVE':
      return {...state, position: calculateMovement(state, action.distance)}
    default:
      return state
  }
}

/*
 * "main"
 */

 const input = ['R5','R4','R2','L3','R1','R1','L4','L5','R3','L1','L1','R4','L2','R1','R4','R4',
                'L2','L2','R4','L4','R1','R3','L3','L1','L2','R1','R5','L5','L1','L1','R3','R5',
                'L1','R4','L5','R5','R1','L185','R4','L1','R51','R3','L2','R78','R1','L4','R188',
                'R1','L5','R5','R2','R3','L5','R3','R4','L1','R2','R2','L4','L4','L5','R5','R4',
                'L4','R2','L5','R2','L1','L4','R4','L4','R2','L3','L4','R2','L3','R3','R2','L2',
                'L3','R4','R3','R1','L4','L2','L5','R4','R4','L1','R1','L5','L1','R3','R1','L2',
                'R1','R1','R3','L4','L1','L3','R2','R4','R2','L2','R1','L5','R3','L3','R3','L1',
                'R4','L3','L3','R4','L2','L1','L3','R2','R3','L2','L1','R4','L3','L5','L2','L4',
                'R1','L4','L4','R3','R5','L4','L1','L1','R4','L2','R5','R1','R1','R2','R1','R5',
                'L1','L3','L5','R2']

const createStore = (reducer, initialState) => {
  let state = initialState
  return (action) => {
      state = reducer(state, action)
      return state
  }
}

const store = createStore(noTimeForTaxicab, initialState)

let finalState = {}

input.map((instruction) =>
  toActions(instruction).forEach(
    (action) => finalState = store(action)
  )
)

const calculateDistanceToOrigin = (position) => Math.abs(position.x) + Math.abs(position.y)

console.log(calculateDistanceToOrigin(finalState.position))
