export const PLAYER = 0;
export const PLAYER_MOVING = 1;
export const PLAYER_WIN = 4;
export const AI = 2;
export const AI_MOVING = 3;
export const AI_WIN = 5;

const MAX_HOUSE = 16;
const PLAYER_POINT_INDEX = 7;
const ENEMY_POINT_INDEX = 15;
const INF = 7 * 14;
const SEED_PER_HOUSE = 7;

let houses = [];
let turn = PLAYER;

const isPoint = index => index === PLAYER_POINT_INDEX || index === ENEMY_POINT_INDEX;

const isValidIndex = index => index >= 0 && index < PLAYER_POINT_INDEX && houses[index] > 0;

function swapState(state) {
  return [...state.slice(8, 16), ...state.slice(0, 8)];
}

export function init(firstTurn = true) {
  houses = [];
  for (let i = 0; i < MAX_HOUSE; i += 1) {
    houses.push(isPoint(i) ? 0 : SEED_PER_HOUSE);
  }
  turn = firstTurn ? PLAYER : AI;
}

export const getState = () => houses.slice();

const switchTurn = () => {
  turn = turn === PLAYER || turn === PLAYER_MOVING ? AI : PLAYER;
};

function checkWinner(currentState) {
  const allSeeds = MAX_HOUSE * SEED_PER_HOUSE;
  const allSeedsExceptPoint = allSeeds - currentState[PLAYER_POINT_INDEX] - currentState[ENEMY_POINT_INDEX];
  if (Math.abs(currentState[PLAYER_POINT_INDEX] - currentState[ENEMY_POINT_INDEX]) > allSeedsExceptPoint) {
    if (currentState[PLAYER_POINT_INDEX] > currentState[ENEMY_POINT_INDEX]) {
      return PLAYER_WIN;
    }
    return AI_WIN;
  }
  return -1;
}

function* move(state, grabHouse, realMove = false, swap = false) {
  const currentState = state.slice();
  let oneRound = false;

  let currentPos = grabHouse + 1;
  let grabSeed = currentState[grabHouse];
  currentState[grabHouse] = 0;

  yield { state: currentState, seed: grabSeed };

  while (grabSeed > 0) {
    if (currentPos === ENEMY_POINT_INDEX) {
      oneRound = true;
      currentPos = 0;
      continue;
    }

    if (currentPos !== PLAYER_POINT_INDEX && grabSeed === 1 && currentState[currentPos] !== 0) {
      grabSeed += currentState[currentPos];
      currentState[currentPos] = 0;
    } else {
      currentState[currentPos] += 1;
      grabSeed -= 1;
    }

    currentPos = (currentPos + 1) % MAX_HOUSE;
    yield { state: currentState, seed: grabSeed };
  }

  currentPos -= 1;
  if (oneRound && currentPos < PLAYER_POINT_INDEX && currentState[currentPos] === 1) {
    currentState[PLAYER_POINT_INDEX] += currentState[14 - currentPos] + 1;
    currentState[14 - currentPos] = 0;
    currentState[currentPos] = 0;
  }

  if (realMove) {
    checkWinner(currentState);
    switchTurn();
    houses = swap ? swapState(currentState) : currentState;
  }

  return currentState;
}

export function moveUntilEnd(state, grabHouse) {
  const stateStream = move(state, grabHouse);

  let result;
  for (let tmp = stateStream.next().value; tmp !== undefined; tmp = stateStream.next().value) {
    result = tmp;
  }

  return result;
}

function bestMove(state, depth, diffBefore) {
  let holeIndex;
  let playerPoint = -INF;
  let enemyPoint = INF;
  let diff = -INF;

  for (let i = 0; i < PLAYER_POINT_INDEX; i += 1) {
    if (depth === 0) {
      const newState = moveUntilEnd(state, i);
      if (newState[PLAYER_POINT_INDEX] - newState[ENEMY_POINT_INDEX] > diff) {
        holeIndex = i;
        playerPoint = newState[PLAYER_POINT_INDEX];
        enemyPoint = newState[ENEMY_POINT_INDEX];
      }
    } else {
      const nextState = swapState(moveUntilEnd(state, i));
      const temp = bestMove(nextState, depth - 1, diff);
      if (temp.enemyPoint - temp.playerPoint > diff) {
        holeIndex = i;
        playerPoint = temp.enemyPoint;
        enemyPoint = temp.playerPoint;
      }
    }
    diff = playerPoint - enemyPoint;
    if (-diff < diffBefore) break;
  }

  return { holeIndex, playerPoint, enemyPoint };
}

export function* aiPlay() {
  turn = AI_MOVING;

  const swappedState = swapState(houses);
  const index = bestMove(swappedState, 3, -INF).holeIndex;
  const stateStream = move(swappedState, index, true, true);
  for (let tmp = stateStream.next().value; tmp !== undefined; tmp = stateStream.next().value) {
    yield swapState(tmp.state);
  }
}

export function play(index) {
  if (!isValidIndex(index)) {
    throw new Error('Invalid move');
  }

  if (turn !== PLAYER) {
    throw new Error("You can't move at this moment");
  }

  turn = PLAYER_MOVING;

  return move(houses, index, true, false);
}

export const getTurn = () => turn;
