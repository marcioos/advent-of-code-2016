/*
 * Helper functions
 */

const north = { label: 'N', left: 'W', right: 'E' }
const east = { label: 'E', left: 'N', right: 'S' }
const south = { label: 'S', left: 'E', right: 'W' }
const west = { label: 'W', left: 'S', right: 'N' }

const directions = [north, east, south, west]

const directionFromLabel = (label) => directions.filter((direction) => direction.label === label)[0]

const rotateLeft = (facingDirection) => directionFromLabel(facingDirection).left

const rotateRight = (facingDirection) => directionFromLabel(facingDirection).right

const calculateRotation = (facingDirection, rotationSide) => {
  switch (rotationSide) {
    case 'L':
      return rotateLeft(facingDirection)
    case 'R':
      return rotateRight(facingDirection)
  }
  throw "Unknown side: " + rotationSide
}

const findPositionVisitedTwice = (state, originCoord, targetCoord, visited, coord) => {
  var visitedTwice

  for (let i = originCoord; i <= targetCoord; i++) {
    const visitedPosition = { ...state.position }
    visitedPosition[coord] = i
    const visitedPositionAsString = JSON.stringify(visitedPosition)
    if (state.visitedPositions.some((position) => position === visitedPositionAsString)) {
      visitedTwice = visitedPosition
    }
    visited.push(visitedPositionAsString)
  }
  return visitedTwice
}

const calculateMovement = (state, distance) => {
  const visited = []
  var visitedTwice = state.firstPositionVisitedTwice
  var newPosition

  switch (state.facing) {
    case 'N':
      if (visitedTwice === undefined) {
        visitedTwice = findPositionVisitedTwice(state, state.position.y + 1, state.position.y + distance, visited, 'y')
      }
      newPosition = {...state.position, y: state.position.y + distance}
      break
    case 'E':
      if (visitedTwice === undefined) {
        visitedTwice = findPositionVisitedTwice(state, state.position.x + 1, state.position.x + distance, visited, 'x')
      }
      newPosition = {...state.position, x: state.position.x + distance}
      break
    case 'S':
      if (visitedTwice === undefined) {
        visitedTwice = findPositionVisitedTwice(state, state.position.y - distance, state.position.y - 1, visited, 'y')
      }
      newPosition = {...state.position, y: state.position.y - distance}
      break
    case 'W':
      if (visitedTwice === undefined) {
        visitedTwice = findPositionVisitedTwice(state, state.position.x - distance, state.position.x - 1, visited, 'x')
      }
      newPosition = {...state.position, x: state.position.x - distance}
      break
  }

  return {
    ...state,
    position: newPosition,
    visitedPositions: [...state.visitedPositions, ...visited],
    firstPositionVisitedTwice: visitedTwice
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
  facing: 'N',
  visitedPositions: [],
  firstPositionVisitedTwice: undefined
}

const noTimeForTaxicab = (state = initialState, action) => {
  switch (action.type) {
    case 'ROTATE':
      return {...state, facing: calculateRotation(state.facing, action.side)}
    case 'MOVE':
      return calculateMovement(state, action.distance)
    default:
      return state
  }
}

/*
 * Plumbing
 */

 const createStore = (reducer, initialState) => {
   let state = initialState

   return (action) => {
       state = reducer(state, action)
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

const store = createStore(noTimeForTaxicab, initialState)

let finalState

input.map((instruction) =>
  toActions(instruction).forEach(
    (action) => finalState = store(action)
  )
)

const calculateDistanceToOrigin = (position) => Math.abs(position.x) + Math.abs(position.y)

console.log("#1 Distance to bunny HQ: " + calculateDistanceToOrigin(finalState.position))
console.log("#2 Distance to bunny HQ: " + calculateDistanceToOrigin(finalState.firstPositionVisitedTwice))
